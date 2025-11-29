import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UsuarioRecomendacion } from '../models/UsuarioRecomendacion';
import { Subject, Observable } from 'rxjs';
import { Recomendacion } from '../models/Recomendacion';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class UsuarioRecomendacionService {
  private url = `${base_url}/usuariorecomendaciones`; 
  private listaCambio = new Subject<UsuarioRecomendacion[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<UsuarioRecomendacion[]> {
    return this.http.get<UsuarioRecomendacion[]>(this.url);
  }

  insert(ur: UsuarioRecomendacion) {
    return this.http.post(this.url, ur, { responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<UsuarioRecomendacion>(`${this.url}/${id}`);
  }

  update(ur: UsuarioRecomendacion) {
    return this.http.put(`${this.url}/${ur.idUsuarioRecomendacion}`, ur, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  listarRecomendacionesPorUsuario(idUsuario: number): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>(`${this.url}/usuario/${idUsuario}/recomendaciones`);
  }

  asignarRecomendacion(idUsuario: number, idRecomendacion: number) {
    return this.http.post(`${this.url}/asignar/${idUsuario}/${idRecomendacion}`, null, { responseType: 'text' });
  }

  setList(listaNueva: UsuarioRecomendacion[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}