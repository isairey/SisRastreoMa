import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UsuarioModelo } from '../usuario-modelo';
import Swal from'sweetalert2';
import { RolModelo } from '../../rol/rol-modelo';
import { PersonaModelo } from '../../persona/persona-modelo';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  @Input() titulo: string = "";
  form_usuario!: FormGroup;
  @Input() usuario= new UsuarioModelo();
  

  lista_roles :Array<RolModelo>=[];
  lista_roles_seleccionados: string[] = [];

  lista_personas_seleccionados:PersonaModelo = new PersonaModelo();
  lista_personas :Array<PersonaModelo>=[];
  filtro_personas!: any[];

  sesion:boolean=false;


  constructor(
    public bsModalRef: BsModalRef,
    private usuario_servicio:UsuarioService
  ) { }

  ngOnInit(): void {
    this.sesion=JSON.parse(localStorage.getItem('accesos')|| '{}').sesion;
    this.IniciarFormulario();
  }

  IniciarFormulario(){
    if(this.usuario.id_usuario==0){
      this.form_usuario = new FormGroup({
        usuario: new FormControl(this.usuario.usuario, [Validators.required,Validators.maxLength(20)]),
        contrasena: new FormControl(this.usuario.password, [Validators.required,Validators.minLength(8),Validators.maxLength(50)]),
        repetir_contrasena: new FormControl('', [Validators.required,Validators.minLength(8),Validators.maxLength(50)]),
        email: new FormControl(this.usuario.email, [Validators.required,Validators.maxLength(50),Validators.email]),
        lista_personas_seleccionados: new FormControl(this.lista_personas_seleccionados, [Validators.required]),
        lista_roles_seleccionados: new FormControl(this.lista_roles_seleccionados, [Validators.required]),
      }); 
    }else{
      this.form_usuario = new FormGroup({
        usuario: new FormControl(this.usuario.usuario, [Validators.required,Validators.maxLength(20)]),
        contrasena: new FormControl('', [Validators.maxLength(50)]),
        repetir_contrasena: new FormControl('', [Validators.maxLength(50)]),
        email: new FormControl(this.usuario.email, [Validators.required,Validators.maxLength(50),Validators.email]),
        lista_personas_seleccionados: new FormControl(this.lista_personas_seleccionados, [Validators.required]),
        lista_roles_seleccionados: new FormControl(this.lista_roles_seleccionados, [Validators.required]),
      }); 
    }

  }
  CargarValores(){
    this.loading();
    this.usuario_servicio.get_usuario(this.usuario.id_usuario).subscribe(data=>{  
      this.close();
      this.lista_personas = JSON.parse(JSON.stringify(data)).personas;
      this.lista_roles=JSON.parse(JSON.stringify(data)).roles;

      if(this.usuario.id_usuario!=0){

        this.usuario=JSON.parse(JSON.stringify(data)).usuario[0];
        this.usuario.email=JSON.parse(JSON.stringify(data)).usuario[0].correo;//se setear solo email por que no conicide con el modelo creado
        this.lista_roles_seleccionados=JSON.parse(JSON.stringify(data)).usuario_rol;
        this.lista_personas_seleccionados=JSON.parse(JSON.stringify(data)).usuario_persona[0];
      }else{

        this.usuario.email="";
        this.lista_personas_seleccionados = new PersonaModelo();
        this.lista_roles_seleccionados= [];
      }
      this.IniciarFormulario();
    },
    error=>{
        this.close();
        this.error("Error","Verifique su conexion internet");
    })
  }
  GuardarUsuario(){
    if(this.form_usuario.controls.contrasena.value!=""||this.form_usuario.controls.repetir_contrasena.value!=""){
      if( this.form_usuario.controls.contrasena.value!=this.form_usuario.controls.repetir_contrasena.value){
        this.error("Error","Los campos de contrasenas no coinciden");
        console.log(this.form_usuario.controls.contrasena.value+' - '+this.form_usuario.controls.repetir_contrasena.value);
      }
      else{
        this.loading();
        
        this.usuario.usuario=this.form_usuario.controls.usuario.value;
        this.usuario.contrasena=this.form_usuario.controls.contrasena.value;
        this.usuario.correo=this.form_usuario.controls.email.value;
        this.usuario.id_persona=this.form_usuario.controls.lista_personas_seleccionados.value.id_persona;
        this.usuario.id_roles=this.form_usuario.controls.lista_roles_seleccionados.value;
      
         this.usuario_servicio.post_usuario(this.usuario).subscribe(data=>{
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
    }else{
      this.loading();
      
      this.usuario.usuario=this.form_usuario.controls.usuario.value;
      this.usuario.contrasena=this.form_usuario.controls.contrasena.value;
      this.usuario.correo=this.form_usuario.controls.email.value;
      this.usuario.id_persona=this.form_usuario.controls.lista_personas_seleccionados.value.id_persona;
      this.usuario.id_roles=this.form_usuario.controls.lista_roles_seleccionados.value;
    
       this.usuario_servicio.post_usuario(this.usuario).subscribe(data=>{
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
