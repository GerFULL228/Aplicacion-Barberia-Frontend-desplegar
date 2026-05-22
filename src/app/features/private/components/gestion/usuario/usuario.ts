import { Component } from '@angular/core';
import { HeaderUsuario } from "./components/header-usuario/header-usuario";
import { TableUsers } from './components/table-users/table-users';
import { FiltrarUsers, FiltroUsuario } from './components/filtrar-users/filtrar-users';


@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [HeaderUsuario, FiltrarUsers, TableUsers],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario {
  usuarios = [
    {
      usuarioId: 1,
      username: 'cliente.demo',
      persona: { nombre: 'Carlos', apellido: 'Paredes' },
      roles: ['CLIENTE'],
      qr: true,
      activo: true,
      ultimoAcceso: '21/05/2026 08:15',
    },
    {
      usuarioId: 2,
      username: 'barbero.demo',
      persona: { nombre: 'Bruno', apellido: 'Rojas' },
      roles: ['BARBERO'],
      qr: true,
      activo: true,
      ultimoAcceso: '21/05/2026 09:40',
    },
    {
      usuarioId: 3,
      username: 'admin.demo',
      persona: { nombre: 'Andrea', apellido: 'Mendoza' },
      roles: ['ADMIN'],
      qr: false,
      activo: true,
      ultimoAcceso: '21/05/2026 10:05',
    },
    {
      usuarioId: 4,
      username: 'barbero.admin.demo',
      persona: { nombre: 'Diego', apellido: 'Torres' },
      roles: ['BARBERO', 'ADMIN'],
      qr: false,
      activo: true,
      ultimoAcceso: '21/05/2026 11:20',
    },
  ];

  filtrosActuales: FiltroUsuario = {
    rol: '',
    tipo: '',
    qr: '',
    cantidadRoles: '',
  };

  onApplyFilters(filtros: FiltroUsuario): void {
    this.filtrosActuales = filtros;
  }

  onClearFilters(): void {
    this.filtrosActuales = {
      rol: '',
      tipo: '',
      qr: '',
      cantidadRoles: '',
    };
  }
}
