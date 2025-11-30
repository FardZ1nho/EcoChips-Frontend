import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Recompensa } from '../models/Recompensa';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RecompensaService {
  private url = `${base_url}/recompensas`; 
  private listaCambio = new Subject<Recompensa[]>();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔐 Token usado en recompensas:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  list() {
    return this.http.get<Recompensa[]>(this.url, { 
      headers: this.getAuthHeaders()
    });
  }

  insert(r: Recompensa) {
    return this.http.post(this.url, r, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  listId(id: number) {
    return this.http.get<Recompensa>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders()
    });
  }

  update(r: Recompensa) {
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

  setList(listaNueva: Recompensa[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}