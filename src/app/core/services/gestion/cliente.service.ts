import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../models/gestion/api-response.model';
import { PageResponse } from '../../models/gestion/page-response.model';
import { Cliente } from '../../models/gestion/cliente.model';
import { environment } from '@/environments/environment.development';
import { ClienteResumen } from '../../models/gestion/ClienteResumen.model';
import { ClienteDetalleResumen } from '../../models/gestion/cliente-detalle-resumen.model';
import { ActividadReciente } from '../../models/gestion/ActividadReciente.model';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {

    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/clientes`;

    listar(
        page: number = 0,
        size: number = 5
    ): Observable<ApiResponse<PageResponse<Cliente>>> {

        const params = new HttpParams()
            .set('page', page)
            .set('size', size);

        return this.http.get<ApiResponse<PageResponse<Cliente>>>(
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