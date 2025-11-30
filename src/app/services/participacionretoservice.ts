import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // ← Agregar HttpHeaders
import { ParticipacionReto } from '../models/ParticipacionReto';
import { Observable, Subject } from 'rxjs';
import { TopUsuarioDTO } from '../models/TopUsuarioDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ParticipacionRetoService {
  private url = `${base_url}/participacionretos`;
  private listaCambio = new Subject<ParticipacionReto[]>();

  constructor(private http: HttpClient) {}

  // 🔥 MÉTODO PARA HEADERS DE AUTENTICACIÓN
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔐 Token usado en participación retos:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // 📋 LISTAR - SOLO ADMIN puede ver todas las participaciones
  list() {
    return this.http.get<ParticipacionReto[]>(this.url, { 
      headers: this.getAuthHeaders()  // ← Solo admin puede acceder
    });
  }

  // ➕ INSERTAR - USUARIO puede registrar su participación
  insert(pr: ParticipacionReto) {
    console.log('🎯 Registrando participación en reto...');
    return this.http.post(this.url, pr, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  setList(listaNueva: ParticipacionReto[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  // 👁️ LISTAR POR ID - SOLO ADMIN o el usuario dueño
  listId(id: number) {
    return this.http.get<ParticipacionReto>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders()
    });
  }

  // ✏️ ACTUALIZAR - SOLO ADMIN o el usuario dueño
  update(pr: ParticipacionReto) {
    return this.http.put(this.url, pr, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  // 🗑️ ELIMINAR - SOLO ADMIN o el usuario dueño
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  // 📊 REPORTE TOP USUARIOS - TODOS pueden ver (sin auth)
  getTopUsuarios(): Observable<TopUsuarioDTO[]> {
    return this.http.get<TopUsuarioDTO[]>(`${this.url}/reportes/top-usuarios`);
    // ❗ SIN headers - acceso público
  }
}