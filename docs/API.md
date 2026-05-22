# API Documentation - Meteo360

Meteo360 exposes a public JSON API under `/api`. The API is implemented with Jelix 1.7 in `modules/commun/controllers/default.classic.php` and normalized through the `commun~weather` service.

## Base URLs

Direct local access:

```text
http://localhost:8888/meteo360/www/api
```

Local access through the Angular dev server:

```text
http://localhost:4200/api
```

Production:

```text
https://meteo360.zeffyr.com/api
```

## Response Shapes

The weather endpoints return a JSON envelope:

```json
{
  "success": true,
  "results": []
}
```

or:

```json
{
  "success": false,
  "error": "<human-readable error message>"
}
```

`/api/forecast` uses `forecast` instead of `results` in the success payload.

The status endpoint `/api` returns a direct JSON object rather than the generic success envelope.

Current backend error messages are human-readable French strings, for example `Parametres de recherche invalides`, `Coordonnees invalides`, or `Impossible de recuperer la meteo`.

## CORS Policy

The controller adds CORS headers only when the request `Origin` is one of these values:

```text
http://127.0.0.1:4200
http://localhost:4200
https://meteo360.zeffyr.com
```

Allowed methods are `GET, OPTIONS` and allowed headers are `Content-Type, Authorization`.

## `GET /api`

Returns the API status payload.

Example response:

```json
{
  "name": "Meteo360 API",
  "version": "0.1.0",
  "status": "ok",
  "database": false
}
```

Notes:

- `database` is explicitly `false` because the MVP has no database layer.
- `OPTIONS` requests are accepted for preflight handling.

## `GET /api/places`

Searches for places through the Open-Meteo geocoding API.

### Query Parameters

| Name | Type | Required | Default | Notes |
| ---- | ---- | -------- | ------- | ----- |
| `q` | string | No | empty string | Empty input returns an empty result list |
| `limit` | integer | No | `5` | Controller validates integer input, service clamps the range to `1..10` |

### Example Request

```bash
curl 'https://meteo360.zeffyr.com/api/places?q=Paris&limit=5'
```

### Success Response

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

### Error Behavior

- `400 Bad Request` for invalid parameter types, such as a non-integer `limit`
- `500 Internal Server Error` when the provider request fails or returns invalid data

Implementation notes:

- The upstream geocoding request currently uses `language=fr`
- An empty `q` value returns `success: true` with an empty `results` array

## `GET /api/forecast`

Returns the current, hourly, and daily forecast for a location.

### Query Parameters

| Name | Type | Required | Notes |
| ---- | ---- | -------- | ----- |
| `latitude` | number | Yes | `lat` is accepted as a fallback alias |
| `longitude` | number | Yes | `lon` is accepted as a fallback alias |

### Example Request

```bash
curl 'https://meteo360.zeffyr.com/api/forecast?latitude=48.85341&longitude=2.3488'
```

### Success Response

```json
{
  "success": true,
  "forecast": {
    "latitude": 48.85341,
    "longitude": 2.3488,
    "timezone": "Europe/Paris",
    "current": {
      "time": "2026-05-09T14:30",
      "interval": 900,
      "temperature_2m": 19.8,
      "relative_humidity_2m": 58,
      "apparent_temperature": 18.9,
      "is_day": 1,
      "precipitation": 0,
      "weather_code": 3,
      "cloud_cover": 76,
      "wind_speed_10m": 11.4,
      "wind_direction_10m": 205,
      "wind_gusts_10m": 19.2
    },
    "hourly": {
      "time": ["2026-05-09T14:00", "2026-05-09T15:00"],
      "temperature_2m": [19.8, 20.2],
      "apparent_temperature": [18.9, 19.4],
      "relative_humidity_2m": [58, 55],
      "precipitation_probability": [5, 10],
      "weather_code": [3, 61],
      "wind_speed_10m": [11.4, 13.1],
      "wind_direction_10m": [205, 212],
      "wind_gusts_10m": [19.2, 22.4],
      "uv_index": [4.2, 4.8]
    },
    "daily": {
      "time": ["2026-05-09", "2026-05-10"],
      "weather_code": [3, 61],
      "temperature_2m_max": [21.4, 18.7],
      "temperature_2m_min": [12.1, 10.4],
      "precipitation_sum": [0, 2.3],
      "wind_speed_10m_max": [18.2, 24.6],
      "sunrise": ["2026-05-09T06:18", "2026-05-10T06:17"],
      "sunset": ["2026-05-09T21:19", "2026-05-10T21:20"]
    },
    "units": {
      "current": {
        "time": "iso8601",
        "interval": "seconds",
        "temperature_2m": "°C",
        "relative_humidity_2m": "%",
        "apparent_temperature": "°C",
        "is_day": "",
        "precipitation": "mm",
        "weather_code": "wmo code",
        "cloud_cover": "%",
        "wind_speed_10m": "km/h",
        "wind_direction_10m": "°",
        "wind_gusts_10m": "km/h"
      },
      "hourly": {
        "time": "iso8601",
        "temperature_2m": "°C",
        "apparent_temperature": "°C",
        "relative_humidity_2m": "%",
        "precipitation_probability": "%",
        "weather_code": "wmo code",
        "wind_speed_10m": "km/h",
        "wind_direction_10m": "°",
        "wind_gusts_10m": "km/h",
        "uv_index": ""
      },
      "daily": {
        "time": "iso8601",
        "weather_code": "wmo code",
        "temperature_2m_max": "°C",
        "temperature_2m_min": "°C",
        "precipitation_sum": "mm",
        "wind_speed_10m_max": "km/h",
        "sunrise": "iso8601",
        "sunset": "iso8601"
      }
    }
  }
}
```

### Returned Forecast Sections

- `current`: the current weather object returned by Open-Meteo, or `null` if the provider omits it
- `hourly`: hourly arrays for temperature, apparent temperature, relative humidity, precipitation probability, weather code, wind speed, wind direction, wind gusts, and UV index, or `null` if omitted
- `daily`: daily arrays for weather code, max and min temperature, precipitation sum, max wind speed, sunrise, and sunset, or `null` if omitted
- `units`: normalized unit maps for `current`, `hourly`, and `daily`

Contract note:

- Meteo360 intentionally exposes wind gust and UV detail through the `hourly` section (`wind_gusts_10m`, `uv_index`). The current public `daily` contract does not include `wind_gusts_10m_max` or `uv_index_max`.

### Error Behavior

- `400 Bad Request` when latitude or longitude is missing
- `400 Bad Request` when coordinates are not numeric or outside valid geographic bounds
- `500 Internal Server Error` when the provider request fails or returns invalid data

## Provider Boundary

Meteo360 keeps provider-specific logic on the backend. The frontend calls only `/api/places` and `/api/forecast` through `WeatherService`.

This keeps the browser-side contract stable even if the provider payload changes later.
