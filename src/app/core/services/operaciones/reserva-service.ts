import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from '../../models/operaciones/Reserva.model';
import { ApiResponse, Page } from '../../models/common/index.model';


@Injectable({
  providedIn: 'root',
})
export class ReservaService {

  private API = `${environment.apiUrl}/admin/reservas`;
  private http = inject(HttpClient);

  getReservas():Observable<Reserva[]> {
   
    return this.http.get<Reserva[]>(this.API);
  }

}
