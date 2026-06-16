import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReconocimientoFacialService {

  private API = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  analizar(foto: Blob, nombre: string, genero: string): Observable<any> {
    const formData = new FormData();
    formData.append('foto', foto, 'foto.jpg');
    formData.append('nombre_cliente', nombre);
    formData.append('genero_cliente', genero);
    return this.http.post(`${this.API}/analizar`, formData);
  }

  enviarFeedback(clientId: number, haircutId: number, liked: boolean, rating: number): Observable<any> {
    const formData = new FormData();
    formData.append('client_id', clientId.toString());
    formData.append('haircut_id', haircutId.toString());
    formData.append('liked', liked.toString());
    formData.append('rating', rating.toString());
    return this.http.post(`${this.API}/feedback`, formData);
  }

  listarCortes(): Observable<any> {
    return this.http.get(`${this.API}/cortes`);
  }
}