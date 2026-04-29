import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { UsuarioModelo } from '../usuario-modelo';
import{UsuarioService} from '../usuario.service';
import { Router} from '@angular/router';
import Swal from'sweetalert2';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit {

  visible_cerrar_sesion: boolean=false;
  visible_iniciar_sesion: boolean=false;

  value2!: string;
  value4!: string;
  usuario_modelo!:UsuarioModelo;

  form!: FormGroup;
  usuario:any="";
  password:any="";

  persona_label:string="";
  correo_label:string="";
  
  // usuario: any= new FormControl('', [Validators.required,Validators.minLength(15)]);
  // password: any= new FormControl('', [Validators.required, Validators.minLength(15)]);

  constructor(
    private primengConfig: PrimeNGConfig,
    private usuario_servicio:UsuarioService,
    private router: Router,

    ) { }

  ngOnInit(): void {
    this.IniciarFormulario();
    this.CargarDatosUsuario();
    this.primengConfig.ripple = true;
  }
  CargarDatosUsuario(){
    if(localStorage.getItem('accesos')!=undefined){
      this.persona_label=JSON.parse(localStorage.getItem('accesos')|| '{}').usuario.persona;
      this.correo_label=JSON.parse(localStorage.getItem('accesos')|| '{}').usuario.correo;
    }
    else{
      this.persona_label="";
      this.correo_label="";
    }
  }
  IniciarFormulario(){
     this.form = new FormGroup({
       usuario: new FormControl(this.usuario, [Validators.required,Validators.maxLength(40)]),
       password: new FormControl(this.usuario, [Validators.required, Validators.maxLength(40)]),
     });
    //  console.log("ver log ",this.form.controls.usuario.errors);
  }
  IniciarSesion(){
    this.visible_iniciar_sesion=false;
    this.loading("Iniciando Sesión");

    let nuevo_usuario = new UsuarioModelo;
    nuevo_usuario.email=this.form.value.usuario.trim();
    nuevo_usuario.password=this.form.value.password.trim();
   
    this.usuario_servicio.post_iniciar_sesion(nuevo_usuario).subscribe(data=>{
        this.closeLoading();
        localStorage.removeItem("accesos");
        localStorage.setItem('accesos', JSON.stringify(data)); 
        this.persona_label=JSON.parse(localStorage.getItem('accesos')|| '{}').usuario.persona;
        this.correo_label=JSON.parse(localStorage.getItem('accesos')|| '{}').usuario.correo;
        this.router.navigate(['/seguridad/lista_usuario']); 
      },
      error=>{
          
          this.closeLoading();
          try {
          this.error("Error","Usuario o contraseña incorrecto");   
          } 
          catch (error) {
            this.error("Error","Contactese con el administrador");
          } 
      })

  }
  CerrarSesion(){
    this.visible_cerrar_sesion=false;
    this.loading("Cerrando Sesión");
    this.form.reset();
    this.usuario_servicio.post_cerrar_sesion().subscribe(data=>{ 
      this.closeLoading();
      localStorage.removeItem("accesos");
      this.router.navigate(['/shared/slider']);   
    },
    error=>{
      console.log("ver error ",error);
      this.visible_cerrar_sesion=false;
      this.closeLoading();
      localStorage.removeItem("accesos");
      this.router.navigate(['/shared/slider']);   
    })


  }
  CargarFormulario(){

    if(localStorage.getItem('accesos') == undefined ){
      this.visible_iniciar_sesion=true;
    }else{
      this.visible_cerrar_sesion=true;
    }

  }
  CancelarSesion(){
    this.visible_cerrar_sesion=false;
    this.visible_iniciar_sesion=false;
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
        this.visible_iniciar_sesion=true;
      }
    });
  }



}
