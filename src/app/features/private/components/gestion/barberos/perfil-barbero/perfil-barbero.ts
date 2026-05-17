import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPerfilBarbero } from "./components/header-perfil-barbero/header-perfil-barbero";
import { ResumenPerfilBarbero } from "./components/resumen-perfil-barbero/resumen-perfil-barbero";
import { DatosBasicosPerfilBarbero } from "./components/datos-basicos-perfil-barbero/datos-basicos-perfil-barbero";
import { CredencialesPerfilBarbero } from "./components/credenciales-perfil-barbero/credenciales-perfil-barbero";

@Component({
  selector: 'app-perfil-barbero',
  standalone: true,
  imports: [CommonModule, HeaderPerfilBarbero, ResumenPerfilBarbero, DatosBasicosPerfilBarbero, CredencialesPerfilBarbero],
  templateUrl: './perfil-barbero.html',
  styleUrl: './perfil-barbero.css',
})
export class PerfilBarbero implements OnInit {
  barberoNombre = 'Luis Ríos Paredes';
  barberoIniciales = 'LR';
  barberoDescripcion = 'Barbero júnior con buen manejo de técnicas modernas';
  
  cortesMesActual = 38;
  ingresosGenerados = 'S/1,900';
  comisionGanada = 'S/342';
  reservasHoy = 6;
  
  nombre = 'Luis';
  apellido = 'Ríos Paredes';
  telefono = '+51 912 345 678';
  email = 'luis@boria.pe';
  fechaIngreso = '10 ene 2022';
  experiencia = '3 años';
  sueldo = 'S/1,200';
  comision = '48%';
  descripcion = 'Barbero júnior con buen manejo de técnicas modernas de degradado y fade. En etapa de crecimiento. Requiere acompañamiento en puntualidad y productividad.';
  usuario = '';
  contrasena = '';
  idUsuario = 0;

  ngOnInit(): void {
    // Cargar datos del barbero desde el servicio
    this.actualizarVista();
  }

  private actualizarVista(): void {
    this.barberoNombre = this.nombre && this.apellido ? `${this.nombre} ${this.apellido}` : this.nombre || 'Barbero';
    this.barberoIniciales = this.getInitials(this.barberoNombre);
  }

  private getInitials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return 'BR';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  private maskPassword(password: string): string {
    if (!password) return 'No disponible';
    if (password.length <= 4) return password;
    const maskedLength = Math.min(Math.max(password.length - 4, 8), 16);
    const suffix = password.slice(-4);
    return `${'•'.repeat(maskedLength)}${suffix}`;
  }
}
