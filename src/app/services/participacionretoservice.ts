import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
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

  list() {
    return this.http.get<ParticipacionReto[]>(this.url);
  }

  insert(pr: ParticipacionReto) {
    return this.http.post(this.url, pr, { responseType: 'text' });
  }

  setList(listaNueva: ParticipacionReto[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<ParticipacionReto>(`${this.url}/${id}`);
  }

  update(pr: ParticipacionReto) {
    return this.http.put(this.url, pr, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  getTopUsuarios(): Observable<TopUsuarioDTO[]> {
    return this.http.get<TopUsuarioDTO[]>(`${this.url}/reportes/top-usuarios`);
  }
}