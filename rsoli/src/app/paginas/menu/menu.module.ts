import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu-routing.module';
import { ContactoComponent } from './contacto/contacto.component';
import { InteligenciaNegocioComponent } from './servicio/inteligencia-negocio/inteligencia-negocio.component';
import { RastreoSatelitalComponent } from './servicio/rastreo-satelital/rastreo-satelital.component';
import { DesarrolloSoftwareComponent } from './servicio/desarrollo-software/desarrollo-software.component';
import { DisenoWebComponent } from './servicio/diseno-web/diseno-web.component';
import { SobreNosotrosComponent } from './sobre-nosotros/sobre-nosotros.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    ContactoComponent,
    InteligenciaNegocioComponent,
    RastreoSatelitalComponent,
    DesarrolloSoftwareComponent,
    DisenoWebComponent,
    SobreNosotrosComponent,
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    ButtonModule
  ]
})
export class MenuModule { }
