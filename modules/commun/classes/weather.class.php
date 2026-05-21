<?php

class weather
{
    private const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
    private const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

    public function searchPlaces($query, $limit = 5)
    {
        $query = trim((string) $query);
        if ($query === '') {
            return array();
        }

        $limit = max(1, min(10, (int) $limit));
        $data = $this->getJson(self::GEOCODING_URL, array(
            'name' => $query,
            'count' => $limit,
            'language' => 'fr',
            'format' => 'json'
        ));

        $results = isset($data['results']) && is_array($data['results']) ? $data['results'] : array();
        $places = array();

        foreach ($results as $place) {
            $places[] = array(
                'id' => isset($place['id']) ? (int) $place['id'] : null,
                'name' => $place['name'] ?? '',
                'country' => $place['country'] ?? '',
                'admin1' => $place['admin1'] ?? '',
                'latitude' => isset($place['latitude']) ? (float) $place['latitude'] : null,
                'longitude' => isset($place['longitude']) ? (float) $place['longitude'] : null,
                'timezone' => $place['timezone'] ?? null
            );
        }

        return $places;
    }

    public function getForecast($latitude, $longitude)
    {
        $latitude = (float) $latitude;
        $longitude = (float) $longitude;

        if ($latitude < -90 || $latitude > 90 || $longitude < -180 || $longitude > 180) {
            throw new InvalidArgumentException('Invalid coordinates');
        }

        $data = $this->getJson(self::FORECAST_URL, array(
            'latitude' => $latitude,
            'longitude' => $longitude,
            'current' => 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m',
            'hourly' => 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m',
            'daily' => 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,sunrise,sunset',
            'timezone' => 'auto',
            'forecast_days' => 7
        ));

        return array(
            'latitude' => $data['latitude'] ?? $latitude,
            'longitude' => $data['longitude'] ?? $longitude,
            'timezone' => $data['timezone'] ?? null,
            'utc_offset_seconds' => isset($data['utc_offset_seconds']) ? (int) $data['utc_offset_seconds'] : null,
            'current' => $data['current'] ?? null,
            'hourly' => $data['hourly'] ?? null,
            'daily' => $data['daily'] ?? null,
            'units' => array(
                'current' => $data['current_units'] ?? array(),
                'hourly' => $data['hourly_units'] ?? array(),
                'daily' => $data['daily_units'] ?? array()
            )
        );
    }

    private function getJson($url, array $params)
    {
        $query = http_build_query($params, '', '&', PHP_QUERY_RFC3986);
        $ch = curl_init($url . '?' . $query);

        if ($ch === false) {
            throw new RuntimeException('Unable to initialize cURL');
        }

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_USERAGENT, 'meteo360/0.1');

        $response = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($response === false || $status >= 400) {
            throw new RuntimeException($error ?: 'Weather provider request failed');
        }

        $data = json_decode($response, true);
        if (!is_array($data)) {
            throw new RuntimeException('Weather provider returned invalid JSON');
        }

        return $data;
    }
}