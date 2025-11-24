import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Reto } from '../models/Reto';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Retoservice {
  private url = `${base_url}/retos`;

  private listaCambio = new Subject<Reto[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Reto[]>(this.url);
  }

  insert(r: Reto) {
    return this.http.post(this.url, r, { responseType: 'text' });
  }

  setList(listaNueva: Reto[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Reto>(`${this.url}/${id}`);
  }

  update(r: Reto) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}