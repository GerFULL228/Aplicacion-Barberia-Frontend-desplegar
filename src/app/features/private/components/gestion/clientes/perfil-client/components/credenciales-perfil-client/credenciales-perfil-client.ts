import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-credenciales-perfil-client',
  imports: [],
  templateUrl: './credenciales-perfil-client.html',
  styleUrl: './credenciales-perfil-client.css',
})
export class CredencialesPerfilClient {
  @Input() usuario: string = 'null';
  @Input() contrasena: string = 'null';
  @Output() resetPassword = new EventEmitter<void>();

  onResetPassword(): void {
    this.resetPassword.emit();
  }
}
