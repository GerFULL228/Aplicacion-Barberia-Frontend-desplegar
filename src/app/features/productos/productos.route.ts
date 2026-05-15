
export const PRODUCTOS_ROUTE = [
  { path: '',
    loadComponent: () => import('./public/pages/producto-lista/producto-list/producto-list').then(m => m.ProductoList),
  },
  
    
];