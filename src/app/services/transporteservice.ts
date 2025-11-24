import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Transporte } from '../models/Transporte';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Transporteservice {
  private url = `${base_url}/transportes`;
  private listaCambio = new Subject<Transporte[]>();
  
  constructor(private http: HttpClient) {}
  
  list() {
    return this.http.get<Transporte[]>(this.url);
  }
  
  insert(t: Transporte) {
    return this.http.post(this.url, t, { responseType: 'text' });
  }
  
  setList(listaNueva: Transporte[]) {
    this.listaCambio.next(listaNueva);
  }
  
  getList() {
    return this.listaCambio.asObservable();
  }
  
  listId(id: number) {
    return this.http.get<Transporte>(`${this.url}/${id}`);
  }
  
  update(t: Transporte) {
     return this.http.put(`${this.url}/${t.idTransporte}`, t, { responseType: 'text' });
  }
  
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
