import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { SoporteSolicitud } from '../models/SoporteSolicitud';

const base_url = environment.base;

@Injectable({
  providedIn: 'root', 
})
export class SoporteSolicitudService {
  private url = `${base_url}/soporte`; 
  
  // ❌ ELIMINAMOS urlRespuesta de aquí porque ya tiene su propio servicio

  private listaCambio = new Subject<SoporteSolicitud[]>(); 
  
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  list() {
    return this.http.get<SoporteSolicitud[]>(this.url, { headers: this.getAuthHeaders() });
  }
  
  insert(s: SoporteSolicitud) {
    return this.http.post(this.url, s, { headers: this.getAuthHeaders(), responseType: 'text' });
  }
  
  // ❌ ELIMINADO: insertRespuesta ya no va aquí.
  
  setList(listaNueva: SoporteSolicitud[]) {
    this.listaCambio.next(listaNueva);
  }
  
  getList() {
    return this.listaCambio.asObservable();
  }
  
  listId(id: number) {
    return this.http.get<SoporteSolicitud>(`${this.url}/${id}`, { headers: this.getAuthHeaders() });
  }
  
  update(s: SoporteSolicitud) {
    return this.http.put(this.url, s, { headers: this.getAuthHeaders(), responseType: 'text' });
  }
  
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { headers: this.getAuthHeaders(), responseType: 'text' });
  }

  buscar(titulo: string) {
    return this.http.get<SoporteSolicitud[]>(`${this.url}/buscar/${titulo}`, { headers: this.getAuthHeaders() });
  }

  listarPorApartado(apartado: string) {
    return this.http.get<SoporteSolicitud[]>(`${this.url}/estado/${apartado}`, { headers: this.getAuthHeaders() });
  }
}