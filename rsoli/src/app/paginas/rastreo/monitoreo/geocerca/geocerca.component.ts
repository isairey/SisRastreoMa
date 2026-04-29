import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MonitoreoService } from '../monitoreo.service';
import { GeocercaModelo } from '../geocerca-model';
import { MessageService } from 'primeng/api';

import { Router} from '@angular/router';
import {ModalGeocercaComponent} from '../modal-geocerca/modal-geocerca.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-geocerca',
  templateUrl: './geocerca.component.html',
  styleUrls: ['./geocerca.component.css'],
  providers: [MessageService]
})
export class GeocercaComponent implements OnInit {
  

    nombre:String="";
    descripcion:String="";
    tipo_area_seleccionado!: any;
    tipo_area!: any[];


	lista_geocercas :Array<GeocercaModelo>=[];
	loading: boolean = true;
	geocerca_seleccionado=new GeocercaModelo();
	
	public modalRef!: BsModalRef;

    constructor(
		private monitoreo_servicio:MonitoreoService,
		private messageService: MessageService,
		private modalService: BsModalService,
		private router: Router
	) { }

    ngOnInit(): void {

		this.GetGeocercas();
		
    }
	FormularioGeocerca(id:number){

		this.BorrarToast();
		/*this.router.navigate(['/rastreo/formulario_geocerca'],  
		{ queryParams: 
			{ 
				id: id , 
				nombre_geocerca:this.geocerca_seleccionado.nombre_geocerca ,
				area:this.geocerca_seleccionado.area ,
				descripcion:this.geocerca_seleccionado.descripcion ,
				tipo_geocerca:this.geocerca_seleccionado.tipo_geocerca,
				titulo_formulario:''
			} 
		} ); */



		
		if(id==0){
		  let nuevo_geocerca =new GeocercaModelo();
		//   this.modalRef = this.modalService.show(ModalGeocercaComponent);
		//   this.modalRef.content.titulo="Nuevo geocerca";
		//   this.modalRef.content.persona=nuevo_geocerca;

		  this.router.navigate(['/rastreo/formulario_geocerca'],  
		  { queryParams: 
			  { 
				  id: 0 , 
				  nombre_geocerca:nuevo_geocerca.nombre_geocerca ,
				  area:nuevo_geocerca.area ,
				  descripcion:nuevo_geocerca.descripcion ,
				  tipo_geocerca:nuevo_geocerca.tipo_geocerca,
				  titulo_formulario:'Nuevo geocerca'
			  } 
		  } ); 
		 
		}else{
		   if(this.geocerca_seleccionado.id==0){
		 	this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un geocerca para editar'});
		   }else{
		 	// this.modalRef = this.modalService.show(ModalGeocercaComponent);
		 	// this.modalRef.content.titulo="Editar geocerca";
		 	// this.modalRef.content.geocerca=this.geocerca_seleccionado;
		 	// this.modalRef.content.IniciarFormulario();
			 this.router.navigate(['/rastreo/formulario_geocerca'],  
			 { queryParams: 
				 { 
					 id: this.geocerca_seleccionado.id , 
					 nombre_geocerca:this.geocerca_seleccionado.nombre_geocerca ,
					 area:this.geocerca_seleccionado.area ,
					 descripcion:this.geocerca_seleccionado.descripcion ,
					 tipo_geocerca:this.geocerca_seleccionado.tipo_geocerca,
					 titulo_formulario:'Editar geocerca'
				 } 
			 } ); 
			
		   }
	
		}
		
	
	}
	EliminarGeocerca(){
		this.BorrarToast();
		if(this.geocerca_seleccionado.id){
	
			Swal.fire({
			  title: '¿Esta seguro(a)?',
			  text: "No podra revertir esta acción!",
			  icon: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'SI, Eliminar!',
			  cancelButtonText: 'Cancelar'
			}).then((result) => {
			  if (result.isConfirmed) {
				this.loading_alert();
				this.monitoreo_servicio.eliminar_geocerca(this.geocerca_seleccionado.id).subscribe(data=>{
				  this.closeLoading_alert();
				  this.GetGeocercas();
				})
			  }
			})
	
		}else{  
		  this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un geocerca para eliminar'});
		}
	}

	BorrarToast() {
		this.messageService.clear();
	}
	GetGeocercas(){
		this.monitoreo_servicio.get_geocercas().subscribe(data=>{
			this.loading = false;
			this.lista_geocercas=JSON.parse(JSON.stringify(data)).lista_geocercas;
			console.log("ver res ",this.lista_geocercas);
		  })
	}
	SeleccionarGeocerca(lista_geocercas:GeocercaModelo){
		this.BorrarToast();
		this.geocerca_seleccionado=lista_geocercas;
		this.messageService.add({severity: 'info', summary: 'Geocerca seleccionado', detail: (this.geocerca_seleccionado.nombre_geocerca).toString() });
	}
	loading_alert(){
		Swal.fire({
		  title: 'Verificando datos',
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

}
