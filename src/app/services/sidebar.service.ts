import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main', url: '/' }
        /*
        { titulo: 'Gráficas', url: 'grafica1' },
        { titulo: 'rxjs', url: 'rxjs' },
        { titulo: 'Promesas', url: 'promesas' },
        { titulo: 'ProgressBar', url: 'progress' },
        */
      ]
    },

    {
      titulo:'Mantenimientos',
      icono:'mdi mdi-folder-lock-open',
      submenu:[
        {
          titulo:'Usuarios',
          url:'usuarios'
        },
        {
          titulo:'Agencias',
          url:'agencias'
        }

      ]
    },
    {
      titulo:'Reservas',
      icono:'mdi mdi mdi-flattr',
      submenu:[
        {
          titulo:'Reservas Tours',
          url:'reservas'
        }

      ]
    },
    {
      titulo:'Punto de Venta',
      icono:'mdi mdi mdi-flattr',
      submenu:[
        {
          titulo:'Invoices',
          url:'Invoices'
        }
      ]
    },
  ]

  constructor() { }
}
