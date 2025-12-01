import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root', 
})
export class SoporteRespuestaService {
  // Ajusta esta ruta si tu backend tiene otra URL para insertar respuestas
  private url = `${base_url}/soporterespuestas`; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  // ✅ Método para guardar la respuesta
  insert(respuesta: any) {
    return this.http.post(this.url, respuesta, { 
      headers: this.getAuthHeaders(),
      // Si tu backend devuelve texto plano, usa 'text'. Si devuelve JSON, borra esta línea o pon 'json'.
      responseType: 'text' 
    });
  }
}