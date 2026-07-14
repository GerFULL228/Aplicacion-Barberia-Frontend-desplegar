import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SafeImageUrlPipe } from '@/app/shared/pipes/safe-image-url.pipe';
import { SolesPipe } from '@/app/shared/pipes/moneda.pipe';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { PremioCard } from '@/app/core/models/ruleta/ruleta-grafico.model';
import { ImageModule } from 'primeng/image';

@Component({
    selector: 'app-premio-card',
    standalone: true,
    imports: [ ButtonModule, SafeImageUrlPipe, SolesPipe, StatusBadgeComponent, ImageModule],
    templateUrl: './premio-card.html'
})
export class PremioCardComponent {
    @Input({ required: true }) premio!: PremioCard;
    @Input() editable = false;
    @Input() compact = false;
    @Input() mostrarPrecio = true;
    @Input() mostrarDescripcion = true;
    @Input() mostrarSubtitulo = true;
    @Input() mostrarBadge = true;
    @Input() botonTexto = 'Cambiar';
    @Output() editar = new EventEmitter<void>();
}