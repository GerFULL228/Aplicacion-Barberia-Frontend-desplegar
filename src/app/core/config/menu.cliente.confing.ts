export const CLIENTE_MENU = [

    {
        label: "Dashboard",
        icon: "pi pi-home",
        routerLink: ["dashboard"],
        routerLinkActiveOptions: { exact: true },
        permission: "CLIENTE_DASHBOARD_READ"
    },

    {
        label: "Reservas",
        icon: "pi pi-calendar",
        items: [
            {
                label: "Agendar Cita",
                icon: "pi pi-plus-circle",
                routerLink: ["reservar/agendar"],
                permission: "RESERVA_CREATE"
            },
            {
                label: "Mis Reservas",
                icon: "pi pi-clock",
                routerLink: ["reservas/mis-reservas"],
                permission: "RESERVA_READ_OWN"
            }
        ]
    },

    {
        label: "Análisis Facial",
        icon: "pi pi-camera",
        routerLink: ["ia/analisis-facial"],
    },

    {
        label: "Historial",
        icon: "pi pi-history",
        routerLink: ["historial"],
        permission: "HISTORIAL_READ"
    },

    {
        label: "Fidelización",
        icon: "pi pi-star",
        items: [
            {
                label: "Mi progreso",
                icon: "pi pi-chart-line",
                routerLink: ["rewards/resumen"],
                permission: "FIDELIZACION_READ"
            },
            {
                label: "Mis tarjetas",
                icon: "pi pi-id-card",
                routerLink: ["rewards/tarjetas"],
                permission: "FIDELIZACION_READ"
            },
            {
                label: "Ruleta",
                icon: "pi pi-spin pi-sync",
                routerLink: ["rewards/ruleta"],
                permission: "GIRO_REALIZAR"
            },
            {
                label: "Mis giros",
                icon: "pi pi-history",
                routerLink: ["rewards/giros"],
                permission: "FIDELIZACION_READ"
            },
            {
                label: "Mis recompensas",
                icon: "pi pi-gift",
                routerLink: ["rewards/recompensas"],
                permission: "RECOMPENSA_READ"
            }
        ]
    },

    {
        label: "Perfil",
        icon: "pi pi-user",
        routerLink: ["perfil"],
        permission: "PERFIL_UPDATE"
    }
];