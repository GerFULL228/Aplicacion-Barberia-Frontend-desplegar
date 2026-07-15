import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { map } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { FidelizacionTarjetaService } from '@/app/core/services/fidelizacion/tarjeta.service';
import { FidelizacionTarjetaResponse } from '@/app/core/models/fidelizacion/tarjeta.model';
import { BarberoService } from '@/app/core/services/gestion/barbero.service';
import { ServicioService } from '@/app/core/services/catalogos/servicio.service';
import { ReservaService } from '@/app/core/services/operaciones/reserva.service';
import { ReservaRequest } from '@/app/core/models/reserva/reservaRequest';
import { Barbero } from '@/app/core/models/gestion/barbero/barbero.model';
import { Servicio, ServicioFiltro } from '@/app/core/models/catalogos/servicios.model';
import { TarjetaGraficoComponent } from '@/app/shared/components/tarjeta/tarjeta-grafico.component';
import { MiRuletaComponent } from '../mi-ruleta/mi-ruleta.component';
import { RecompensaObtenida } from '@/app/core/models/ruleta/recompensa.model';

@Component({
  selector: 'app-mis-tarjetas',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, SelectModule, DatePickerModule, TextareaModule, ToastModule, TarjetaGraficoComponent, MiRuletaComponent
  ],
  providers: [MessageService],
  templateUrl: './mis-tarjetas.html',
  styleUrl: './mis-tarjetas.css',
})
export class MisTarjetasComponent implements OnInit {

  private tarjetaService = inject(FidelizacionTarjetaService);
  private barberoService = inject(BarberoService);
  private servicioService = inject(ServicioService);
  private reservaService = inject(ReservaService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  today = new Date();

  misTarjetas: FidelizacionTarjetaResponse[] = [];
  cargando = true;
  error: string | null = null;
  vista: 'tarjetas' | 'grafico' = 'tarjetas';

  // Modal
  showReservaModal = false;
  isGuardando = false;
  tarjetaSeleccionada: FidelizacionTarjetaResponse | null = null;

  barberos: (Barbero & { nombreCompleto: string })[] = [];
  servicios: Servicio[] = [];

  horarios = [
    { label: '09:00 AM', value: '09:00' }, { label: '09:30 AM', value: '09:30' },
    { label: '10:00 AM', value: '10:00' }, { label: '10:30 AM', value: '10:30' },
    { label: '11:00 AM', value: '11:00' }, { label: '11:30 AM', value: '11:30' },
    { label: '12:00 PM', value: '12:00' }, { label: '12:30 PM', value: '12:30' },
    { label: '02:00 PM', value: '14:00' }, { label: '02:30 PM', value: '14:30' },
    { label: '03:00 PM', value: '15:00' }, { label: '03:30 PM', value: '15:30' },
    { label: '04:00 PM', value: '16:00' }, { label: '04:30 PM', value: '16:30' },
    { label: '05:00 PM', value: '17:00' },
  ];

  reservaGratisForm = this.fb.group({
    barberoId: [null, [Validators.required]],
    servicioId: [null, [Validators.required]],
    fecha: [null, [Validators.required, this.fechaValida.bind(this)]],
    hora: [null, [Validators.required]],
    observacion: ['', [Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.cargarMisTarjetas();
  }

  cargarMisTarjetas(): void {
    this.cargando = true;
    this.error = null;
    this.tarjetaService.obtenerMisTarjetas().subscribe({
      next: (res) => {
        this.misTarjetas = res.data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar tus tarjetas.';
        this.cargando = false;
        console.error(err);
      },
    });
  }

  // Se dispara desde (canjear) del app-tarjeta-grafico, que emite la tarjeta completa
  onCanjear(tarjeta: FidelizacionTarjetaResponse): void {
    this.tarjetaSeleccionada = tarjeta;
    this.cargarDatosModal();
    this.showReservaModal = true;
  }

  cerrarModal(): void {
    this.showReservaModal = false;
    this.tarjetaSeleccionada = null;
    this.reservaGratisForm.reset();
  }

  private cargarDatosModal(): void {
    if (this.barberos.length === 0) {
      this.barberoService.listar(0, 1000).pipe(
        map(response => response?.data?.content ?? [])
      ).subscribe(list => {
        this.barberos = list.map((b: Barbero) => ({
          ...b,
          nombreCompleto: `${b.persona?.nombre ?? ''} ${b.persona?.apellido ?? ''}`.trim(),
        }));
      });
    }
    if (this.servicios.length === 0) {
      const filtro: ServicioFiltro = { page: 0, size: 1000 };
      this.servicioService.obtenerServiciosConFiltro(filtro).pipe(
        map(res => res?.data?.content ?? [])
      ).subscribe(list => {
        this.servicios = list;
      });
    }
  }

  fechaValida(control: AbstractControl): ValidationErrors | null {
    const fecha = control.value;
    if (!fecha) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha < hoy ? { fechaInvalida: true } : null;
  }

  campoInvalido(campo: string): boolean {
    const control = this.reservaGratisForm.get(campo);
    return !!control?.invalid && !!control?.touched;
  }

  guardarReservaGratis(): void {
    if (this.reservaGratisForm.invalid || !this.tarjetaSeleccionada) {
      this.reservaGratisForm.markAllAsTouched();
      return;
    }

    this.isGuardando = true;
    const form = this.reservaGratisForm.getRawValue();
    const fecha = new Date(form.fecha as unknown as string | Date);

    const request: ReservaRequest = {
      clienteId: this.tarjetaSeleccionada.clienteId,
      barberoId: form.barberoId!,
      servicioId: form.servicioId!,
      fecha: fecha.toISOString().split('T')[0],
      horaInicio: form.hora!,
      observacion: form.observacion ?? '',
      esGratis: true,
    };

    this.reservaService.guardarReserva(request)
      .pipe(finalize(() => (this.isGuardando = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Reserva creada!',
            detail: 'Tu corte gratuito ha sido reservado correctamente.',
            life: 3500,
          });
          this.cerrarModal();
          this.cargarMisTarjetas();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message ?? 'No se pudo crear la reserva.',
            life: 4000,
          });
        },
      });
  }

  showRuletaModal = false;
  tarjetaRuletaSeleccionada: FidelizacionTarjetaResponse | null = null;

  verRuleta(tarjeta: FidelizacionTarjetaResponse): void {
    this.tarjetaRuletaSeleccionada = tarjeta;
    this.showRuletaModal = true;
  }

  cerrarModalRuleta(): void {
    this.showRuletaModal = false;
    this.tarjetaRuletaSeleccionada = null;
  }

  onGiroRealizado(recompensa: RecompensaObtenida): void {
    this.messageService.add({
      severity: 'success',
      summary: recompensa.premioMayor ? '¡Premio mayor! 🎉' : '¡Ganaste un premio!',
      detail: recompensa.itemNombre,
      life: 4500,
    });
    this.cargarMisTarjetas();
  }

}