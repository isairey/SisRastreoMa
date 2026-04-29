import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaUsuarioComponent } from './usuario/lista-usuario/lista-usuario.component';
import { ListaPersonaComponent } from './persona/lista-persona/lista-persona.component';
import { ListaRolComponent } from './rol/lista-rol/lista-rol.component';


export const routes: Routes = [
  {
    path: 'lista_usuario',
    component: ListaUsuarioComponent
  },
  {
    path: 'lista_persona',
    component: ListaPersonaComponent
  },
  {
    path: 'lista_rol',
    component: ListaRolComponent
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
export class SeguridadRoutingModule { }
