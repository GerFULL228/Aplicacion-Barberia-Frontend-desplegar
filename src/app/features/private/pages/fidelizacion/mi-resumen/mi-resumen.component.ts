import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from '@/app/shared/components/stats/stats.component';
import { StatsCard } from '@/app/core/models/common/card.model';
import { FidelizacionDashboardClienteResponse } from '@/app/core/models/fidelizacion/dashboard.model';
import { FidelizacionDashboardService } from '@/app/core/services/fidelizacion/dashboard.service';
import { NotificationService } from '@/app/core/services/common/notification.service';

@Component({
  standalone: true,
  selector: 'app-mi-resumen',
  imports: [CommonModule,
    StatsComponent],
  templateUrl: './mi-resumen.html',
  styleUrl: './mi-resumen.css',
})


export class MiResumenComponent implements OnInit {
  private dashboardService = inject(FidelizacionDashboardService);
  private notify = inject(NotificationService);
  private cd = inject(ChangeDetectorRef);
  cargando = true;
  data!: FidelizacionDashboardClienteResponse;
  statsCards: StatsCard[] = [];

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard() {

    this.cargando = true;
    this.dashboardService.obtenerDashboardCliente().subscribe({
      next: (resp) => {
        this.data = resp.data;
        this.generarCards();
        this.cargando = false;
        this.cd.detectChanges();
      },

      error: (err) => {
        this.notify.showHttpError(err);
        this.cargando = false;
      }
    });

  }

  generarCards() {
    this.statsCards = [

      {
        title: 'Tarjetas',
        value: this.data.totalTarjetas,
        icon: 'pi pi-id-card',
        accentClass: 'bg-blue-500',
        accentTextClass: 'text-blue-400',
        iconBgClass: 'bg-blue-500/15'
      },

      {
        title: 'Giros',
        value: this.data.girosDisponibles,
        icon: 'pi pi-sync',
        accentClass: 'bg-yellow-500',
        accentTextClass: 'text-yellow-400',
        iconBgClass: 'bg-yellow-500/15'
      },

      {
        title: 'Tarjetas listas',
        value: this.data.tarjetasConGiroDisponible,
        icon: 'pi pi-check-circle',
        accentClass: 'bg-green-500',
        accentTextClass: 'text-green-400',
        iconBgClass: 'bg-green-500/15'
      },

      {
        title: 'Premios',
        value: this.data.recompensasPendientes,
        icon: 'pi pi-gift',
        accentClass: 'bg-pink-500',
        accentTextClass: 'text-pink-400',
        iconBgClass: 'bg-pink-500/15'
      }

    ];

  }

}