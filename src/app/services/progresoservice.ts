import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Progreso } from '../models/Progreso';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Progresoservice {
  private url = `${base_url}/progreso`;
  private listaCambio = new Subject<Progreso[]>();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔐 Token usado en progreso:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  list() {
    return this.http.get<Progreso[]>(this.url, { 
      headers: this.getAuthHeaders()
    });
  }

  insert(e: Progreso) {
    console.log('🎯 Registrando progreso...');
    return this.http.post(this.url, e, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  setList(listaNueva: Progreso[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Progreso>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders()
    });
  }

  update(e: Progreso) {
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

  obtenerPorUsuario(idUsuario: number) {
    return this.http.get<Progreso>(`${this.url}/usuario/${idUsuario}`, { 
      headers: this.getAuthHeaders()
    });
  }

  agregarPuntos(idUsuario: number, puntos: number) {
    return this.http.post(`${this.url}/agregar-puntos/${idUsuario}/${puntos}`, {}, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  cambiarEstado(idUsuario: number, estado: string) {
    return this.http.post(`${this.url}/cambiar-estado/${idUsuario}`, estado, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }
}