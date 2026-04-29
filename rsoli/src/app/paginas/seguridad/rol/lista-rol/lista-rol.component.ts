import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { RolModelo } from '../rol-modelo';
import { RolService } from '../rol.service';
import {ModalRolComponent} from '../modal-rol/modal-rol.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from'sweetalert2';

@Component({
  selector: 'app-lista-rol',
  templateUrl: './lista-rol.component.html',
  styleUrls: ['./lista-rol.component.css'],
  providers: [MessageService]
})
export class ListaRolComponent implements OnInit {

  lista_roles :Array<RolModelo>=[];
  loading: boolean = true;
  @ViewChild('dt') table!: Table;
  sesion:boolean=false;
  rol_seleccionado=new RolModelo();
  public modalRef!: BsModalRef;

  constructor(
    private rol_servicio:RolService,
    private messageService: MessageService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.GetRoles();
    this.sesion=JSON.parse(localStorage.getItem('accesos')|| '{}').sesion;
  }
  GetRoles() {
    this.rol_servicio.get_roles().subscribe(data=>{
      this.loading = false;
      this.lista_roles=JSON.parse(JSON.stringify(data)).roles;
      // console.log("ver res ",this.lista_persona);
    })
  }
  FormularioRol(id:number){
    this.BorrarToast();

    if(id==0){
      let nuevo_persona =new RolModelo();
      this.modalRef = this.modalService.show(ModalRolComponent);
      this.modalRef.content.titulo="Nuevo rol";
      this.modalRef.content.persona=nuevo_persona;
  
      this.modalRef.onHide?.subscribe((reasor: string|any)=>{
        this.GetRoles();
      });
    }else{
      if(this.rol_seleccionado.id_rol==0){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un rol para editar'});
      }else{
        this.modalRef = this.modalService.show(ModalRolComponent);
        this.modalRef.content.titulo="Editar rol";
        this.modalRef.content.rol=this.rol_seleccionado;
        this.modalRef.content.IniciarFormulario();
        this.modalRef.content.CargarPermisos();
        
        
        this.modalRef.onHide?.subscribe((reasor: string|any)=>{
          this.GetRoles();
        });
      }

    }

  }
  EliminarPersona(){
    this.BorrarToast();
    if(this.rol_seleccionado.id_rol){

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
            this.rol_servicio.eliminar_rol(this.rol_seleccionado.id_rol).subscribe(data=>{
              this.closeLoading_alert();
              this.GetRoles();
            })
          }
        })

    }else{  
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione una persona para eliminar'});
    }
  }
  SeleccionarRol(rol:RolModelo){
    this.BorrarToast();
    this.rol_seleccionado=rol;
    this.messageService.add({severity: 'info', summary: 'Rol seleccionado', detail: (this.rol_seleccionado.nombre_rol).toString() });
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
