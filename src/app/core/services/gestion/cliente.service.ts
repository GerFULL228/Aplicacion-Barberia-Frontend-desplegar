import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../models/gestion/cliente/cliente.model';
import { environment } from '@/environments/environment.development';
import { ClienteResumen } from '../../models/gestion/cliente/ClienteResumen.model';
import { ClienteDetalleResumen } from '../../models/gestion/cliente/cliente-detalle-resumen.model';
import { ActividadReciente } from '../../models/gestion/cliente/ActividadReciente.model';
import { ApiResponse, Page } from '../../models/common/index.model';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {

    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/clientes`;

    listar(
        page: number = 0,
        size: number = 5
    ): Observable<ApiResponse<Page<Cliente>>> {

        const params = new HttpParams()
            .set('page', page)
            .set('size', size);

        return this.http.get<ApiResponse<Page<Cliente>>>(
            this.apiUrl,
            { params }
        );
    }

    obtenerPorId(id: number): Observable<ApiResponse<Cliente>> {
        return this.http.get<ApiResponse<Cliente>>(`${this.apiUrl}/${id}`);
    }

    obtenerResumen(): Observable<ApiResponse<ClienteResumen>> {
        return this.http.get<ApiResponse<ClienteResumen>>(
            `${this.apiUrl}/resumen`
        );

    }

    obtenerResumenCliente(id: number): Observable<ApiResponse<ClienteDetalleResumen>> {
        return this.http.get<ApiResponse<ClienteDetalleResumen>>(
            `${this.apiUrl}/${id}/resumen`
        );
    }

    obtenerActividadReciente(id: number): Observable<ApiResponse<ActividadReciente[]>> {

    return this.http.get<ApiResponse<ActividadReciente[]>>(
        `${this.apiUrl}/${id}/actividad`
    );
}
}