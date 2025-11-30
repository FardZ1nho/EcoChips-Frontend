import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegistroTransporte } from '../models/RegistroTransporte';
import { Observable, Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RegistroTransporteService {
  private url = `${base_url}/registrostransporte`; 
  private listaCambio = new Subject<RegistroTransporte[]>();

  constructor(private http: HttpClient) {}

  // 🔥 MÉTODO PARA HEADERS DE AUTENTICACIÓN
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔐 Token usado en registro transporte:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // 📋 LISTAR - SOLO ADMIN puede ver todos los registros
  list() {
    return this.http.get<RegistroTransporte[]>(this.url, { 
      headers: this.getAuthHeaders()
    });
  }

  // ➕ INSERTAR - USUARIO puede registrar su transporte
  insert(rt: RegistroTransporte) {
    console.log('🎯 Registrando transporte...');
    return this.http.post(this.url, rt, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  // 👁️ LISTAR POR ID - ADMIN o USUARIO dueño
  listId(id: number) {
    return this.http.get<RegistroTransporte>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders()
    });
  }

  // ✏️ ACTUALIZAR - ADMIN o USUARIO dueño
  update(rt: RegistroTransporte) {
    return this.http.put(this.url, rt, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  // 🗑️ ELIMINAR - ADMIN o USUARIO dueño
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  listarPorUsuario(idUsuario: number): Observable<RegistroTransporte[]> {
    return this.http.get<RegistroTransporte[]>(`${this.url}/usuario/${idUsuario}`);
  }

  setList(listaNueva: RegistroTransporte[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}