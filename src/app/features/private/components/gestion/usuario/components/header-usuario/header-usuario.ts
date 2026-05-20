import { SearchBarComponent } from '@/app/shared/components/search-bar/search-bar.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header-usuario',
  imports: [SearchBarComponent, ButtonModule, RouterLink],
  templateUrl: './header-usuario.html',
  styleUrl: './header-usuario.css',
})
export class HeaderUsuario {
  @Input() title: string = 'Usuarios';
  @Input() icon: string = 'pi-users';
  @Input() description: string = 'Gestión y administración de Usuarios';
  @Input() buttonLabel: string = 'Nuevo';
  @Output() create = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  onCreate() { this.create.emit(); }
  onSearch(q: string) { this.search.emit(q); }
}
