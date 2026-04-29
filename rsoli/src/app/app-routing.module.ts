import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'shared',
    loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./paginas/menu/menu.module').then(m => m.MenuModule)
  },
  {
    path: 'seguridad',
    loadChildren: () => import('./paginas/seguridad/seguridad.module').then(m => m.SeguridadModule)
  },
  {
    path: 'rastreo',
    loadChildren: () => import('./paginas/rastreo/rastreo.module').then(m => m.RastreoModule)
  },
  {
    path: 'parametros',
    loadChildren: () => import('./paginas/parametros/parametros.module').then(m => m.ParametrosModule)
  },
  {
    path: '**',
    redirectTo: '/shared/slider',
    pathMatch: 'full'
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
