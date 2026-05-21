export interface WeatherPlace {
    id: number | null;
    name: string;
    country: string;
    admin1: string;
    latitude: number | null;
    longitude: number | null;
    timezone: string | null;
}

export interface PlacesResponse {
    success: boolean;
    results: WeatherPlace[];
    error?: string;
}

export interface WeatherCurrent {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
}

export interface WeatherHourly {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
}

export interface WeatherDaily {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max?: number[];
    uv_index_max?: number[];
    sunrise?: string[];
    sunset?: string[];
}

export interface WeatherForecast {
    latitude: number;
    longitude: number;
    timezone: string | null;
    utc_offset_seconds: number | null;
    current: WeatherCurrent | null;
    hourly: WeatherHourly | null;
    daily: WeatherDaily | null;
    units: {
        current: Record<string, string>;
        hourly: Record<string, string>;
        daily: Record<string, string>;
    };
}

export interface ForecastResponse {
    success: boolean;
    forecast: WeatherForecast;
    error?: string;
}

export interface HourlyPreview {
    time: string;
    temperature: number;
    precipitationProbability: number;
    windSpeed: number;
    weatherCode: number;
}

export interface DailyPreview {
    time: string;
    min: number;
    max: number;
    precipitation: number;
    windSpeed: number;
    weatherCode: number;
}

export type TimelineSlotKind = 'now' | 'hour' | 'morning' | 'afternoon' | 'midday';

export interface TimelineSlot {
    hourIndex: number;
    kind: TimelineSlotKind;
    time: string;
    isToday: boolean;
    temperature: number;
    dailyMax: number | null;
    dailyMin: number | null;
    precipitationProbability: number;
    windSpeed: number;
    weatherCode: number;
}
