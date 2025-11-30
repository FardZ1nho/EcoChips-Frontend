import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Alimento } from '../models/Alimento';
import { Observable, Subject } from 'rxjs';
import { TipoAlimentoCO2DTO } from '../models/TipoAlimentoCO2DTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class AlimentoService {
  private url = `${base_url}/alimentos`; 
  private listaCambio = new Subject<Alimento[]>();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🍎 Token usado en alimentos:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  list() {
    return this.http.get<Alimento[]>(this.url, { 
      headers: this.getAuthHeaders()  // ← AGREGAR HEADERS
    });
  }

  insert(a: Alimento) {
    console.log('📤 Insertando alimento con headers...');
    return this.http.post(this.url, a, { 
      headers: this.getAuthHeaders(),  // ← AGREGAR HEADERS
      responseType: 'text' 
    });
  }

  listId(id: number) {
    return this.http.get<Alimento>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders()  // ← AGREGAR HEADERS
    });
  }

  update(a: Alimento) {
    return this.http.put(this.url, a, { 
      headers: this.getAuthHeaders(),  // ← AGREGAR HEADERS
      responseType: 'text' 
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders(),  // ← AGREGAR HEADERS
      responseType: 'text' 
    });
  }

  setList(listaNueva: Alimento[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  getPromedioCO2PorTipo(): Observable<TipoAlimentoCO2DTO[]> {
    return this.http.get<TipoAlimentoCO2DTO[]>(
      `${this.url}/reportes/promedio-co2-tipo`, 
      { 
        headers: this.getAuthHeaders()  // ← AGREGAR HEADERS
      }
    );
  }
}