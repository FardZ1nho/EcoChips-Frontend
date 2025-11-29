import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Progreso } from '../models/Progreso';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Progresoservice {
  private url = `${base_url}/progreso`;
  private listaCambio = new Subject<Progreso[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Progreso[]>(this.url);
  }

  insert(e: Progreso) {
    return this.http.post(this.url, e, { responseType: 'text' });
  }

  setList(listaNueva: Progreso[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Progreso>(`${this.url}/${id}`);
  }

  update(e: Progreso) {
    return this.http.put(`${this.url}`, e, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
