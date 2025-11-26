import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegistroAlimentacion } from '../models/RegistroAlimentacion'; // ← Ruta corregida
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RegistroAlimentacionService {
  private url = `${base_url}/registrosalimentacion`; 
  private listaCambio = new Subject<RegistroAlimentacion[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<RegistroAlimentacion[]>(this.url);
  }

  insert(r: RegistroAlimentacion) {
    // ENVIAR DIRECTAMENTE EL OBJETO - ya no necesita conversión
    return this.http.post(this.url, r, { responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<RegistroAlimentacion>(`${this.url}/${id}`);
  }

  update(r: RegistroAlimentacion) {
    // ENVIAR DIRECTAMENTE EL OBJETO - ya no necesita conversión
    return this.http.put(this.url, r, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  listarPorUsuario(idUsuario: number) {
    return this.http.get<RegistroAlimentacion[]>(`${this.url}/usuario/${idUsuario}`);
  }

  setList(listaNueva: RegistroAlimentacion[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  // ⚠️ ELIMINAR ESTE MÉTODO - ya no es necesario
  // private convertirADTO(registro: RegistroAlimentacion): any {
  //   return {
  //     idRegistroAlimentacion: registro.idRegistroAlimentacion,
  //     idUsuario: registro.idUsuario,        // ← IDs planos
  //     idAlimento: registro.idAlimento,      // ← IDs planos
  //     porciones: registro.porciones,
  //     fecha: registro.fecha
  //   };
  // }
}