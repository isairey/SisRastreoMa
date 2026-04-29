import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MonitoreoService } from '../../monitoreo/monitoreo.service';
import { formatDate } from '@angular/common';
import Swal from'sweetalert2';
import { MessageService } from 'primeng/api';

import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-recorrido',
  templateUrl: './recorrido.component.html',
  styleUrls: ['./recorrido.component.css'],
  providers: [MessageService]
})
export class RecorridoComponent implements OnInit {

  fecha_ratreo: Date=new Date();
  hora_inicio=new Date('2023-10-06 01:00:00');
  hora_fin=new Date('2023-10-06 23:59:59');

  visible_filtros: any;
  vehiculo!: any[];
  vehiculo_seleccionado:any;

  lista_recorrido :any=[];
  loading: boolean = true;

  
  fileName= 'ExcelSheet.xlsx';

  @ViewChild('htmlData') htmlData:ElementRef | undefined;

  constructor(
    private monitoreo_servicio:MonitoreoService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.IniciarFiltros();
  }
  IniciarFiltros(){
    this.loading_alert();
    this.monitoreo_servicio.get_filtros_monitoreo().subscribe(data=>{
      this.closeLoading_alert();
      this.loading=false;
      // console.log("veeeeeer ",data)
      this.vehiculo=JSON.parse(JSON.stringify(data)).lista_vehiculo;
      this.vehiculo_seleccionado=JSON.parse(JSON.stringify(data)).lista_vehiculo[0];

      this.CargarRecorrido();

     
    },
    error=>{
      this.loading=false;
      this.closeLoading_alert();
    })
  }
  CargarRecorrido(){


    this.visible_filtros=false;
    if(!this.vehiculo_seleccionado){
      this.error("Error","El campo vehiculo es requerido");
    }
    else{
      if(!this.fecha_ratreo){
        this.error("Error","El campo fecha es requerido");
      }else{
        if(!this.hora_inicio){
          this.error("Error","El campo Hora inicio es requerido");
        }else{
          if(!this.hora_fin){
            this.error("Error","El campo Hora fin es requerido");
          }else{
            this.EjecutarFiltros();
          }
        }
      }
    }

  }
  EjecutarFiltros(){
    
    this.loading_alert();
    formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')
    let f_ini=formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')+' '+this.hora_inicio.toLocaleTimeString();
    let f_fin=formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')+' '+this.hora_fin.toLocaleTimeString();

    
    this.monitoreo_servicio.post_monitoreo_rutas({id_vehiculos:this.vehiculo_seleccionado.id_vehiculo,fecha_inicio:f_ini,fecha_fin:f_fin}).subscribe(data=>{
      this.loading = false;

      this.closeLoading_alert();
      this.lista_recorrido=JSON.parse(JSON.stringify(data)).lista_monitoreo_tiempo_real;
      if(this.lista_recorrido.length==0){
        this.messageService.add({severity: 'info', summary: 'Información', detail: 'No existen datos con los filtros actuales'});
      }
     
    },
    error=>{
      this.loading = false;
      this.closeLoading_alert();
      console.log("ver errores ",error);
    })
  }
  MostrarFiltros(){
    this.visible_filtros=true;
  }
  loading_alert(){
    Swal.fire({
      title: 'Espere un momento por favor',
      html: 'Cargando',
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading()
      },
    }); 
  }
  closeLoading_alert(){
    Swal.close();
  }
  error(titulo:string,mensaje:string){
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
      didClose:() =>{
        this.visible_filtros=true;
      }
    });
  }
  ExportarExcel(){
      this.loading_alert();
       /* table id is passed over here */   
       let element = document.getElementById('tabla_recurrido'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
       this.closeLoading_alert();
  }

}
