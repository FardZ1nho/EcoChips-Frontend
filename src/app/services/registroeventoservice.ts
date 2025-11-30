import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegistroEvento } from '../models/RegistroEvento';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Registroeventoservice {
  private url = `${base_url}/registroeventos`;
  private listaCambio = new Subject<RegistroEvento[]>();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔐 Token usado en registro eventos:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  list() {
    return this.http.get<RegistroEvento[]>(this.url, { 
      headers: this.getAuthHeaders()
    });
  }

  insert(e: RegistroEvento) {
    return this.http.post(this.url, e, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  setList(listaNueva: RegistroEvento[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<RegistroEvento>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders()
    });
  }

  update(e: RegistroEvento) {
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
}