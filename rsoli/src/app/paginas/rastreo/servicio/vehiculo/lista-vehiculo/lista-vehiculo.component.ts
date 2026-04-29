import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { VehiculoModelo } from '../vehiculo-modelo';
import { VehiculoService } from '../vehiculo.service';
import { MessageService } from 'primeng/api';
import { Router} from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ModalVehiculoComponent} from '../modal-vehiculo/modal-vehiculo.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-vehiculo',
  templateUrl: './lista-vehiculo.component.html',
  styleUrls: ['./lista-vehiculo.component.css'],
  providers: [MessageService]
})
export class ListaVehiculoComponent implements OnInit {

  lista_vehiculos :Array<VehiculoModelo>=[];
  loading: boolean = true;
  @ViewChild('dt') table!: Table;
  id_cliente :number =0;
  vehiculo_seleccionado=new VehiculoModelo();
  public modalRef!: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private vehiculo_servicio:VehiculoService,
    private router: Router,
    private messageService: MessageService,
    private modalService: BsModalService,
    ) { }

  ngOnInit(): void {
    this.id_cliente = Number(this.route.snapshot.paramMap.get("id"));
    this.GetVehiculos();
    console.log("ver id_cliente ",this.id_cliente);

  }
  GetVehiculos() {
    this.vehiculo_servicio.get_vehiculos(this.id_cliente).subscribe(data=>{
      this.loading = false;
      this.lista_vehiculos=JSON.parse(JSON.stringify(data)).vehiculo;
       console.log("ver res ",this.lista_vehiculos);
    })
  }
  FormularioVehiculo(bandera:number){
    this.BorrarToast();
    if(bandera==0){
      let nuevo_vehiculo =new VehiculoModelo();
      nuevo_vehiculo.id_cliente=this.id_cliente;
      this.modalRef = this.modalService.show(ModalVehiculoComponent);
      this.modalRef.content.titulo="Nuevo vehiculo";
      this.modalRef.content.vehiculo=nuevo_vehiculo;
      this.modalRef.content.CargarValores();
      this.modalRef.content.IniciarFormulario();
      this.modalRef.onHide?.subscribe((reasor: string|any)=>{
        this.GetVehiculos();
      });
    }
    else{
      if(this.vehiculo_seleccionado.id_vehiculo==0){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un vehículo para editar'});
      }else{
        
        this.modalRef = this.modalService.show(ModalVehiculoComponent);
        this.modalRef.content.titulo="Editar vehículo";  
        this.modalRef.content.vehiculo=this.vehiculo_seleccionado;
        this.modalRef.content.CargarValores();
        this.modalRef.content.IniciarFormulario();
        this.modalRef.onHide?.subscribe((reasor: string|any)=>{
          this.GetVehiculos();
        });
      }
    }
  }
  EliminarVehiculo(){
    this.BorrarToast();
    if(this.vehiculo_seleccionado.id_vehiculo){

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
            this.vehiculo_servicio.eliminar_vehiculo(this.vehiculo_seleccionado.id_vehiculo).subscribe(data=>{
              this.closeLoading_alert();
              this.GetVehiculos();
            })
          }
        })

    }else{  
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un vehículo para eliminar'});
    }
  }
  SeleccionarVehiculo(vehiculo:VehiculoModelo){
    this.BorrarToast();
    this.vehiculo_seleccionado=vehiculo;
    this.messageService.add({severity: 'info', summary: 'Vehículo seleccionado', detail: (this.vehiculo_seleccionado.placa).toString()});

  }
  BorrarToast() {
    this.messageService.clear();
  }
  Volver(){
    this.router.navigate(['/rastreo/lista_cliente']); 
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
