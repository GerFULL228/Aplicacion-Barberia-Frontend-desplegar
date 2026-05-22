import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Rol {
  id_rol: number;
  nombre: string;
}

interface Permiso {
  id_permiso: number;
  nombre: string;
  descripcion: string;
}

interface PermisoConOrigen {
  permiso: Permiso;
  roles: string[];
}

@Component({
  selector: 'app-roles-permisos-perfil-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-permisos-perfil-usuario.html',
  styleUrl: './roles-permisos-perfil-usuario.css',
})
export class RolesPermisosPerfilUsuario implements OnInit {

  @Input() usuarioId!: number;

  // Datos que vendrían de tu API
  rolesAsignados: Rol[] = [];
  permisosActivos: PermisoConOrigen[] = [];
  rolesDisponibles: Rol[] = []; // roles que aún no tiene

  showModalAgregarRol = false;
  rolesSeleccionados: Set<number> = new Set();

  ngOnInit(): void {
    this.cargarRolesDelUsuario();
  }

  cargarRolesDelUsuario(): void {
    // GET /api/usuarios/{id}/roles  → retorna rol[] con sus permisos
    // Construyes permisosActivos agrupando por permiso + origen
  }

  quitarRol(idRol: number): void {
    // DELETE /api/usuarios/{usuarioId}/roles/{idRol}
    this.rolesAsignados = this.rolesAsignados.filter(r => r.id_rol !== idRol);
    this.recalcularPermisos();
  }

  abrirModalRol(): void {
    this.rolesSeleccionados = new Set();
    // GET /api/roles → filtras los que el usuario ya tiene
    this.showModalAgregarRol = true;
  }

  toggleRol(idRol: number): void {
    if (this.rolesSeleccionados.has(idRol)) {
      this.rolesSeleccionados.delete(idRol);
    } else {
      this.rolesSeleccionados.add(idRol);
    }
  }

  confirmarAgregarRoles(): void {
    // POST /api/usuarios/{usuarioId}/roles  body: { roles: [...ids] }
    // inserta en tabla usuario_rol
    this.showModalAgregarRol = false;
    this.cargarRolesDelUsuario();
  }

  recalcularPermisos(): void {
    // Reagrupa permisos según rolesAsignados actuales
  }
}