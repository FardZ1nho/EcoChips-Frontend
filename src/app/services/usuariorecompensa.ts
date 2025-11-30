import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UsuarioRecompensa } from '../models/UsuarioRecompensa';
import { Subject, Observable } from 'rxjs';
import { RecompensaPopularDTO } from '../models/RecompensaPopularDTO';


const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class UsuarioRecompensaService {
  private url = `${base_url}/usuariorecompensas`; 
  private listaCambio = new Subject<UsuarioRecompensa[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<UsuarioRecompensa[]> {
    return this.http.get<UsuarioRecompensa[]>(this.url);
  }

  listId(id: number) {
    return this.http.get<UsuarioRecompensa>(`${this.url}/${id}`);
  }

  listarPorUsuario(idUsuario: number): Observable<UsuarioRecompensa[]> {
    return this.http.get<UsuarioRecompensa[]>(`${this.url}/usuario/${idUsuario}`);
  }

  insert(ur: UsuarioRecompensa) {
    return this.http.post(this.url, ur, { responseType: 'text' });
  }

  canjearRecompensa(idUsuario: number, idRecompensa: number) {
    return this.http.post(`${this.url}/canjear/${idUsuario}/${idRecompensa}`, null, { responseType: 'text' });
  }

  update(ur: UsuarioRecompensa) {
    return this.http.put(this.url, ur, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  obtenerRecompensasMasPopulares(): Observable<RecompensaPopularDTO[]> {
    return this.http.get<RecompensaPopularDTO[]>(`${this.url}/reportes/recompensas-populares`);
  }

  // --- UTILIDADES ---
  setList(listaNueva: UsuarioRecompensa[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}