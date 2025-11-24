import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Evento } from '../models/Evento';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Eventoservice {
  private url = `${base_url}/evento`;
  private listaCambio = new Subject<Evento[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Evento[]>(this.url);
  }

  insert(e: Evento) {
    return this.http.post(this.url, e, { responseType: 'text' });
  }

  setList(listaNueva: Evento[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Evento>(`${this.url}/${id}`);
  }

  update(e: Evento) {
    return this.http.put(`${this.url}/${e.idEvento}`, e, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
