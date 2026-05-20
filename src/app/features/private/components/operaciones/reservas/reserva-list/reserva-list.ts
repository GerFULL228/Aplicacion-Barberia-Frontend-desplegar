
import { ApiResponse, Page } from '@/app/core/models/common/index.model';
import { Reserva } from '@/app/core/models/operaciones/Reserva.model';
import { ReservaService } from '@/app/core/services/operaciones/reserva-service';
import { ConfirmPopoverComponent } from '@/app/shared/components/confirm-popover/confirm-popover.component';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [
    FloatLabelModule, IconFieldModule, InputIconModule, InputTextModule, FormsModule,
     ButtonModule, CommonModule, TableModule, ConfirmPopoverComponent, ToggleSwitchModule, FormsModule,
      IconFieldModule, InputIconModule, StatusBadgeComponent,StatusBadgeComponent
  ],
  templateUrl: './reserva-list.html',
  styleUrls: ['./reserva-list.css'],
})
export class ReservaList {

  @Input() cargado = false;
   
    @Input() totalRecords = 0;
    @Input() rows = 25;

  clienteBusqueda: string = '';

  private reservaService = inject(ReservaService);

  reservas$! : Observable<Reserva[]>;

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.reservas$ = this.reservaService.getReservas();
    console.log(this.reservas$);
  }

  obtenerFechaHora(reserva: Reserva): Date {
    
    return new Date(
      `${reserva.fecha}T${reserva.horaInicio}`
    )
  }

}
