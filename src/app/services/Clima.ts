import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

// Interfaces para el endpoint de clima (OpenWeather)
interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number; // Porcentaje
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  // ... otras propiedades necesarias
}

// Interfaces para el endpoint de contaminación del aire
interface AirPollutionResponse {
  list: Array<{
    dt: number;
    main: {
      aqi: number; // Air Quality Index
    };
    components: {
      co: number; // Monóxido de Carbono (µg/m³)
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ClimaService {

  private apiKey = environment.openWeatherApiKey;

  constructor(private http: HttpClient) {}

  // Obtener clima de Lima (Retorna Observable tipado)
  obtenerClimaLima(): Observable<OpenWeatherResponse> {
    return this.http.get<OpenWeatherResponse>(
      'https://api.openweathermap.org/data/2.5/weather?q=Lima&appid=${this.apiKey}&units=metric&lang=es'
    );
  }

  // Obtener contaminación del aire de Lima (Retorna Observable tipado)
  obtenerContaminacionLima(): Observable<AirPollutionResponse> {
    const lat = -12.0464; // latitud Lima
    const lon = -77.0428; // longitud Lima
    return this.http.get<AirPollutionResponse>(
      'https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}'
    );
  }
}