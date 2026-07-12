import { RuletaTab } from "../models/ruleta/ruleta-grafico.model";

export const RULETA_TABS: RuletaTab[] = [
    { label: 'Ruletas', value: 'ruletas', icon: 'pi pi-spin pi-sync' },
    { label: 'Configuraciones', value: 'configuracion', icon: 'pi pi-cog' },
    { label: 'Items', value: 'items', icon: 'pi pi-gift' },
    // { label: 'Categorías', value: 'categorias', icon: 'pi pi-tags' },
    { label: 'Preview', value: 'preview', icon: 'pi pi-eye' },
];

export const FIDELIZACION_ADMIN_TABS = [
    // { label: 'Configuraciones', value: 'configuracion', icon: 'pi pi-cog' },
    { label: 'Reglas', value: 'reglas', icon: 'pi pi-list-check' },
    { label: 'Tarjetas', value: 'tarjetas', icon: 'pi pi-id-card' }
];