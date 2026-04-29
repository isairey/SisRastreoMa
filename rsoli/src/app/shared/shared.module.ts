import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './header/header.component';
import { SliderComponent } from './slider/slider.component';
import { FooterComponent } from './footer/footer.component';
import { MiniHeaderComponent } from './mini-header/mini-header.component';

import { IniciarSesionComponent } from '../paginas/seguridad/usuario/iniciar-sesion/iniciar-sesion.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PrimengModule } from '../componentes/primeng/primeng/primeng.module';


@NgModule({
  declarations: [
    HeaderComponent,
    SliderComponent,
    FooterComponent,
    MiniHeaderComponent,
    IniciarSesionComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    PrimengModule
  ],
  exports:[HeaderComponent,SliderComponent,FooterComponent,MiniHeaderComponent,IniciarSesionComponent,SidebarComponent],
})
export class SharedModule { }
