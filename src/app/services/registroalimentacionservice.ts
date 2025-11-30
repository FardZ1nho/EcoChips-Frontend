import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // ← Agregar HttpHeaders
import { RegistroAlimentacion } from '../models/RegistroAlimentacion';
import { Observable, Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RegistroAlimentacionService {
  private url = `${base_url}/registrosalimentacion`; 
  private listaCambio = new Subject<RegistroAlimentacion[]>();

  constructor(private http: HttpClient) {}

  // 🔥 MÉTODO PARA HEADERS DE AUTENTICACIÓN
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔐 Token usado en registro alimentación:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // 📋 LISTAR - SOLO ADMIN puede ver todos los registros
  list() {
    return this.http.get<RegistroAlimentacion[]>(this.url, { 
      headers: this.getAuthHeaders()
    });
  }

  // ➕ INSERTAR - USUARIO puede registrar su alimentación
  insert(r: RegistroAlimentacion) {
    console.log('🎯 Registrando alimentación...');
    return this.http.post(this.url, r, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  // 👁️ LISTAR POR ID - ADMIN o USUARIO dueño
  listId(id: number) {
    return this.http.get<RegistroAlimentacion>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders()
    });
  }

  // ✏️ ACTUALIZAR - ADMIN o USUARIO dueño
  update(r: RegistroAlimentacion) {
    return this.http.put(this.url, r, { 
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

  // 👤 LISTAR POR USUARIO - ADMIN o USUARIO dueño
  listarPorUsuario(idUsuario: number): Observable<RegistroAlimentacion[]> {
    return this.http.get<RegistroAlimentacion[]>(`${this.url}/usuario/${idUsuario}`);
  }

  setList(listaNueva: RegistroAlimentacion[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}