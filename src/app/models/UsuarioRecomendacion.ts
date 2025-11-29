import { Recomendacion } from "./Recomendacion";
import { Usuario } from "./Usuario";

export class UsuarioRecomendacion {
  idUsuarioRecomendacion: number = 0;
  usuario: Usuario = new Usuario(); 
  recomendacion: Recomendacion = new Recomendacion(); 
  fechaAsignacion: Date = new Date()
}