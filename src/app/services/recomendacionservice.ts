import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Recomendacion } from '../models/Recomendacion';
import { Subject, Observable, map } from 'rxjs'; 
import { RecomendacionTipoCountDTO } from '../models/RecomendacionTipoCountDTO'; 

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Recomendacionservice {
  private url = `${base_url}/recomendaciones`;
  private listaCambio = new Subject<Recomendacion[]>();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔐 Token usado en recomendaciones:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  list() {
    return this.http.get<Recomendacion[]>(this.url, { 
      headers: this.getAuthHeaders()
    });
  }

  insert(e: Recomendacion) {
    return this.http.post(this.url, e, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  setList(listaNueva: Recomendacion[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Recomendacion>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders()
    });
  }

  update(e: Recomendacion) {
    return this.http.put(`${this.url}`, e, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  getRecomendacionesPorTipo(): Observable<RecomendacionTipoCountDTO[]> {
    const reporteUrl = `${this.url}/reportes/por-tipo`; 
    return this.http.get<RecomendacionTipoCountDTO[]>(reporteUrl, { 
      headers: this.getAuthHeaders()
    });
  }
}