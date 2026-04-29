import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SliderComponent } from './slider/slider.component';

const routes: Routes = [
  { 
    path: 'slider', 
    component: SliderComponent },
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
export class SharedRoutingModule { }
