import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegistroEvento } from '../models/RegistroEvento';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Registroeventoservice {
  private url = `${base_url}/registroeventos`;
  private listaCambio = new Subject<RegistroEvento[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<RegistroEvento[]>(this.url);
  }

  insert(e: RegistroEvento) {
    return this.http.post(this.url, e, { responseType: 'text' });
  }

  setList(listaNueva: RegistroEvento[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<RegistroEvento>(`${this.url}/${id}`);
  }

  update(e: RegistroEvento) {
    return this.http.put(`${this.url}`, e, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}