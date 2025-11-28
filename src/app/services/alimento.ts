import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Alimento } from '../models/Alimento'; // Asegúrate de crear este archivo primero
import { Observable, Subject } from 'rxjs';
import { TipoAlimentoCO2DTO } from '../models/TipoAlimentoCO2DTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class AlimentoService {
  private url = `${base_url}/alimentos`; 
  private listaCambio = new Subject<Alimento[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Alimento[]>(this.url);
  }

  insert(a: Alimento) {
    return this.http.post(this.url, a, { responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<Alimento>(`${this.url}/${id}`);
  }

  update(a: Alimento) {
    return this.http.put(this.url, a, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  setList(listaNueva: Alimento[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  getPromedioCO2PorTipo(): Observable<TipoAlimentoCO2DTO[]> {
    return this.http.get<TipoAlimentoCO2DTO[]>(`${this.url}/reportes/promedio-co2-tipo`);
  }
}