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
    
    // Aquí podrías agregar lógica para verificar expiración del token
    // Por ahora solo verificamos que exista
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
        console.log('Token recibido:', response.token ? 'SÍ ✅' : 'NO ❌');
        console.log('Roles recibidos:', response.roles);
        console.log('Tipo usuario seleccionado:', tipoUsuario);
        console.groupEnd();

        // Guardamos los datos del usuario
        this.guardarSesion(response, tipoUsuario);
      })
    );
  }

  // ==========================================
  // 💾 GUARDAR SESIÓN
  // ==========================================
  private guardarSesion(usuarioData: any, tipoUsuario: TipoUsuario): void {
    // ✅ Procesar roles para guardarlos como array de strings
    let rolesArray: string[] = [];
    
    if (Array.isArray(usuarioData.roles)) {
      rolesArray = usuarioData.roles.map((rol: any) => {
        if (typeof rol === 'string') {
          return rol;
        } else if (rol.authority) {
          return rol.authority;
        } else if (rol.nombre) {
          return rol.nombre;
        }
        return '';
      }).filter(Boolean);
    }

    // Crear objeto usuario con roles procesados
    const usuarioGuardar = {
      ...usuarioData,
      roles: rolesArray
    };

    console.group('💾 Guardando en localStorage');
    console.log('Token:', usuarioData.token);
    console.log('Usuario:', usuarioGuardar);
    console.log('Roles procesados:', rolesArray);
    console.log('Tipo usuario:', tipoUsuario);
    console.groupEnd();

    // Guardamos el usuario completo con roles procesados
    localStorage.setItem('usuario', JSON.stringify(usuarioGuardar));
    
    // Token JWT
    const token = usuarioData.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    
    // Tipo de usuario seleccionado
    localStorage.setItem('tipoUsuario', tipoUsuario);

    // Notificamos que el usuario está autenticado
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
        console.group('📋 AuthService - Registro exitoso');
        console.log('Response:', response);
        console.log('Token recibido:', response.token ? 'SÍ ✅' : 'NO ❌');
        console.groupEnd();

        // ✅ Guardar sesión automáticamente después del registro
        if (response.token) {
          this.guardarSesion(response, 'USER');
        }
      })
    );
  }

  // ==========================================
  // 👤 COMPLETAR PERFIL
  // ==========================================
  completarPerfil(idUsuario: number, datosCompletos: any): Observable<any> {
    // Verificar token antes de proceder
    if (!this.isTokenValid()) {
      console.error('❌ Token no válido para completar perfil');
      return new Observable(observer => {
        observer.error('Token no válido. Por favor, inicia sesión nuevamente.');
      });
    }

    console.group('👤 AuthService - Completando perfil');
    console.log('ID Usuario:', idUsuario);
    console.log('Datos a enviar:', datosCompletos);
    console.log('Headers:', this.getAuthHeaders());
    console.groupEnd();
    
    return this.http.put(
      `${base_url}/Usuarios/completar-perfil/${idUsuario}`, 
      datosCompletos, 
      { 
        headers: this.getAuthHeaders(),
        responseType: 'text' 
      }
    );
  }

  // Obtener ID del usuario actual
  getCurrentUserId(): number {
    const usuario = this.getUsuarioActual();
    const id = usuario?.idUsuario || 0;
    console.log('🔍 getCurrentUserId():', id);
    return id;
  }

  // Verificar si el perfil está completo
  isPerfilCompleto(): boolean {
    const usuario = this.getUsuarioActual();
    if (!usuario) {
      console.warn('⚠️ isPerfilCompleto(): No hay usuario');
      return false;
    }
    
    const completo = usuario.edad > 0 && usuario.genero !== 'PENDIENTE';
    console.log('🔍 isPerfilCompleto():', completo, '- Edad:', usuario.edad, 'Género:', usuario.genero);
    return completo;
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
        console.log('✅ Usuario actualizado en localStorage:', usuarioNuevo);
      } catch (error) {
        console.error('❌ Error al actualizar usuario en localStorage:', error);
      }
    }
  }

  // ==========================================
  // 🚪 LOGOUT
  // ==========================================
  logout(): void {
    console.log('🚪 Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('tipoUsuario');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/']);
  }

  // ==========================================
  // ✅ VERIFICACIONES
  // ==========================================
  
  // Verifica si tiene token
  hasToken(): boolean {
    const hasToken = !!localStorage.getItem('token');
    console.log('🔍 hasToken():', hasToken);
    return hasToken;
  }

  // Obtiene el usuario actual
  getUsuarioActual(): Usuario | null {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
      console.warn('⚠️ getUsuarioActual(): No hay usuario en localStorage');
      return null;
    }
    
    try {
      const usuario = JSON.parse(usuarioStr) as Usuario;
      console.log('👤 getUsuarioActual():', usuario);
      return usuario;
    } catch (error) {
      console.error('❌ Error al parsear usuario:', error);
      return null;
    }
  }

  // Obtiene el tipo de usuario seleccionado
  getTipoUsuario(): TipoUsuario | null {
    const tipo = localStorage.getItem('tipoUsuario') as TipoUsuario;
    console.log('🔍 getTipoUsuario():', tipo);
    return tipo;
  }

  // ✅ MEJORADO: Verifica si el usuario tiene un rol específico
  tieneRol(rol: string): boolean {
    const usuario = this.getUsuarioActual();
    
    if (!usuario || !usuario.roles) {
      console.warn('⚠️ tieneRol(): No hay usuario o roles');
      return false;
    }
    
    // ✅ Manejar roles como strings o objetos
    const resultado = usuario.roles.some((r: any) => {
      let rolString: string;
      
      if (typeof r === 'string') {
        rolString = r;
      } else if (r.authority) {
        rolString = r.authority;
      } else if (r.nombre) {
        rolString = r.nombre;
      } else {
        return false;
      }
      
      const match = rolString.toUpperCase().includes(rol.toUpperCase());
      return match;
    });
    
    console.log(`🔍 tieneRol('${rol}'):`, resultado);
    return resultado;
  }

  // Verifica si es admin
  esAdmin(): boolean {
    const resultado = this.tieneRol('ADMIN');
    console.log('👑 esAdmin():', resultado);
    return resultado;
  }

  // Verifica si es usuario normal
  esUsuario(): boolean {
    const resultado = this.tieneRol('USER');
    console.log('👤 esUsuario():', resultado);
    return resultado;
  }

  // Verifica si el tipo seleccionado coincide con los roles
  tipoUsuarioCoincide(): boolean {
    const tipoSeleccionado = this.getTipoUsuario();
    if (!tipoSeleccionado) {
      console.warn('⚠️ tipoUsuarioCoincide(): No hay tipo seleccionado');
      return false;
    }

    const coincide = tipoSeleccionado === 'ADMIN' 
      ? this.esAdmin() 
      : this.esUsuario();
    
    console.log('🔍 tipoUsuarioCoincide():', coincide);
    return coincide;
  }
}