import { Component,Input, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../cliente.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClienteModelo } from '../cliente-modelo';
import Swal from'sweetalert2';
import { PersonaModelo } from 'src/app/paginas/seguridad/persona/persona-modelo';


@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.css']
})
export class ModalClienteComponent implements OnInit {

  @Input() titulo: string = "";
  form_cliente!: FormGroup;
  @Input() cliente= new ClienteModelo();

  lista_personas_seleccionados:PersonaModelo = new PersonaModelo();
  lista_personas :Array<PersonaModelo>=[];
  filtro_personas!: any[];

  constructor(
    public bsModalRef: BsModalRef,
    private cliente_servicio:ClienteService
  ) { }

  ngOnInit(): void {
    this.IniciarFormulario();
  }
  IniciarFormulario(){
    if(this.cliente.id_cliente==0){
      this.form_cliente = new FormGroup({
        lista_personas_seleccionados: new FormControl(this.lista_personas_seleccionados, [Validators.required]),
        direccion: new FormControl(this.cliente.direccion, [Validators.required,Validators.maxLength(100)]),
      }); 
    }else{
       this.form_cliente = new FormGroup({
        lista_personas_seleccionados: new FormControl(this.lista_personas_seleccionados, [Validators.required]),
         direccion: new FormControl(this.cliente.direccion, [Validators.required,Validators.maxLength(100)]),
       }); 
    }
  }
  CargarValores(){
    this.loading();
    console.log("ver clientes1",this.cliente.id_cliente);
    this.cliente_servicio.get_cliente(this.cliente.id_cliente).subscribe(data=>{  
      console.log("ver clientes",data);
      this.close();
      this.lista_personas = JSON.parse(JSON.stringify(data)).personas;
      
      if(this.cliente.id_cliente!=0){

        this.cliente=JSON.parse(JSON.stringify(data)).cliente[0];
        this.cliente.direccion=JSON.parse(JSON.stringify(data)).cliente[0].direccion;
        this.lista_personas_seleccionados=JSON.parse(JSON.stringify(data)).persona_seleccionado[0];
      }else{

        this.cliente.direccion="";
        this.lista_personas_seleccionados = new PersonaModelo();
      }
      this.IniciarFormulario();

    },
    error=>{
        this.close();
        this.error("Error","Verifique su conexion internet");
    })

  }
  GuardarCliente(){
    
    if(this.form_cliente.controls.lista_personas_seleccionados.value.nombre==""){
      this.error("Error","El campo persona es requerido");

    }else{
      this.loading();

      console.log("ver form ",this.form_cliente.controls.direccion.value);
      
      this.cliente.id_persona=this.form_cliente.controls.lista_personas_seleccionados.value.id_persona;
      this.cliente.direccion=this.form_cliente.controls.direccion.value;
     
       this.cliente_servicio.post_cliente(this.cliente).subscribe(data=>{
         this.close();
         if(JSON.parse(JSON.stringify(data)).mensaje[0]){
           this.error('Error!!',JSON.parse(JSON.stringify(data)).mensaje[0]);
         }else{
           this.bsModalRef.hide();
         }
       },error=>{
         this.close();
         this.error("Error","Verifique su conexion a internet");
         console.log(error);
       });
       
    }
  }
  loading(){
    Swal.fire({
      title: 'Verificando datos',
      html: 'Cargando',// add html attribute if you want or remove
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading()
      },
    });
  }
  close(){
    Swal.close();
  }
  error(titulo:string,mensaje:string){
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje
    });
  }

}
