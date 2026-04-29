import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { ClienteModelo } from '../cliente-modelo';
import { ClienteService } from '../cliente.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ModalClienteComponent} from '../modal-cliente/modal-cliente.component';
import { Router} from '@angular/router';

@Component({
  selector: 'app-lista-cliente',
  templateUrl: './lista-cliente.component.html',
  styleUrls: ['./lista-cliente.component.css'],
  providers: [MessageService]
})
export class ListaClienteComponent implements OnInit {

  lista_clientes :Array<ClienteModelo>=[];

  loading: boolean = true;
  @ViewChild('dt') table!: Table;
  sesion:boolean=false;
  cliente_seleccionado=new ClienteModelo();
  public modalRef!: BsModalRef;
  constructor(
    private cliente_servicio:ClienteService,
    private messageService: MessageService,
    private modalService: BsModalService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.GetClientes();
  }
  GetClientes() {
    this.cliente_servicio.get_clientes().subscribe(data=>{
      this.loading = false;
      this.lista_clientes=JSON.parse(JSON.stringify(data)).cliente;
       console.log("ver res ",this.lista_clientes);
    })
  }
  FormularioCliente(bandera:number){
    this.BorrarToast();
    if(bandera==0){
      let nuevo_cliente =new ClienteModelo();
      this.modalRef = this.modalService.show(ModalClienteComponent);
      this.modalRef.content.titulo="Nuevo cliente";
      this.modalRef.content.persona=nuevo_cliente;
      this.modalRef.content.CargarValores();
      this.modalRef.content.IniciarFormulario();
      this.modalRef.onHide?.subscribe((reasor: string|any)=>{
        this.GetClientes();
      });
    }
    else{
      if(this.cliente_seleccionado.id_cliente==0){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione una persona para editar'});
      }else{
        
        this.modalRef = this.modalService.show(ModalClienteComponent);
        this.modalRef.content.titulo="Editar cliente";  
        this.modalRef.content.cliente=this.cliente_seleccionado;
        this.modalRef.content.CargarValores();
        this.modalRef.content.IniciarFormulario();
        this.modalRef.onHide?.subscribe((reasor: string|any)=>{
          this.GetClientes();
        });
      }
    }
  }
  EliminarCliente(){
    this.BorrarToast();
    if(this.cliente_seleccionado.id_persona){

        Swal.fire({
          title: '¿Esta segur@?',
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
            this.cliente_servicio.eliminar_cliente(this.cliente_seleccionado.id_cliente).subscribe(data=>{
              this.closeLoading_alert();
              this.GetClientes();
            })
          }
        })

    }else{  
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un cliente para eliminar'});
    }
  }
  SeleccionarCliente(cliente:ClienteModelo){
    this.BorrarToast();
    this.cliente_seleccionado=cliente;
    this.messageService.add({severity: 'info', summary: 'Cliente seleccionado', detail: (this.cliente_seleccionado.nombre).toString()+" "+(this.cliente_seleccionado.apellido_paterno).toString() });
  }
  ListaVehiculo(){
    if(this.cliente_seleccionado.id_cliente==0){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un cliente para ver sus vehículos'});
    }else{
      this.router.navigate(['/rastreo/lista_vehiculo',this.cliente_seleccionado.id_cliente]); 
    }
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
