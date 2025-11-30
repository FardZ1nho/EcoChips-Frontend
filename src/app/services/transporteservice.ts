import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Transporte } from '../models/Transporte';
import { TransporteImpactoDTO } from '../models/TransporteImpactoDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Transporteservice {
  private url = `${base_url}/transportes`;
  private listaCambio = new Subject<Transporte[]>();
  
  constructor(private http: HttpClient) {}
  
  // 🔥 MÉTODO PARA OBTENER HEADERS CON AUTORIZACIÓN
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🚗 Token usado en transporte:', token ? 'SÍ' : 'NO');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  list() {
    return this.http.get<Transporte[]>(this.url, { 
      headers: this.getAuthHeaders() 
    });
  }
  
  insert(t: Transporte) {
    console.log('📤 Insertando transporte con headers...');
    return this.http.post(this.url, t, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }
  
  setList(listaNueva: Transporte[]) {
    this.listaCambio.next(listaNueva);
  }
  
  getList() {
    return this.listaCambio.asObservable();
  }
  
  listId(id: number) {
    return this.http.get<Transporte>(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }
  
  update(t: Transporte) {
     return this.http.put(`${this.url}/${t.idTransporte}`, t, { 
       headers: this.getAuthHeaders(),
       responseType: 'text' 
     });
  }
  
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  getTransporteImpacto(): Observable<TransporteImpactoDTO[]> {
    return this.http.get<TransporteImpactoDTO[]>(`${this.url}/reportes/top5-contaminantes`, { 
      headers: this.getAuthHeaders() 
    });
  }
}