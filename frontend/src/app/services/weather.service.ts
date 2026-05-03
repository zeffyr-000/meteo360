import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ForecastResponse, PlacesResponse, WeatherForecast, WeatherPlace } from '../models/weather.models';

@Injectable({ providedIn: 'root' })
export class WeatherService {
    private readonly http = inject(HttpClient);
    private readonly apiBaseUrl = '/api';

    searchPlaces(query: string, limit = 5): Observable<WeatherPlace[]> {
        const params = new HttpParams().set('q', query).set('limit', limit);

        return this.http
            .get<PlacesResponse>(`${this.apiBaseUrl}/places`, { params })
            .pipe(map((response) => response.results ?? []));
    }

    getForecast(latitude: number, longitude: number): Observable<WeatherForecast> {
        const params = new HttpParams().set('latitude', latitude).set('longitude', longitude);

        return this.http
            .get<ForecastResponse>(`${this.apiBaseUrl}/forecast`, { params })
            .pipe(map((response) => response.forecast));
    }
}
