
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Recomendacion } from '../models/Recomendacion';
import { Subject, Observable, map } from 'rxjs'; 

import { RecomendacionTipoCountDTO } from '../models/RecomendacionTipoCountDTO'; 

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Recomendacionservice {
  private url = `${base_url}/recomendaciones`;
  private listaCambio = new Subject<Recomendacion[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Recomendacion[]>(this.url);
  }

  insert(e: Recomendacion) {
    return this.http.post(this.url, e, { responseType: 'text' });
  }

  setList(listaNueva: Recomendacion[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Recomendacion>(`${this.url}/${id}`);
  }

  update(e: Recomendacion) {
    return this.http.put(`${this.url}`, e, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }


    getRecomendacionesPorTipo(): Observable<RecomendacionTipoCountDTO[]> {
    // La URL debe coincidir con el endpoint de tu Controller
    const reporteUrl = `${this.url}/reportes/por-tipo`; 
    
    // Usamos el tipo de retorno directo del DTO del backend
    return this.http.get<RecomendacionTipoCountDTO[]>(reporteUrl);
  }

}
