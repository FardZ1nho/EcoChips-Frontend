import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reto } from '../models/Reto';
import { Observable, Subject } from 'rxjs';
import { RetoPopularDTO } from '../models/RetoPopularDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Retoservice {
  private url = `${base_url}/retos`;
  private listaCambio = new Subject<Reto[]>();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔐 Token usado en retos:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  list() {
    return this.http.get<Reto[]>(this.url, { 
      headers: this.getAuthHeaders()
    });
  }

  insert(r: Reto) {
    return this.http.post(this.url, r, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  setList(listaNueva: Reto[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Reto>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders()
    });
  }

  update(r: Reto) {
    return this.http.put(this.url, r, { 
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

  getRetosPopulares(): Observable<RetoPopularDTO[]> {
    return this.http.get<RetoPopularDTO[]>(`${this.url}/reportes/populares`, { 
      headers: this.getAuthHeaders()
    });
  }
}