import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-camara',
  standalone: true,
  imports: [],
  templateUrl: './camara.html',
  styleUrl: './camara.css',
})
export class Camara {
  camaraActiva = false;

  fotoCapturada = false;

  previewFoto = '';

  @Output()
  fotoTomada = new EventEmitter<Blob>();

  @ViewChild('video')
  video!: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  stream?: MediaStream;

  @Output()
  previewGenerada =
    new EventEmitter<string>();

  async activarCamara() {

  this.stream = await navigator.mediaDevices.getUserMedia({
    video: true
  });

  this.video.nativeElement.srcObject = this.stream;

  this.camaraActiva = true;
}

  tomarFoto() {

    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(blob => {

      if (!blob) return;

      this.fotoTomada.emit(blob);

      const preview =
        URL.createObjectURL(blob);

      this.previewGenerada.emit(preview);

    }, 'image/jpeg');

  }
}