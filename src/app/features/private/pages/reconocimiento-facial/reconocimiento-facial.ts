import { AnalisisResponse } from '@/app/core/models/reconocimiento-facial/Ia.model';
import { IaService } from '@/app/core/services/reconocimiento-facial/reconocimiento-facial.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Camara } from './components/camara/camara';
import { Resultado } from './components/resultado/resultado';

@Component({
  selector: 'app-reconocimiento-facial',
  standalone: true,
  imports: [
    CommonModule,
    Camara,
    Resultado
  ],
  templateUrl: './reconocimiento-facial.html',
  styleUrl: './reconocimiento-facial.css',
})
export class ReconocimientoFacial {

  previewFoto = '';

  onPreview(url: string) {
    this.previewFoto = url;
  }
  fotoBlob?: Blob;

  resultado?: AnalisisResponse;

  cargando = false;

  error = '';

  // TEMPORAL
  idCliente = 1;

  constructor(
    private iaService: IaService
  ) { }

  onFotoTomada(blob: Blob) {
    this.fotoBlob = blob;
  }

  analizar() {

    if (!this.fotoBlob) {
      return;
    }

    this.cargando = true;
    this.error = '';

    this.iaService
      .analizar(this.fotoBlob, this.idCliente)
      .subscribe({
        next: (resp: AnalisisResponse) => {
          this.resultado = resp;
          this.cargando = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error al analizar la imagen';
          this.cargando = false;
        }
      });
  }

  reiniciar() {
    this.resultado = undefined;
    this.fotoBlob = undefined;
    this.error = '';
  }

  analizarOtraVez() {
  window.location.reload();
}
}