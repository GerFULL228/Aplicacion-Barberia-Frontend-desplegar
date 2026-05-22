import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '@/app/core/services/auth/usuario.service';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { ResetPasswordRequest } from '@/app/core/models/auth/usuario/reset-password-request.model';
import { UpdateUsernameRequest } from '@/app/core/models/auth/usuario/update-username-request.model';

@Component({
  selector: 'app-credenciales-perfil-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './credenciales-perfil-usuario.html',
  styleUrl: './credenciales-perfil-usuario.css',
})
export class CredencialesPerfilUsuario {

  private fb           = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private notification = inject(NotificationService);

  @Input() usuario:    string = 'No disponible';
  @Input() contrasena: string = 'No disponible';
  @Input() idUsuario:  number = 0;

  /** URL de la imagen QR (base64 o URL). Si es null, el usuario no tiene QR. */
  @Input() qrImageUrl: string | null = null;

  @Output() passwordReset   = new EventEmitter<void>();
  @Output() usernameUpdate  = new EventEmitter<void>();
  @Output() qrGenerated     = new EventEmitter<string>(); // emite la nueva URL del QR

  // ── Estado modales ────────────────────────────────────────────────────────
  showResetModal        = false;
  showEditUsernameModal = false;
  showQrModal           = false;

  // ── Estado general ────────────────────────────────────────────────────────
  isSubmitting   = false;
  isGeneratingQr = false;

  showNewPassword     = false;
  showConfirmPassword = false;

  // ── Formularios ───────────────────────────────────────────────────────────
  form = this.fb.group({
    newPassword:     ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  usernameForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
  });

  get f()  { return this.form.controls; }
  get uf() { return this.usernameForm.controls; }

  // ─── Reset contraseña ─────────────────────────────────────────────────────

  openResetModal(): void {
    this.form.reset();
    this.showNewPassword     = false;
    this.showConfirmPassword = false;
    this.form.setErrors(null);
    this.showResetModal = true;
  }

  closeResetModal(): void {
    this.showResetModal = false;
    this.isSubmitting   = false;
    this.form.reset();
  }

  toggleNewPassword():     void { this.showNewPassword     = !this.showNewPassword; }
  toggleConfirmPassword(): void { this.showConfirmPassword = !this.showConfirmPassword; }

  confirmResetPassword(): void {
    if (!this.idUsuario) { this.notification.showWarn('No se pudo identificar el usuario.'); return; }
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const newPassword     = this.f.newPassword.value?.trim()     ?? '';
    const confirmPassword = this.f.confirmPassword.value?.trim() ?? '';

    if (newPassword !== confirmPassword) {
      this.f.confirmPassword.setErrors({ mismatch: true });
      return;
    }

    this.isSubmitting = true;
    const payload: ResetPasswordRequest = { newPassword };

    this.usuarioService.resetPassword(this.idUsuario, payload).subscribe({
      next: (res) => {
        this.notification.showSuccess(res?.message || 'Contraseña restablecida correctamente');
        this.closeResetModal();
        this.passwordReset.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notification.showHttpError(err, 'Resetear contraseña');
      },
    });
  }

  // ─── Editar usuario ───────────────────────────────────────────────────────

  openEditUsernameModal(): void {
    this.usernameForm.reset({ username: this.usuario });
    this.usernameForm.setErrors(null);
    this.showEditUsernameModal = true;
  }

  closeEditUsernameModal(): void {
    this.showEditUsernameModal = false;
    this.isSubmitting          = false;
    this.usernameForm.reset();
  }

  confirmUpdateUsername(): void {
    if (!this.idUsuario) { this.notification.showWarn('No se pudo identificar el usuario.'); return; }
    if (this.usernameForm.invalid) { this.usernameForm.markAllAsTouched(); return; }

    const newUsername = this.uf.username.value?.trim() ?? '';
    if (newUsername === this.usuario) {
      this.notification.showWarn('El nuevo nombre de usuario es igual al actual.');
      return;
    }

    this.isSubmitting = true;
    const payload: UpdateUsernameRequest = { username: newUsername };

    this.usuarioService.updateUsername(this.idUsuario, payload).subscribe({
      next: (res) => {
        this.usuario = newUsername;
        this.notification.showSuccess(res?.message || 'Nombre de usuario actualizado correctamente');
        this.closeEditUsernameModal();
        this.usernameUpdate.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notification.showHttpError(err, 'Actualizar nombre de usuario');
      },
    });
  }

  // ─── QR ──────────────────────────────────────────────────────────────────

  openGenerateQrModal(): void {
    this.showQrModal = true;
  }

  openRegenerateQrModal(): void {
    this.showQrModal = true;
  }

  closeQrModal(): void {
    this.showQrModal    = false;
    this.isGeneratingQr = false;
  }

  confirmGenerateQr(): void {
    if (!this.idUsuario) { this.notification.showWarn('No se pudo identificar el usuario.'); return; }

    this.isGeneratingQr = true;

    this.usuarioService.generateQr(this.idUsuario).subscribe({
      next: (res) => {
        // Se espera que el servicio devuelva { qrUrl: string } o similar
        const url = res?.qrUrl ?? res?.qrImageUrl ?? res?.data ?? null;
        this.qrImageUrl = url;
        this.isGeneratingQr = false;
        this.notification.showSuccess('Código QR generado correctamente');
        this.closeQrModal();
        if (url) this.qrGenerated.emit(url);
      },
      error: (err) => {
        this.isGeneratingQr = false;
        this.notification.showHttpError(err, 'Generar QR');
      },
    });
  }
}