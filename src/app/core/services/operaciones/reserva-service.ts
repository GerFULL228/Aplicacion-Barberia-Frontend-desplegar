import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Reserva } from '../../models/operaciones/Reserva.model';
import { ApiResponse, Page } from '../../models/common/index.model';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {

  private API = `${environment.apiUrl}/admin/reservas`;
  private API2 = `${environment.apiUrl}/reservas`;
  private http = inject(HttpClient);

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.API);
  }

  guardarReserva(reserva: any): Observable<ApiResponse<Reserva>> {
    
    const payload = {
      clienteId: reserva.clienteId,
      barberoId: reserva.barberoId,
      servicioId: reserva.servicioId,
      fechaHora: `${reserva.fecha}T${reserva.hora}:00`,
      observacion: reserva.observacion || '',
      estado: 'PENDIENTE'
    };
    
    return this.http.post<ApiResponse<Reserva>>(`${this.API2}`, payload);
  }

  verificarDisponibilidad(fecha: Date, hora: string, barberoId: number): Observable<{ disponible: boolean }> {
    const fechaStr = fecha.toISOString().split('T')[0];
    return this.http.get<{ disponible: boolean }>(`${this.API}/disponibilidad?fecha=${fechaStr}&hora=${hora}&barberoId=${barberoId}`);
  }
}