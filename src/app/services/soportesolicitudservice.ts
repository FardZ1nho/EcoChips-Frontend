import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { SoporteSolicitud } from '../models/SoporteSolicitud';

const base_url = environment.base;

@Injectable({
  providedIn: 'root', 
})
export class SoporteSolicitudService {
  private url = `${base_url}/soporte`; 
  private listaCambio = new Subject<SoporteSolicitud[]>(); 
  
  constructor(private http: HttpClient) {}
  
  list() {
    return this.http.get<SoporteSolicitud[]>(this.url);
  }
  
  insert(s: SoporteSolicitud) {
    return this.http.post(this.url, s, { responseType: 'text' });
  }
  
  setList(listaNueva: SoporteSolicitud[]) {
    this.listaCambio.next(listaNueva);
  }
  
  getList() {
    return this.listaCambio.asObservable();
  }
  
  listId(id: number) {
    return this.http.get<SoporteSolicitud>(`${this.url}/${id}`);
  }
  
  update(s: SoporteSolicitud) {
    return this.http.put(this.url, s, { responseType: 'text' });
  }
  
  
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }


  buscar(titulo: string) {
    return this.http.get<SoporteSolicitud[]>(`${this.url}/buscar/${titulo}`);
  }

  
  listarPorApartado(apartado: string) {
    return this.http.get<SoporteSolicitud[]>(`${this.url}/estado/${apartado}`);
  }
}