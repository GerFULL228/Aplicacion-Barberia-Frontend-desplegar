import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderClient } from './components/header-client/header-client';
import { ResumenGeneralClient } from './components/resumen-general-client/resumen-general-client';
import { ClienteFilterCriteria, ClienteFilterMode, FiltrarClients } from './components/filtrar-clients/filtrar-clients';
import { TableClient } from './components/table-client/table-client';
import { ClienteService } from '@/app/core/services/gestion/cliente.service';
import { Cliente } from '@/app/core/models/gestion/cliente/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [HeaderClient, ResumenGeneralClient, FiltrarClients, TableClient],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  private router = inject(Router);
  private clienteService = inject(ClienteService);
  private readonly pageSize = 7;

  icono: string = 'pi-users';
  activeFilter: ClienteFilterMode = 'todos';
  searchTerm: string = '';
  filterCriteria: ClienteFilterCriteria = {
    mode: 'todos',
    year: null,
    month: null,
    fromDate: '',
    toDate: '',
  };
  clients: Cliente[] = [];
  visibleClients: Cliente[] = [];
  totalElements: number = 0;
  currentPage: number = 0;
  totalPages: number = 0;

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(page: number = 0): void {
    this.clienteService.listar(page, this.pageSize).subscribe({
      next: (response) => {
        this.clients = response.data.content;
        this.aplicarFiltro();
        this.totalElements = response.data.totalElements;
        this.currentPage = response.data.pageNumber;
        this.totalPages = response.data.totalPages;
      },
      error: (error) => {
        console.error('Error al cargar clientes', error);
      }
    });
  }

  aplicarFiltro(): void {
    const hoy = new Date();
    const criterio = this.filterCriteria;
    const search = this.searchTerm.trim().toLowerCase();

    this.visibleClients = this.clients.filter((cliente) => {
      const fechaRegistro = this.parseFecha(cliente.fechaRegistro);
      const nombre = cliente.persona?.nombre?.toLowerCase() ?? '';
      const apellido = cliente.persona?.apellido?.toLowerCase() ?? '';
      const email = cliente.persona?.email?.toLowerCase() ?? '';
      const usuario = cliente.persona?.usuario?.user?.toLowerCase() ?? '';
      const nombreCompleto = `${nombre} ${apellido}`.trim();

      const coincideBusqueda = !search || [nombre, apellido, nombreCompleto, email, usuario].some((campo) => campo.includes(search));

      if (!coincideBusqueda) {
        return false;
      }

      switch (criterio.mode) {
        case 'recientes': {
          const limiteRecientes = new Date(hoy);
          limiteRecientes.setDate(limiteRecientes.getDate() - 30);
          return fechaRegistro >= limiteRecientes;
        }
        case 'mes':
          return (
            criterio.year !== null &&
            criterio.month !== null &&
            fechaRegistro.getFullYear() === criterio.year &&
            fechaRegistro.getMonth() === (criterio.month - 1)
          );
        case 'anio':
          return criterio.year !== null && fechaRegistro.getFullYear() === criterio.year;
        case 'rango': {
          const desde = criterio.fromDate ? this.parseFecha(criterio.fromDate) : null;
          const hasta = criterio.toDate ? this.parseFecha(criterio.toDate) : null;

          if (desde && fechaRegistro < desde) return false;
          if (hasta) {
            const ultimoDia = new Date(hasta);
            ultimoDia.setHours(23, 59, 59, 999);
            if (fechaRegistro > ultimoDia) return false;
          }
          return true;
        }
        case 'personalizado': {
          const añoSeleccionado = criterio.year;
          const mesSeleccionado = criterio.month;
          const desde = criterio.fromDate ? this.parseFecha(criterio.fromDate) : null;
          const hasta = criterio.toDate ? this.parseFecha(criterio.toDate) : null;

          if (añoSeleccionado !== null && fechaRegistro.getFullYear() !== añoSeleccionado) {
            return false;
          }

          if (mesSeleccionado !== null && fechaRegistro.getMonth() !== mesSeleccionado - 1) {
            return false;
          }

          if (desde && fechaRegistro < desde) return false;

          if (hasta) {
            const ultimoDia = new Date(hasta);
            ultimoDia.setHours(23, 59, 59, 999);
            if (fechaRegistro > ultimoDia) return false;
          }

          return true;
        }
        case 'todos':
        default:
          return true;
      }
    });
  }

  private parseFecha(fecha: string): Date {
    const parsed = new Date(`${fecha}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
  }

  onPrevPage(): void {
    if (this.currentPage <= 0) return;
    this.cargarClientes(this.currentPage - 1);
  }

  onNextPage(): void {
    if (this.currentPage >= this.totalPages - 1) return;
    this.cargarClientes(this.currentPage + 1);
  }

  abrirCrear() {
    this.router.navigate(['/dashboard/gestion/clientes/registrar-client']);
  }

  onFilterChange(criteria: ClienteFilterCriteria) {
    this.filterCriteria = criteria;
    this.activeFilter = criteria.mode;
    this.aplicarFiltro();
  }

  onSearch(query: string): void {
    this.searchTerm = query;
    this.aplicarFiltro();
  }

  onCustomModeChange(isCustomMode: boolean): void {
    if (isCustomMode) {
      this.activeFilter = 'personalizado';
      this.filterCriteria = {
        mode: 'personalizado',
        year: null,
        month: null,
        fromDate: '',
        toDate: '',
      };
      this.visibleClients = this.clients;
      return;
    }

    this.activeFilter = this.filterCriteria.mode === 'personalizado' ? 'todos' : this.filterCriteria.mode;
  }
}
