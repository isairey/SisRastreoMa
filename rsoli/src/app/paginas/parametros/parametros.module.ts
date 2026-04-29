import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrosRoutingModule } from './parametros-routing.module';
import { ListaDepartamentoComponent } from './departamento/lista-departamento/lista-departamento.component';
import { ModalDepartamentoComponent } from './departamento/modal-departamento/modal-departamento.component';
import { PrimengModule } from '../../componentes/primeng/primeng/primeng.module';

import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalGestionComponent } from './gestion/modal-gestion/modal-gestion/modal-gestion.component';
import { ListaGestionComponent } from './gestion/lista-gestion/lista-gestion/lista-gestion.component';

@NgModule({
  declarations: [
    ListaDepartamentoComponent,
    ModalDepartamentoComponent,
    ModalGestionComponent,
    ListaGestionComponent
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    PrimengModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BsModalService],
})
export class ParametrosModule { }
