import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonaModelo } from '../persona-modelo';
import { PersonaService } from '../persona.service';
import { Table } from 'primeng/table';
import {MessageService} from 'primeng/api';
import Swal from'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ModalPersonaComponent} from '../modal-persona/modal-persona.component';


@Component({
  selector: 'app-lista-persona',
  templateUrl: './lista-persona.component.html',
  styleUrls: ['./lista-persona.component.css'],
  providers: [MessageService]
})
export class ListaPersonaComponent implements OnInit {

  lista_personas :Array<PersonaModelo>=[];
  persona_seleccionado=new PersonaModelo();
  loading: boolean = true;
  @ViewChild('dt') table!: Table;
  public modalRef!: BsModalRef;
  sesion:boolean=false;

  constructor(
    private persona_servicio:PersonaService,
    private messageService: MessageService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.GetPersonas();
    this.sesion=JSON.parse(localStorage.getItem('accesos')|| '{}').sesion;
  }
  GetPersonas() {
    this.persona_servicio.get_personas().subscribe(data=>{
      this.loading = false;
      this.lista_personas=JSON.parse(JSON.stringify(data)).personas;
      // console.log("ver res ",this.lista_persona);
    })
  }
  FormularioPersona(bandera:number){
    this.BorrarToast();
    if(bandera==0){
      let nuevo_persona =new PersonaModelo();
      this.modalRef = this.modalService.show(ModalPersonaComponent);
      this.modalRef.content.titulo="Nuevo persona";
      this.modalRef.content.persona=nuevo_persona;

      this.modalRef.onHide?.subscribe((reasor: string|any)=>{
        this.GetPersonas();
      });
    }
    else{
      if(this.persona_seleccionado.id_persona==0){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione una persona para editar'});
      }else{
        this.modalRef = this.modalService.show(ModalPersonaComponent);
        this.modalRef.content.titulo="Editar persona";  
        this.modalRef.content.persona=this.persona_seleccionado;
        this.modalRef.content.IniciarFormulario();
        this.modalRef.onHide?.subscribe((reasor: string|any)=>{
          this.GetPersonas();
        });
      }
    }
  }
  EliminarPersona(){
    this.BorrarToast();
    if(this.persona_seleccionado.id_persona){

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
            this.loading_alert("Eliminando");
            this.persona_servicio.eliminar_personas(this.persona_seleccionado.id_persona).subscribe(data=>{
              this.closeLoading_alert();
              this.GetPersonas();
            })
          }
        })

    }else{  
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione una personna para eliminar'});
    }
  }
  SeleccionarPersona(usuario: PersonaModelo){
    this.BorrarToast();
    this.persona_seleccionado=usuario;
    this.messageService.add({severity: 'info', summary: 'Persona seleccionado', detail: (this.persona_seleccionado.nombre).toString()+' '+(this.persona_seleccionado.apellido_paterno).toString()+' '+(this.persona_seleccionado.apellido_materno).toString() });
  }
  BorrarToast() {
    this.messageService.clear();
  }
  loading_alert(titulo:string){

    Swal.fire({
      title: titulo,
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
