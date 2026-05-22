import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderPerfilUsuario } from './components/header-perfil-usuario/header-perfil-usuario';
import { DatosBasicosPerfilUsuario } from './components/datos-basicos-perfil-usuario/datos-basicos-perfil-usuario';
import { CredencialesPerfilUsuario } from './components/credenciales-perfil-usuario/credenciales-perfil-usuario';
import { RolesPermisosPerfilUsuario } from './components/roles-permisos-perfil-usuario/roles-permisos-perfil-usuario';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, HeaderPerfilUsuario, RolesPermisosPerfilUsuario, DatosBasicosPerfilUsuario, CredencialesPerfilUsuario],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css',
})
export class PerfilUsuario implements OnInit {

  usuarioNombre = 'Usuario';
  usuarioIniciales = 'US';
  usuarioDescripcion = 'Sin descripción disponible';
  usuarioId: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.queryParamMap.get('name');
    const initials = this.route.snapshot.queryParamMap.get('initials');
    const desc = this.route.snapshot.queryParamMap.get('desc');

    if (id) {
      this.usuarioId = parseInt(id, 10) || 0;
      this.usuarioNombre = name || `Usuario ${id}`;
    }
    if (initials) this.usuarioIniciales = initials;
    if (desc) this.usuarioDescripcion = desc;
  }

  volver = () => window.history.back();

}
