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

    // ✅ AGREGAMOS ESTOS DOS PARA QUE COINCIDA CON JAVA
    co2Total: number = 0.0;
    roles: string[] = []; // En Java es List<Rol>, aquí lo manejamos como array
}