# API Documentation - Meteo360

L'API Meteo360 est une API JSON publique exposee sous `/api`. Elle est implementee avec Jelix 1.7 dans `modules/commun/controllers/default.classic.php`.

## Base URLs

Local direct:

```text
http://localhost:8888/meteo360/www/api
```

Local via Angular:

```text
http://localhost:4200/api
```

Production:

```text
https://meteo360.zeffyr.com/api
```

## Format General

Les endpoints meteo renvoient une enveloppe JSON:

```json
{
  "success": true,
  "results": []
}
```

ou:

```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

L'endpoint de statut `/api` renvoie une structure plus directe.

## Headers

L'API ajoute des headers CORS uniquement quand l'en-tete `Origin` appartient a la liste autorisee suivante:

- `http://localhost:4200`
- `http://127.0.0.1:4200`
- `https://meteo360.zeffyr.com`

Exemple de reponse pour une origine autorisee:

```http
Access-Control-Allow-Origin: http://localhost:4200
Vary: Origin
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

Si l'origine n'est pas autorisee, l'API ne renvoie pas de header `Access-Control-Allow-Origin`.

Les headers de securite sont ajoutes dans `www/index.php`.

## GET /api

Retourne l'etat minimal de l'API.

### Exemple

```bash
curl 'http://localhost:8888/meteo360/www/api'
```

### Reponse 200

```json
{
  "name": "Meteo360 API",
  "version": "0.1.0",
  "status": "ok",
  "database": false
}
```

## GET /api/places

Recherche des lieux via Open-Meteo Geocoding.

### Parametres

| Nom     | Type    | Requis | Description                                        |
| ------- | ------- | ------ | -------------------------------------------------- |
| `q`     | string  | oui    | Texte recherche, par exemple `Paris`               |
| `limit` | integer | non    | Nombre de resultats, borne entre 1 et 10, defaut 5 |

### Exemple

```bash
curl 'http://localhost:8888/meteo360/www/api/places?q=Paris&limit=5'
```

### Reponse 200

```json
{
  "success": true,
  "results": [
    {
      "id": 2988507,
      "name": "Paris",
      "country": "France",
      "admin1": "Ile-de-France",
      "latitude": 48.85341,
      "longitude": 2.3488,
      "timezone": "Europe/Paris"
    }
  ]
}
```

### Reponse 500

```json
{
  "success": false,
  "error": "Impossible de rechercher les lieux"
}
```

## GET /api/forecast

Retourne les previsions pour une latitude et une longitude.

### Parametres

| Nom         | Type   | Requis | Description                 |
| ----------- | ------ | ------ | --------------------------- |
| `latitude`  | number | oui    | Latitude entre -90 et 90    |
| `longitude` | number | oui    | Longitude entre -180 et 180 |

Alias acceptes pour compatibilite:

- `lat`
- `lon`

### Exemple

```bash
curl 'http://localhost:8888/meteo360/www/api/forecast?latitude=48.85341&longitude=2.3488'
```

### Reponse 200

```json
{
  "success": true,
  "forecast": {
    "latitude": 48.86,
    "longitude": 2.34,
    "timezone": "Europe/Paris",
    "current": {
      "time": "2026-05-03T19:15",
      "temperature_2m": 20,
      "relative_humidity_2m": 55,
      "apparent_temperature": 18.7,
      "is_day": 1,
      "precipitation": 0,
      "weather_code": 3,
      "cloud_cover": 99,
      "wind_speed_10m": 10.3,
      "wind_direction_10m": 192
    },
    "hourly": {
      "time": [],
      "temperature_2m": [],
      "precipitation_probability": [],
      "weather_code": [],
      "wind_speed_10m": []
    },
    "daily": {
      "time": [],
      "weather_code": [],
      "temperature_2m_max": [],
      "temperature_2m_min": [],
      "precipitation_sum": [],
      "wind_speed_10m_max": []
    },
    "units": {
      "current": {},
      "hourly": {},
      "daily": {}
    }
  }
}
```

### Reponse 400

Parametres manquants:

```json
{
  "success": false,
  "error": "Les parametres latitude et longitude sont requis"
}
```

Coordonnees invalides:

```json
{
  "success": false,
  "error": "Coordonnees invalides"
}
```

### Reponse 500

```json
{
  "success": false,
  "error": "Impossible de recuperer la meteo"
}
```

## OPTIONS

Les endpoints acceptent `OPTIONS` et renvoient les headers CORS sans traitement metier.

## Frontend Contract

Le frontend consomme l'API dans `frontend/src/app/services/weather.service.ts`.

Regles:

- `searchPlaces()` mappe `PlacesResponse.results` vers `WeatherPlace[]`.
- `getForecast()` mappe `ForecastResponse.forecast` vers `WeatherForecast`.
- Les composants ne doivent pas appeler Open-Meteo directement.
- Les composants ne doivent pas reconstruire les URLs API eux-memes.

## Provider Contract

Le backend appelle Open-Meteo dans `modules/commun/classes/weather.class.php`.

Regles:

- Timeout total: 10 secondes.
- Timeout connexion: 5 secondes.
- User-Agent: `meteo360/0.1`.
- Les erreurs fournisseur sont journalisees par le controleur et renvoyees sous forme d'erreur applicative.
