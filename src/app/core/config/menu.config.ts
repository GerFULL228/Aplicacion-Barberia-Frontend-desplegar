export const MENU_CONFIG = [
  {
    label: 'Dashboard',
    icon: 'pi pi-th-large',
    route: '/dashboard',
    permission: 'DASHBOARD_READ'
  },
  {
    label: 'Clientes',
    icon: 'pi pi-users',
    route: '/dashboard/clientes',
    permission: 'USUARIO_VIEW'
  },
  {
    label: 'Barberos',
    icon: 'pi pi-user-plus',
    route: '/dashboard/barberos',
    permission: 'BARBERO_VIEW'
  },
  {
    label: 'Productos',
    icon: 'pi pi-box',
    route: '/dashboard/productos',
    permission: 'PRODUCTO_READ'
  },
  {
    label: 'Categorías',
    icon: 'pi pi-home',
    route: '/dashboard/categorias',
    permission: 'CATEGORIA_READ'
  },
  {
    label: 'Servicios',
    icon: 'pi pi-home',
    route: '/servicios',
    permission: 'SERVICIO_READ'
  },
  {
    label: 'Reservas',
    icon: 'pi pi-calendar',
    route: '/reservas',
    permission: 'RESERVA_READ'
  },
  {
    label: 'Ventas',
    icon: 'pi pi-shopping-cart',
    route: '/ventas',
    permission: 'VENTA_READ'
  },
  {
    label: 'Cortes',
    icon: 'pi pi-scissors',
    route: '/cortes',
    permission: 'CORTE_READ'
  },
  {
    label: 'Reportes',
    icon: 'pi pi-chart-bar',
    route: '/reportes',
    permission: 'REPORTE_READ'
  },
  {
    label: 'Estadísticas',
    icon: 'pi pi-chart-line',
    route: '/estadisticas',
    permission: 'ESTADISTICA_READ'
  },
  {
    label: 'Configuración',
    icon: 'pi pi-cog',
    route: '/configuracion',
    permission: 'CONFIGURACION_READ'
  }
];