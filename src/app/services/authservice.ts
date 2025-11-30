import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario, TipoUsuario } from '../models/Usuario';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 🔹 Observable para saber si el usuario está autenticado
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ==========================================
  // 🔐 MÉTODOS PARA HEADERS AUTORIZACIÓN
  // ==========================================

  // Obtener headers con token de autorización
  // NOTA: Este método ya casi no se usa si tienes el Interceptor, pero lo dejamos por si acaso.
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Verificar si el token existe y es válido
  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('❌ No hay token en localStorage');
      return false;
    }
    console.log('🔍 Token válido:', true);
    return true;
  }

  // ==========================================
  // 🔐 LOGIN CON TIPO DE USUARIO
  // ==========================================
  login(correo: string, contrasena: string, tipoUsuario: TipoUsuario): Observable<any> {
    const loginData = {
      username: correo,
      password: contrasena
    };

    return this.http.post(`${base_url}/login`, loginData).pipe(
      tap((response: any) => {
        console.group('🔐 AuthService - Guardando sesión');
        console.log('Response completa:', response);
        this.guardarSesion(response, tipoUsuario);
        console.groupEnd();
      })
    );
  }

  // ==========================================
  // 💾 GUARDAR SESIÓN
  // ==========================================
  private guardarSesion(usuarioData: any, tipoUsuario: TipoUsuario): void {
    let rolesArray: string[] = [];
    
    if (Array.isArray(usuarioData.roles)) {
      rolesArray = usuarioData.roles.map((rol: any) => {
        if (typeof rol === 'string') return rol;
        else if (rol.authority) return rol.authority;
        else if (rol.nombre) return rol.nombre;
        return '';
      }).filter(Boolean);
    }

    const usuarioGuardar = {
      ...usuarioData,
      roles: rolesArray
    };

    localStorage.setItem('usuario', JSON.stringify(usuarioGuardar));
    
    const token = usuarioData.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    
    localStorage.setItem('tipoUsuario', tipoUsuario);
    this.isAuthenticatedSubject.next(true);
  }

  // ==========================================
  // 📋 REGISTRO
  // ==========================================
  registrar(usuario: Usuario): Observable<any> {
    const dataToSend = {
      nombre: usuario.nombre,
      correo: usuario.correo,
      contrasena: usuario.contrasena
    };
    
    return this.http.post(`${base_url}/register`, dataToSend).pipe(
      tap((response: any) => {
        if (response.token) {
          this.guardarSesion(response, 'USER');
        }
      })
    );
  }

  // ==========================================
  // 👤 COMPLETAR PERFIL (AQUÍ ESTÁ EL CAMBIO)
  // ==========================================
  completarPerfil(idUsuario: number, datosCompletos: any): Observable<any> {
    if (!this.isTokenValid()) {
      return new Observable(observer => {
        observer.error('Token no válido. Por favor, inicia sesión nuevamente.');
      });
    }

    console.log('👤 AuthService - Completando perfil para ID:', idUsuario);
    
    return this.http.put(
      `${base_url}/Usuarios/completar-perfil/${idUsuario}`, 
      datosCompletos, 
      { 
        responseType: 'text'
      }
    );
  }

  // Obtener ID del usuario actual
  getCurrentUserId(): number {
    const usuario = this.getUsuarioActual();
    return usuario?.idUsuario || 0;
  }

  // Verificar si el perfil está completo
  isPerfilCompleto(): boolean {
    const usuario = this.getUsuarioActual();
    if (!usuario) return false;
    return usuario.edad > 0 && usuario.genero !== 'PENDIENTE';
  }

  // Actualizar usuario en localStorage después de completar perfil
  actualizarUsuarioLocal(usuarioActualizado: any): void {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr);
        const usuarioNuevo = { 
          ...usuario, 
          edad: usuarioActualizado.edad,
          genero: usuarioActualizado.genero
        };
        localStorage.setItem('usuario', JSON.stringify(usuarioNuevo));
      } catch (error) {
        console.error('❌ Error al actualizar usuario local:', error);
      }
    }
  }

  // ==========================================
  // 🚪 LOGOUT
  // ==========================================
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('tipoUsuario');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/']);
  }

  // ==========================================
  // ✅ VERIFICACIONES
  // ==========================================
  
  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsuarioActual(): Usuario | null {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return null;
    try {
      return JSON.parse(usuarioStr) as Usuario;
    } catch (error) {
      return null;
    }
  }

  getTipoUsuario(): TipoUsuario | null {
    return localStorage.getItem('tipoUsuario') as TipoUsuario;
  }

  tieneRol(rol: string): boolean {
    const usuario = this.getUsuarioActual();
    if (!usuario || !usuario.roles) return false;
    
    return usuario.roles.some((r: any) => {
      let rolString: string;
      if (typeof r === 'string') rolString = r;
      else if (r.authority) rolString = r.authority;
      else if (r.nombre) rolString = r.nombre;
      else return false;
      
      return rolString.toUpperCase().includes(rol.toUpperCase());
    });
  }

  esAdmin(): boolean {
    return this.tieneRol('ADMIN');
  }

  esUsuario(): boolean {
    return this.tieneRol('USER');
  }

  tipoUsuarioCoincide(): boolean {
    const tipo = this.getTipoUsuario();
    if (!tipo) return false;
    return tipo === 'ADMIN' ? this.esAdmin() : this.esUsuario();
  }
}