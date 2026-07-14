import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { FIDELIZACION_CLIENTE_TABS } from '@/app/core/config/tabs.config';
import { ActivatedRoute, Router } from '@angular/router';
import { MiResumenComponent } from './mi-resumen/mi-resumen.component';
import { MisTarjetasComponent } from './mis-tarjetas/mis-tarjetas.component';
import { MiHistorialComponent } from './mi-historial/mi-historial.component';

@Component({
  selector: 'app-fidelizacion',
  imports: [CommonModule, TabsModule, MiResumenComponent, MisTarjetasComponent, MiHistorialComponent],
  templateUrl: './fidelizacion.html',
  styleUrl: './fidelizacion.css',
})
export class FidelizacionComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  activeTab = 'resumen';
  tabs = FIDELIZACION_CLIENTE_TABS;

  constructor() {
    this.route.queryParams.subscribe(params => { this.activeTab = params['tab'] || 'resumen'; });
  }

  onTabChange(tab: string | number | undefined): void {
    if (tab === undefined || tab === null) return;
    this.router.navigate([], { relativeTo: this.route, queryParams: { tab: String(tab) }, queryParamsHandling: 'merge', replaceUrl: true, });
  }
}