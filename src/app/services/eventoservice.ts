import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // ← AGREGAR HttpHeaders
import { Evento } from '../models/Evento';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Eventoservice {
  private url = `${base_url}/evento`;
  private listaCambio = new Subject<Evento[]>();

  constructor(private http: HttpClient) {}

  // 🔥 AGREGAR ESTE MÉTODO PARA HEADERS
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🎉 Token usado en eventos:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  list() {
    return this.http.get<Evento[]>(this.url, { 
      headers: this.getAuthHeaders()  // ← AGREGAR HEADERS
    });
  }

  insert(e: Evento) {
    console.log('📤 Insertando evento con headers...');
    return this.http.post(this.url, e, { 
      headers: this.getAuthHeaders(),  // ← AGREGAR HEADERS
      responseType: 'text' 
    });
  }

  setList(listaNueva: Evento[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Evento>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders()  // ← AGREGAR HEADERS
    });
  }

  update(e: Evento) {
    return this.http.put(`${this.url}/${e.idEvento}`, e, { 
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
}