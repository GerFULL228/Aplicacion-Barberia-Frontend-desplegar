import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { map, Observable, of, Subject, takeUntil, debounceTime, switchMap } from 'rxjs';

import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

import { Cliente } from '@/app/core/models/gestion/cliente/cliente.model';
import { ClienteService } from '@/app/core/services/gestion/cliente.service';
import { Barbero } from '@/app/core/models/gestion/barbero/barbero.model';
import { BarberoService } from '@/app/core/services/gestion/barbero.service';
import { Servicio } from '@/app/core/models/catalogos/servicios.model';
import { ServicioService } from '@/app/core/services/catalogos/servicio.service';

import { Router } from '@angular/router';
import { ReservaService } from '@/app/core/services/operaciones/reserva-service';

@Component({
  selector: 'app-create-reserva',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    ReactiveFormsModule,
    SelectModule,
    DatePickerModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    DialogModule
  ],
  providers: [MessageService],
  templateUrl: './create-reserva.html',
  styleUrl: './create-reserva.css'
})
export class CreateReserva implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private barberoService = inject(BarberoService);
  private servicioService = inject(ServicioService);
  private reservaService = inject(ReservaService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

  clientes$!: Observable<any[]>;
  barberos$!: Observable<any[]>;
  servicios$!: Observable<Servicio[]>;
  
  isLoading = false;
  checkingDisponibility = false;
  showConfirmDialog = false;
  reservaPreview: any = null;

  horarios = [
    { label: '09:00 AM', value: '09:00', disabled: false },
    { label: '09:30 AM', value: '09:30', disabled: false },
    { label: '10:00 AM', value: '10:00', disabled: false },
    { label: '10:30 AM', value: '10:30', disabled: false },
    { label: '11:00 AM', value: '11:00', disabled: false },
    { label: '11:30 AM', value: '11:30', disabled: false },
    { label: '12:00 PM', value: '12:00', disabled: false },
    { label: '12:30 PM', value: '12:30', disabled: false },
    { label: '02:00 PM', value: '14:00', disabled: false },
    { label: '02:30 PM', value: '14:30', disabled: false },
    { label: '03:00 PM', value: '15:00', disabled: false },
    { label: '03:30 PM', value: '15:30', disabled: false },
    { label: '04:00 PM', value: '16:00', disabled: false },
    { label: '04:30 PM', value: '16:30', disabled: false },
    { label: '05:00 PM', value: '17:00', disabled: false }
  ];

  reservaForm = this.fb.group({
    clienteId: [null, [Validators.required]],
    barberoId: [null, [Validators.required]],
    servicioId: [null, [Validators.required]],
    fecha: [null, [Validators.required, this.fechaValida.bind(this)]],
    hora: [null, [Validators.required]],
    observacion: ['', [Validators.maxLength(500)]]
  });

  ngOnInit(): void {
    this.cargarDatos();
    this.setupDisponibilityCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarDatos(): void {
    this.clientes$ = this.clienteService.listar().pipe(
      map(response => {
        if (response?.data?.content) {
          return response.data.content.map((cliente: Cliente) => ({
            ...cliente,
            nombreCompleto: `${cliente.persona.nombre} ${cliente.persona.apellido}`,
            email: cliente.persona.email,
            telefono: cliente.persona.telefono
          }));
        }
        return [];
      })
    );

    this.barberos$ = this.barberoService.listar().pipe(
      map(response => {
        if (response?.data?.content) {
          return response.data.content.map((barbero: Barbero) => ({
            ...barbero,
            nombreCompleto: `${barbero.persona.nombre} ${barbero.persona.apellido}`,
            
          }));
        }
        return [];
      })
    );

    this.servicios$ = this.servicioService.obtenerServicios().pipe(
      map(servicios => servicios || [])
    );
  }

  private setupDisponibilityCheck(): void {
    // Verificar disponibilidad cuando cambie barbero, fecha u hora
    this.reservaForm.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.destroy$),
      switchMap(formValues => {
        const { barberoId, fecha, hora } = formValues;
        if (barberoId && fecha && hora) {
          this.checkingDisponibility = true;
          return this.reservaService.verificarDisponibilidad(fecha as Date, hora as string, barberoId as number);
        }
        return of(null);
      })
    ).subscribe(response => {
      this.checkingDisponibility = false;
      if (response && !response.disponible) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Horario no disponible',
          detail: 'El barbero ya tiene una reserva en este horario. Por favor selecciona otra hora.',
          life: 5000
        });
        this.reservaForm.get('hora')?.setErrors({ noDisponible: true });
      } else if (response?.disponible) {
        this.reservaForm.get('hora')?.setErrors(null);
      }
    });
  }

  fechaValida(control: AbstractControl): ValidationErrors | null {
    const fecha = control.value;
    if (!fecha) return null;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fecha < hoy) {
      return { fechaInvalida: 'La fecha no puede ser anterior a hoy' };
    }
    
    return null;
  }

  guardarReserva(): void {
    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos correctamente.'
      });
      return;
    }

    const reserva = this.reservaForm.getRawValue();
    
    // Preparar vista previa
    this.reservaPreview = {
      ...reserva,
      fechaFormateada: reserva.fecha ? new Date(reserva.fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : ''
    };
    
    this.showConfirmDialog = true;
  }

  confirmarGuardar(): void {
    this.showConfirmDialog = false;
    this.isLoading = true;
    
    const reserva = this.reservaForm.getRawValue();
    
    this.reservaService.guardarReserva(reserva).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: '¡Reserva creada!',
            detail: 'La reserva se ha creado exitosamente.',
            life: 3000
          });
          
          setTimeout(() => {
            this.router.navigate(['/operaciones/reservas']);
          }, 2000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'No se pudo crear la reserva'
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al guardar reserva:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error del servidor',
          detail: error.error?.message || 'Ocurrió un error al guardar la reserva. Intenta nuevamente.'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/operaciones/reservas']);
  }

  resetForm(): void {
    this.reservaForm.reset();
    this.reservaForm.markAsPristine();
    this.reservaForm.markAsUntouched();
  }

  // Getters para validaciones en template
  get clienteInvalido(): boolean {
    const control = this.reservaForm.get('clienteId');
    return control ? control.invalid && control.touched : false;
  }

  get barberoInvalido(): boolean {
    const control = this.reservaForm.get('barberoId');
    return control ? control.invalid && control.touched : false;
  }

  get servicioInvalido(): boolean {
    const control = this.reservaForm.get('servicioId');
    return control ? control.invalid && control.touched : false;
  }

  get fechaInvalida(): boolean {
    const control = this.reservaForm.get('fecha');
    return control ? control.invalid && control.touched : false;
  }

  get horaInvalida(): boolean {
    const control = this.reservaForm.get('hora');
    return control ? control.invalid && control.touched : false;
  }
}