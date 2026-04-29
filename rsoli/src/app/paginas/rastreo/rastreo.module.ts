import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RastreoRoutingModule } from './rastreo-routing.module';
import { MonitoreoVehiculoComponent } from './monitoreo/monitoreo-vehiculo/monitoreo-vehiculo.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PrimengModule } from '../../componentes/primeng/primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { RecorridoComponent } from './reportes/recorrido/recorrido.component';
import { ParqueoComponent } from './reportes/parqueo/parqueo.component';
import { ListaClienteComponent } from './servicio/cliente/lista-cliente/lista-cliente.component';
import { ModalClienteComponent } from './servicio/cliente/modal-cliente/modal-cliente.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';  
import { ReactiveFormsModule } from '@angular/forms';
import { ListaVehiculoComponent } from './servicio/vehiculo/lista-vehiculo/lista-vehiculo.component';
import { ModalVehiculoComponent } from './servicio/vehiculo/modal-vehiculo/modal-vehiculo.component';
import { GeocercaComponent } from './monitoreo/geocerca/geocerca.component';

//import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { ModalGeocercaComponent } from './monitoreo/modal-geocerca/modal-geocerca.component';
import { FormularioGeocercaComponent } from './monitoreo/formulario-geocerca/formulario-geocerca.component';
import { VehiculoComponent } from './monitoreo/vehiculo/vehiculo.component';
import { VehiculoGeocercaComponent } from './monitoreo/vehiculo-geocerca/vehiculo-geocerca.component';


@NgModule({
  declarations: [
    MonitoreoVehiculoComponent,
    RecorridoComponent,
    ParqueoComponent,
    ListaClienteComponent,
    ModalClienteComponent,
    ListaVehiculoComponent,
    ModalVehiculoComponent,
    GeocercaComponent,
    ModalGeocercaComponent,
    FormularioGeocercaComponent,
    VehiculoComponent,
    VehiculoGeocercaComponent
  ],
  imports: [
    CommonModule,
    RastreoRoutingModule,
    LeafletModule,
    PrimengModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    LeafletDrawModule
  ],
  providers: [BsModalService],
})
export class RastreoModule { }
