export class Usuario {
    idUsuario: number = 0;
    nombre: string = "";
    correo: string = "";
    contrasena: string = "";
    edad: number = 0;
    genero: string = "";
    enabled: boolean = true;
    nivel: number = 1;
    canjesDisponibles: number = 0;
    co2Total: number = 0.0;
    roles: string[] = []; // En Java es List<Rol>, aquí lo manejamos como array

    // 🔹 MÉTODOS AUXILIARES (Opcionales pero útiles)
    
    // Verifica si el usuario tiene un rol específico
    tieneRol(nombreRol: string): boolean {
        return this.roles.some(rol => 
            rol.toUpperCase() === nombreRol.toUpperCase()
        );
    }

    // Verifica si es admin
    esAdmin(): boolean {
        return this.tieneRol('ADMIN') || this.tieneRol('ROLE_ADMIN');
    }

    // Verifica si es usuario normal
    esUsuario(): boolean {
        return this.tieneRol('USER') || this.tieneRol('ROLE_USER');
    }
}

// 🔹 TIPO PARA EL SELECTOR DE USUARIO
export type TipoUsuario = 'ADMIN' | 'USER';

// 🔹 INTERFAZ PARA LA RESPUESTA DEL LOGIN (Opcional)
export interface LoginResponse {
    usuario: Usuario;
    token?: string; // Por si tu backend devuelve JWT
}