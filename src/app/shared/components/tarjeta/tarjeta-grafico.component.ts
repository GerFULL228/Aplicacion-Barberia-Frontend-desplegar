import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FidelizacionTarjetaResponse } from '@/app/core/models/fidelizacion/tarjeta.model';
import { FidelizacionMovimientoService } from '@/app/core/services/fidelizacion/movimiento.service';
import { Movimiento, Origen } from '@/app/core/models/fidelizacion/movimiento.model';
import { NotificationService } from '@/app/core/services/common/notification.service';

@Component({
    standalone: true,
    selector: 'app-tarjeta-grafico',
    imports: [CommonModule, ButtonModule],
    templateUrl: './tarjeta-grafico.html',
    styleUrl: './tarjeta-grafico.css',
})
export class TarjetaGraficoComponent implements OnInit {
    /** 'admin' = cards por categoría con progreso + historial expandible
     *  'cliente' = tarjeta tipo "sello de coronitas"
     *  'dashboard' = saludo + giros + mini tarjetas + timeline de movimientos */
    @Input() variante: 'admin' | 'cliente' | 'dashboard' = 'admin';
    @Input() clienteNombre = '';
    @Input() nivel = 'Miembro';
    @Input({ required: true }) tarjetas: FidelizacionTarjetaResponse[] = [];
    @Input() metaPorCategoria = 10;
    @Output() canjear = new EventEmitter<FidelizacionTarjetaResponse>();
    @Output() girar = new EventEmitter<void>();

    private movimientoService = inject(FidelizacionMovimientoService);
    private notify = inject(NotificationService);

    readonly Origen = Origen;
    private readonly iconosCategoria = ['pi-scissors', 'pi-heart', 'pi-user', 'pi-sparkles', 'pi-star'];

    private tarjetaExpandidaId = signal<number | null>(null);
    private movimientosPorTarjeta = signal<Record<number, Movimiento[]>>({});
    private cargandoMovimientos = signal<Record<number, boolean>>({});

    movimientosDashboard = signal<Movimiento[]>([]);
    cargandoDashboard = signal(false);

    ngOnInit(): void {
        if (this.variante === 'dashboard') {
            this.cargarMovimientosDashboard();
        }
    }

    private cargarMovimientosDashboard(): void {
        this.cargandoDashboard.set(true);
        this.movimientoService.obtenerMisMovimientos().subscribe({
            next: (resp) => {
                this.movimientosDashboard.set(resp.data);
                this.cargandoDashboard.set(false);
            },
            error: (err) => {
                this.notify.showHttpError(err.message);
                this.cargandoDashboard.set(false);
            },
        });
    }

    get girosTotales(): number {
        return this.tarjetas.reduce((acc, t) => acc + (t.girosDisponibles ?? 0), 0);
    }

    get gruposMovimientos(): { etiqueta: string; items: Movimiento[] }[] {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const ayer = new Date(hoy);
        ayer.setDate(ayer.getDate() - 1);

        const grupos = new Map<string, Movimiento[]>();
        for (const m of this.movimientosDashboard()) {
            const fecha = new Date(m.createdAt);
            const soloFecha = new Date(fecha);
            soloFecha.setHours(0, 0, 0, 0);
            let etiqueta: string;
            if (soloFecha.getTime() === hoy.getTime()) etiqueta = 'Hoy';
            else if (soloFecha.getTime() === ayer.getTime()) etiqueta = 'Ayer';
            else etiqueta = fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });

            if (!grupos.has(etiqueta)) grupos.set(etiqueta, []);
            grupos.get(etiqueta)!.push(m);
        }
        return Array.from(grupos.entries()).map(([etiqueta, items]) => ({ etiqueta, items }));
    }

    iconoCategoria(index: number): string {
        return this.iconosCategoria[index % this.iconosCategoria.length];
    }

    toggleExpandir(tarjeta: FidelizacionTarjetaResponse): void {
        const actual = this.tarjetaExpandidaId();
        if (actual === tarjeta.id) {
            this.tarjetaExpandidaId.set(null);
            return;
        }
        this.tarjetaExpandidaId.set(tarjeta.id);
        if (!this.movimientosPorTarjeta()[tarjeta.id]) {
            this.cargarMovimientos(tarjeta.id);
        }
    }

    estaExpandida(tarjeta: FidelizacionTarjetaResponse): boolean {
        return this.tarjetaExpandidaId() === tarjeta.id;
    }

    movimientosDe(tarjeta: FidelizacionTarjetaResponse): Movimiento[] {
        return this.movimientosPorTarjeta()[tarjeta.id] ?? [];
    }

    estaCargando(tarjeta: FidelizacionTarjetaResponse): boolean {
        return !!this.cargandoMovimientos()[tarjeta.id];
    }

    private cargarMovimientos(tarjetaId: number): void {
        this.cargandoMovimientos.update((m) => ({ ...m, [tarjetaId]: true }));
        this.movimientoService.obtenerMovimientos({ tarjetaId, size: 30, sort: 'createdAt,desc' }).subscribe({
            next: (resp) => {
                this.movimientosPorTarjeta.update((m) => ({ ...m, [tarjetaId]: resp.data.content }));
                this.cargandoMovimientos.update((m) => ({ ...m, [tarjetaId]: false }));
            },
            error: (err) => {
                this.notify.showHttpError(err.message);
                this.cargandoMovimientos.update((m) => ({ ...m, [tarjetaId]: false }));
            },
        });
    }

    progresoPct(tarjeta: FidelizacionTarjetaResponse): number {
        if (!this.metaPorCategoria) return 0;
        return Math.min((tarjeta.progreso / this.metaPorCategoria) * 100, 100);
    }

    slots(): number[] {
        return Array.from({ length: this.metaPorCategoria }, (_, i) => i + 1);
    }

    puedeCanjear(tarjeta: FidelizacionTarjetaResponse): boolean {
        return tarjeta.girosDisponibles > 0 && tarjeta.cicloActivo;
    }

    iconoOrigen(origen: Origen): string {
        switch (origen) {
            case Origen.VENTA: return 'pi-shopping-cart';
            case Origen.RESERVA: return 'pi-calendar';
            case Origen.AJUSTE: return 'pi-sliders-h';
            default: return 'pi-circle';
        }
    }

    labelOrigen(origen: Origen): string {
        switch (origen) {
            case Origen.VENTA: return 'Venta';
            case Origen.RESERVA: return 'Reserva';
            case Origen.AJUSTE: return 'Ajuste';
            default: return origen;
        }
    }
}