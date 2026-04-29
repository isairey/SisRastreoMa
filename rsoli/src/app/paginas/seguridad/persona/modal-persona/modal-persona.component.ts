import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../persona.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PersonaModelo } from '../persona-modelo';
import Swal from'sweetalert2';

@Component({
  selector: 'app-modal-persona',
  templateUrl: './modal-persona.component.html',
  styleUrls: ['./modal-persona.component.css']
})
export class ModalPersonaComponent implements OnInit {

  @Input() titulo: string = "";
  form_persona!: FormGroup;
  @Input() persona= new PersonaModelo();

  constructor(
    public bsModalRef: BsModalRef,
    private persona_servicio:PersonaService
    ) { }

  ngOnInit(): void { 
    this.IniciarFormulario();
  }

  IniciarFormulario(){
    this.form_persona = new FormGroup({
      nombre: new FormControl(this.persona.nombre, [Validators.required,Validators.maxLength(20)]),
      apellido_paterno: new FormControl(this.persona.apellido_paterno, [Validators.required, Validators.maxLength(20)]),
      apellido_materno: new FormControl(this.persona.apellido_materno, [Validators.required, Validators.maxLength(20)]),
      celular: new FormControl(this.persona.celular, [Validators.required,Validators.minLength(8), Validators.maxLength(8),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      telefono: new FormControl(this.persona.telefono, [ Validators.maxLength(10),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      ci: new FormControl(this.persona.ci, [Validators.required, Validators.maxLength(15)])
    });
  }
  GuardarPersona(){
    this.loading("Guardando datos");
    let nuevo_persona=new PersonaModelo();
    nuevo_persona.nombre=this.form_persona.value.nombre.trim();
    nuevo_persona.apellido_paterno=this.form_persona.value.apellido_paterno.trim();
    nuevo_persona.apellido_materno=this.form_persona.value.apellido_materno.trim();
    nuevo_persona.ci=this.form_persona.value.ci.trim();
    nuevo_persona.celular=this.form_persona.value.celular.trim();
    nuevo_persona.telefono=this.form_persona.value.telefono;
    nuevo_persona.id_persona=this.persona.id_persona;
    
    this.persona_servicio.post_personas(nuevo_persona).subscribe(data=>{
      this.closeLoading();
      if(JSON.parse(JSON.stringify(data)).mensaje[0]){
        this.error('Error!!',JSON.parse(JSON.stringify(data)).mensaje[0]);
      }else{
        this.bsModalRef.hide();
      }
    },error=>{
      this.closeLoading();
      this.error("Error","Verifique su conexion a internet");
      console.log(error);
    });
  }
  loading(titulo:string){

    Swal.fire({
      title: titulo,
      html: 'Cargando',
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading()
      },
    }); 

  }
  closeLoading(){
    Swal.close();
  }
  error(titulo:string,mensaje:string){
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
      didClose:() =>{
        
      }
    });
  }
}
