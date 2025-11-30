import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/Usuario';
import { Subject, Observable } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Usuarioservice {
  private url = `${base_url}/Usuarios`;
  private listaCambio = new Subject<Usuario[]>();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔐 Token usado en usuarios:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ==========================================
  // ✅ 1. MÉTODOS DE SEGURIDAD (Login y Registro) - SIN headers
  // ==========================================

  login(correo: string, contrasena: string): Observable<any> {
    const loginData = {
      correo: correo,
      contrasena: contrasena
    };
    return this.http.post(`${this.url}/login`, loginData); // ❌ SIN headers (público)
  }

  registrar(usuario: Usuario): Observable<any> {
    const dataToSend = {
      nombre: usuario.nombre,
      correo: usuario.correo,
      contrasena: usuario.contrasena
    };
    return this.http.post(`${this.url}/registro`, dataToSend, { responseType: 'text' }); // ❌ SIN headers (público)
  }

  // ==========================================
  // ♻️ 2. MÉTODOS CRUD Y REPORTES - CON headers
  // ==========================================

  list() {
    return this.http.get<Usuario[]>(this.url, { 
      headers: this.getAuthHeaders() // ✅ CON headers
    });
  }

  insert(u: Usuario) {
    return this.http.post(this.url, u, { 
      headers: this.getAuthHeaders(), // ✅ CON headers
      responseType: 'text' 
    });
  }

  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Usuario>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders() // ✅ CON headers
    });
  }

  update(u: Usuario) {
    return this.http.put(this.url, u, { 
      headers: this.getAuthHeaders(), // ✅ CON headers
      responseType: 'text' 
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders(), // ✅ CON headers
      responseType: 'text' 
    });
  }

  listByNivel(nivel: number) {
    return this.http.get<Usuario[]>(`${this.url}/nivel/${nivel}`, { 
      headers: this.getAuthHeaders() // ✅ CON headers
    });
  }

  resumenPorNivel(nivel: number) {
    return this.http.get(`${this.url}/resumen/nivel/${nivel}`, { 
      headers: this.getAuthHeaders() // ✅ CON headers
    });
  }

  rankingLogros() {
    return this.http.get(`${this.url}/logros-ranking`, { 
      headers: this.getAuthHeaders() // ✅ CON headers
    });
  }

  reporteGenero() {
    return this.http.get(`${this.url}/reporte/participantes-genero`, { 
      headers: this.getAuthHeaders() // ✅ CON headers
    });
  }
}