import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitoreoVehiculoComponent } from './monitoreo/monitoreo-vehiculo/monitoreo-vehiculo.component';
import { RecorridoComponent } from './reportes/recorrido/recorrido.component';
import { ParqueoComponent } from './reportes/parqueo/parqueo.component';
import { ListaClienteComponent } from './servicio/cliente/lista-cliente/lista-cliente.component';
import { ListaVehiculoComponent } from './servicio/vehiculo/lista-vehiculo/lista-vehiculo.component';
import { GeocercaComponent } from './monitoreo/geocerca/geocerca.component';
import { FormularioGeocercaComponent } from './monitoreo/formulario-geocerca/formulario-geocerca.component';
import { VehiculoComponent } from './monitoreo/vehiculo/vehiculo.component';


const routes: Routes = [
  {
    path: 'monitoreo_vehiculo',
    component: MonitoreoVehiculoComponent
  },
  {
    path: 'reporte_recorrido',
    component: RecorridoComponent
  },
  {
    path: 'reporte_parqueos',
    component: ParqueoComponent
  },
  {
    path: 'lista_cliente',
    component: ListaClienteComponent
  },
  {
    path: 'lista_vehiculo/:id',
    component: ListaVehiculoComponent
  },
  {
    path: 'lista_geocerca',
    component: GeocercaComponent
  },
  {
    path: 'formulario_geocerca',
    component: FormularioGeocercaComponent
  },
  {
    path: 'lista_vehiculo',
    component: VehiculoComponent
  },
  {
    path: '**',
    redirectTo: '/shared/slider',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RastreoRoutingModule { }
