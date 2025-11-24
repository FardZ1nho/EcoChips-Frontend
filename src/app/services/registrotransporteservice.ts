import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegistroTransporte } from '../models/RegistroTransporte';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RegistroTransporteService {
  private url = `${base_url}/registrostransporte`; 
  private listaCambio = new Subject<RegistroTransporte[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<RegistroTransporte[]>(this.url);
  }

  insert(rt: RegistroTransporte) {
    return this.http.post(this.url, rt, { responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<RegistroTransporte>(`${this.url}/${id}`);
  }

  update(rt: RegistroTransporte) {
    return this.http.put(this.url, rt, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  setList(listaNueva: RegistroTransporte[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}