import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/Usuario';
import { Subject } from 'rxjs';


const base_url= environment.base;

@Injectable({
  providedIn: 'root',
})
export class Usuarioservice {
  private url = `${base_url}/Usuarios`;
  private listaCambio = new Subject<Usuario[]>();

  constructor(private http:HttpClient) {}

  list(){
    return this.http.get<Usuario[]>(this.url);
  }

  insert(u: Usuario) {
    return this.http.post(this.url, u, { responseType: 'text' });
  }

  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  //Buscar usuario por ID
  listId(id: number) {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  //Actualizar usuario existente
  update(u: Usuario) {
    return this.http.put(this.url, u, { responseType: 'text' });
  }

  //Eliminar usuario por ID
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  //Listar usuarios por nivel
  listByNivel(nivel: number) {
    return this.http.get<Usuario[]>(`${this.url}/nivel/${nivel}`);
  }

  //Obtener resumen de usuarios por nivel (DTO)
  resumenPorNivel(nivel: number) {
    return this.http.get(`${this.url}/resumen/nivel/${nivel}`);
  }

  //Obtener ranking de usuarios por logros
  rankingLogros() {
    return this.http.get(`${this.url}/logros-ranking`);
  }

  //Obtener reporte de participación por género
  reporteGenero() {
    return this.http.get(`${this.url}/reporte/participantes-genero`);
  }
}
