<?php

class defaultCtrl extends jController
{
    private function scalarParam($primaryName, $fallbackName = null, $default = null)
    {
        $fallback = $fallbackName === null ? $default : $this->param($fallbackName, $default);
        $value = $this->param($primaryName, $fallback);

        if ($value === null) {
            return null;
        }

        if (!is_scalar($value)) {
            throw new InvalidArgumentException('Invalid parameter');
        }

        return trim((string) $value);
    }

    private function integerParam($name, $default)
    {
        $value = $this->scalarParam($name, null, (string) $default);

        if ($value === '') {
            return $default;
        }

        if (filter_var($value, FILTER_VALIDATE_INT) === false) {
            throw new InvalidArgumentException('Invalid integer parameter');
        }

        return (int) $value;
    }

    private function coordinateParam($primaryName, $fallbackName)
    {
        $value = $this->scalarParam($primaryName, $fallbackName);

        return $value === '' ? null : $value;
    }

    private function jsonResponse()
    {
        $rep = $this->getResponse('json');

        $origin = isset($_SERVER['HTTP_ORIGIN']) ? rtrim($_SERVER['HTTP_ORIGIN'], '/') : null;
        $allowedOrigins = array(
            'http://127.0.0.1:4200',
            'http://localhost:4200',
            'https://meteo360.zeffyr.com'
        );

        if ($origin !== null && in_array($origin, $allowedOrigins, true)) {
            $rep->addHttpHeader('Access-Control-Allow-Origin', $origin);
            $rep->addHttpHeader('Vary', 'Origin');
            $rep->addHttpHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            $rep->addHttpHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        return $rep;
    }

    private function weatherService()
    {
        return jClasses::getService('commun~weather');
    }

    public function index()
    {
        $rep = $this->jsonResponse();

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            return $rep;
        }

        $rep->data = array(
            'name' => 'Meteo360 API',
            'version' => '0.1.0',
            'status' => 'ok',
            'database' => false
        );

        return $rep;
    }

    public function places()
    {
        $rep = $this->jsonResponse();

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            return $rep;
        }

        try {
            $query = $this->scalarParam('q', null, '');
            $limit = $this->integerParam('limit', 5);

            $rep->data = array(
                'success' => true,
                'results' => $this->weatherService()->searchPlaces($query, $limit)
            );
        } catch (InvalidArgumentException $e) {
            $rep->setHttpStatus(400, 'Bad Request');
            $rep->data = array(
                'success' => false,
                'error' => 'Parametres de recherche invalides'
            );
        } catch (Exception $e) {
            jLog::log($e->getMessage(), 'error');
            $rep->setHttpStatus(500, 'Internal Server Error');
            $rep->data = array(
                'success' => false,
                'error' => 'Impossible de rechercher les lieux'
            );
        }

        return $rep;
    }

    public function forecast()
    {
        $rep = $this->jsonResponse();

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            return $rep;
        }

        try {
            $latitude = $this->coordinateParam('latitude', 'lat');
            $longitude = $this->coordinateParam('longitude', 'lon');

            if ($latitude === null || $longitude === null) {
                $rep->setHttpStatus(400, 'Bad Request');
                $rep->data = array(
                    'success' => false,
                    'error' => 'Les parametres latitude et longitude sont requis'
                );
                return $rep;
            }

            if (!is_numeric($latitude) || !is_numeric($longitude)) {
                throw new InvalidArgumentException('Invalid coordinates');
            }

            $rep->data = array(
                'success' => true,
                'forecast' => $this->weatherService()->getForecast($latitude, $longitude)
            );
        } catch (InvalidArgumentException $e) {
            $rep->setHttpStatus(400, 'Bad Request');
            $rep->data = array(
                'success' => false,
                'error' => 'Coordonnees invalides'
            );
        } catch (Exception $e) {
            jLog::log($e->getMessage(), 'error');
            $rep->setHttpStatus(500, 'Internal Server Error');
            $rep->data = array(
                'success' => false,
                'error' => 'Impossible de recuperer la meteo'
            );
        }

        return $rep;
    }
}
