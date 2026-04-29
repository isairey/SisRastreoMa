import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './contacto/contacto.component';
import { InteligenciaNegocioComponent } from './servicio/inteligencia-negocio/inteligencia-negocio.component';
import { RastreoSatelitalComponent } from './servicio/rastreo-satelital/rastreo-satelital.component';
import { DesarrolloSoftwareComponent } from './servicio/desarrollo-software/desarrollo-software.component';
import { DisenoWebComponent } from './servicio/diseno-web/diseno-web.component';
import { SobreNosotrosComponent } from './sobre-nosotros/sobre-nosotros.component';


export const routes: Routes = [
  {
    path: 'sobre_nosotros',
    component: SobreNosotrosComponent
  },
  {
    path: 'contacto',
    component: ContactoComponent
  },
  {
    path: 'inteligencia_negocio',
    component: InteligenciaNegocioComponent
  },
  {
    path: 'rastreo-satelital',
    component: RastreoSatelitalComponent
  },
  {
    path: 'desarrollo_software',
    component: DesarrolloSoftwareComponent
  },
  {
    path: 'diseno_web',
    component: DisenoWebComponent
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
export class MenuRoutingModule { }
