import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaDepartamentoComponent } from './departamento/lista-departamento/lista-departamento.component';
import { ListaGestionComponent } from './gestion/lista-gestion/lista-gestion/lista-gestion.component';

const routes: Routes = [
  {
    path: 'lista_departamento',
    component: ListaDepartamentoComponent
  },
  {
    path: 'lista_gestion',
    component: ListaGestionComponent
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
export class ParametrosRoutingModule { }
