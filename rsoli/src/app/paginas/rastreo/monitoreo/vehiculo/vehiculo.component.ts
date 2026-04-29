import { Component, OnInit } from '@angular/core';
import { VehiculoModelo } from '../../servicio/vehiculo/vehiculo-modelo';
import { VehiculoService } from '../../servicio/vehiculo/vehiculo.service';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { Router} from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { VehiculoGeocercaComponent} from '../vehiculo-geocerca/vehiculo-geocerca.component';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.css'],
  providers: [MessageService]
})
export class VehiculoComponent implements OnInit {

  loading: boolean = true;
  lista_vehiculos :Array<VehiculoModelo>=[];
  vehiculo_seleccionado=new VehiculoModelo();

  public modalRef!: BsModalRef;

  constructor(
    private monitoreo_servicio:VehiculoService,
    private router: Router,
    private messageService: MessageService,
	private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.GetVehiculoss();
  }
  GetVehiculoss(){
		this.monitoreo_servicio.get_vehiculos_usuario().subscribe(data=>{
			this.loading = false;
			this.lista_vehiculos=JSON.parse(JSON.stringify(data)).vehiculo;
			console.log("ver res ",	this.lista_vehiculos);
		  })
  }
	SeleccionarGeocerca(lista_vehiculos:VehiculoModelo){
		this.BorrarToast();
		this.vehiculo_seleccionado=lista_vehiculos;
		this.messageService.add({severity: 'info', summary: 'Vehículo seleccionado', detail: (this.vehiculo_seleccionado.placa).toString() });
	}
	FormularioGeocerca(){

		this.BorrarToast();
		if(this.vehiculo_seleccionado.id_vehiculo!=0){
			this.modalRef = this.modalService.show(VehiculoGeocercaComponent);
			this.modalRef.content.titulo="Geocerca";
			// this.modalRef.content.persona=nuevo_persona;
			this.modalRef.content.set_valores_iniciales(this.vehiculo_seleccionado.id_vehiculo);
			this.modalRef.onHide?.subscribe((reasor: string|any)=>{
			   this.GetVehiculoss();
			 });
		}else{
			this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un vehículo'});
		}

	}
	EliminarVehiculo(){
		this.BorrarToast();
		/*if(this.vehiculo_seleccionado.id_vehiculo){
	
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
				this.monitoreo_servicio.eliminar_geocerca(this.vehiculo_seleccionado.id).subscribe(data=>{
				  this.closeLoading_alert();
				  this.GetVehiculoss();
				})
			  }
			})
	
		}else{  
		  this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un geocerca para eliminar'});
		}*/
	}
	BorrarToast() {
		this.messageService.clear();
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
