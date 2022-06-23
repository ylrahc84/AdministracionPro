import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';

//Mantenimientos
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { AgenciasComponent } from './mantenimientos/agencias/agencias.component';
import { AgenciaComponent } from './mantenimientos/agencias/agencia.component';
//Operaciones -- Reservas
import { ReservasComponent } from './operaciones/reservas/reservas.component';
import { ReservaComponent } from './operaciones/reservas/reserva.component';
//Operaciones -- Punto de Venta
import { InvoicesComponent } from './operaciones/PuntoVenta/invoices/invoices.component';


const routes: Routes = [
    { 
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        children: [
            { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar' }},
            { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Gráfica #1' }},
            { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de cuenta' }},
            { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' }},
            { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' }},
            { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil de usuario' }},

          //Mantenimientos
          {
            path:'usuarios',
            component: UsuariosComponent,
            data: { titulo:'Usuario de Aplicacion'}
          },
          {
            path:'agencias',
            component: AgenciasComponent,
            data:{titulo:'Listado de Agencias'}
          },
          {
            path:'agencia/:id',
            component: AgenciaComponent,
            data:{titulo:'Mantenimiento de Agencia'}
          },
          //Operaciones
          //Reservas
          {
            path:'reservas',
            component: ReservasComponent,
            data:{titulo:'Listado de Reservas'}
          },
          {
            path:'reserva/:id',
            component: ReservaComponent,
            data:{titulo:'Nueva Reservas'}
          },
          //Operaciones
          //Punto de Venta
          {
            path:'Invoices',
            component: InvoicesComponent,
            data:{titulo:'Listado de Documentos'}
          }
        ]
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}


