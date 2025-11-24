import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Recompensa } from '../models/Recompensa';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RecompensaService {
  private url = `${base_url}/recompensas`; 
  private listaCambio = new Subject<Recompensa[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Recompensa[]>(this.url);
  }

  insert(r: Recompensa) {
    return this.http.post(this.url, r, { responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<Recompensa>(`${this.url}/${id}`);
  }

  update(r: Recompensa) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  setList(listaNueva: Recompensa[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}