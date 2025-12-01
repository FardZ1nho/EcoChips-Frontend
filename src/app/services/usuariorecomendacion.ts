import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioRecomendacion } from '../models/UsuarioRecomendacion';
import { Subject, Observable } from 'rxjs';
import { Recomendacion } from '../models/Recomendacion';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class UsuarioRecomendacionService {
  private url = `${base_url}/usuariorecomendaciones`; 
  private listaCambio = new Subject<UsuarioRecomendacion[]>();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔐 Token usado en usuario recomendación:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  list(): Observable<UsuarioRecomendacion[]> {
    return this.http.get<UsuarioRecomendacion[]>(this.url, { 
      headers: this.getAuthHeaders()
    });
  }

  insert(ur: UsuarioRecomendacion) {
    return this.http.post(this.url, ur, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  listId(id: number) {
    return this.http.get<UsuarioRecomendacion>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders()
    });
  }

  update(ur: UsuarioRecomendacion) {
    return this.http.put(`${this.url}/${ur.idUsuarioRecomendacion}`, ur, { 
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

  listarRecomendacionesPorUsuario(idUsuario: number): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>(`${this.url}/usuario/${idUsuario}/recomendaciones`, { 
      headers: this.getAuthHeaders()
    });
  }

  asignarRecomendacion(idUsuario: number, idRecomendacion: number) {
    return this.http.post(`${this.url}/asignar/${idUsuario}/${idRecomendacion}`, null, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  setList(listaNueva: UsuarioRecomendacion[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  getTiposRecomendacionesMasAsignados() {
  return this.http.get<any[]>(`${this.url}/reportes/tipos-mas-asignados`, { 
    headers: this.getAuthHeaders()
  });
}
}