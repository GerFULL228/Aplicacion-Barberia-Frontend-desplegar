import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { PersonaService } from '@/app/core/services/gestion/persona.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-informacion-basica',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './informacion-basica.html',
  styleUrl: './informacion-basica.css',
})
export class InformacionBasica {

  private fb = inject(FormBuilder);

  private personaService = inject(PersonaService);
  private messageService = inject(MessageService);

  @Input() personaId!: number;

  @Input() nombre: string = '';

  @Input() apellido: string = '';

  @Input() telefono: string = '';

  @Input() email: string = '';

  @Input() registro: string = '';

  @Output() actualizado = new EventEmitter<void>();

  editando = false;

  cargando = false;

  form = this.fb.group({

    nombre: ['', Validators.required],

    apellido: ['', Validators.required],

    telefono: ['', Validators.required],

    email: ['', [
      Validators.required,
      Validators.email
    ]]
  });

  ngOnInit(): void {
    this.cargarFormulario();
  }

  private cargarFormulario(): void {

    this.form.patchValue({

      nombre: this.nombre,

      apellido: this.apellido,

      telefono: this.telefono,

      email: this.email
    });
  }

  activarEdicion(): void {

    this.editando = true;

    this.cargarFormulario();
  }

  cancelar(): void {

    this.editando = false;

    this.cargarFormulario();
  }

  guardar(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.cargando = true;

    this.personaService.actualizarPersona(
      this.personaId,
      this.form.getRawValue() as any
    )
      .subscribe({

        next: () => {

          this.nombre = this.form.value.nombre ?? '';

          this.apellido = this.form.value.apellido ?? '';

          this.telefono = this.form.value.telefono ?? '';

          this.email = this.form.value.email ?? '';

          this.editando = false;

          this.cargando = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Datos actualizados correctamente',
            life: 3000
          });

          this.actualizado.emit();
        },

        error: () => {

          this.cargando = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar los datos',
            life: 3000
          });
        }
      });
  }
}