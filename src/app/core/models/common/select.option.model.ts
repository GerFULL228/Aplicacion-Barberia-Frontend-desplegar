import { CategoriaTipo } from "../catalogos/categorias.model";

export interface SelectOption<T = string | number> {
    label: string;
    value?: T;
    id?: T;
}

// Opciones booleanas genéricas para filtros, se pueden extender o modificar según las necesidades de cada módulo
export function createBooleanOptions(labels: { trueLabel: string; falseLabel: string; }): SelectOption<boolean>[] {
    return [{ label: labels.trueLabel, value: true }, { label: labels.falseLabel, value: false }];
}

export const BOOLEAN_FILTERS = {
    activo: createBooleanOptions({ trueLabel: 'Activo', falseLabel: 'Inactivo' }),
    publicado: createBooleanOptions({ trueLabel: 'Publicado', falseLabel: 'No publicado' }),
    destacado: createBooleanOptions({ trueLabel: 'Destacado', falseLabel: 'No destacado' }),
    mostrarEnMenu: createBooleanOptions({ trueLabel: 'Mostrar en menú', falseLabel: 'No mostrar en menú' }),
    conStock: createBooleanOptions({ trueLabel: 'Con stock', falseLabel: 'Sin stock' }),
    enOferta: createBooleanOptions({ trueLabel: 'En oferta', falseLabel: 'Sin oferta' }),
    publico: createBooleanOptions({ trueLabel: 'Público', falseLabel: 'Interno' }),
} as const;

export const BOOLEAN_OPTIONS = BOOLEAN_FILTERS.activo;

export const CATEGORIA_BOOLEAN_FILTERS = {
    activo: BOOLEAN_FILTERS.activo,
    publicado: BOOLEAN_FILTERS.publicado,
    destacado: BOOLEAN_FILTERS.destacado,
    mostrarEnMenu: BOOLEAN_FILTERS.mostrarEnMenu,
}

export const PRODUCTO_BOOLEAN_FILTERS = {
    activo: BOOLEAN_FILTERS.activo,
    publicado: BOOLEAN_FILTERS.publicado,
    conStock: BOOLEAN_FILTERS.conStock,
    enOferta: BOOLEAN_FILTERS.enOferta,
}

export const RECLAMO_BOOLEAN_FILTERS = {
    publico: BOOLEAN_FILTERS.publico,
}   

//Ejemplo de filtro específico para reclamos, se pueden crear otros para cada módulo o usar genéricos
export const  CATEGORIA_OPTIONS: SelectOption<CategoriaTipo>[] = [
    { value: CategoriaTipo.PRODUCTO, label: 'Producto' },
    { value: CategoriaTipo.SERVICIO, label: 'Servicio' }
];

