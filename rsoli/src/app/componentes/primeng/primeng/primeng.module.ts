import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimengRoutingModule } from './primeng-routing.module';
import { AccordionModule } from 'primeng/accordion';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { SidebarModule } from 'primeng/sidebar';
import {InputNumberModule} from 'primeng/inputnumber';
import { TreeModule } from 'primeng/tree';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {InputTextareaModule} from 'primeng/inputtextarea';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrimengRoutingModule
  ],
  exports: [
    AccordionModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    PasswordModule,
    ImageModule,
    GalleriaModule,
    SidebarModule,
    PanelMenuModule,
    TreeModule,
    ToastModule,
    TooltipModule,
    TableModule,
    InputNumberModule,
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
    AutoCompleteModule,
    InputTextareaModule
  ]
})
export class PrimengModule { }
