import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, TreeNode } from 'primeng/api';
import {MessageService} from 'primeng/api';
import{UsuarioService} from '../../paginas/seguridad/usuario/usuario.service';


import Swal from'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioModelo } from '../../paginas/seguridad/usuario/usuario-modelo';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [MessageService]
})
export class SidebarComponent implements OnInit {
  visibleSidebar1: any;

  files!: TreeNode[];
  selectedFile!: TreeNode;



  form!: FormGroup;
  visible_cerrar_sesion: boolean=false;
  visible_iniciar_sesion: boolean=false;
  persona_label:string="";
  correo_label:string="";
  usuario_modelo!:UsuarioModelo;
  usuario:any="";
  password:any="";

  constructor(
    private messageService: MessageService,
    private usuario_servicio:UsuarioService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.CargarDatosUsuario();

    this.IniciarFormulario();
  }
  IniciarFormulario(){
    this.form = new FormGroup({
      usuario: new FormControl(this.usuario, [Validators.required,Validators.maxLength(40)]),
      password: new FormControl(this.usuario, [Validators.required, Validators.maxLength(40)]),
    });
   //  console.log("ver log ",this.form.controls.usuario.errors);
 }
  nodeSelect(event: { node: { label: any,routerLink:any; }; }) {

  
    if(event.node.routerLink){
      this.router.navigate([event.node.routerLink]);  
    } 
    // this.messageService.add({severity: 'info', summary: 'Node Selected', detail: event.node.label});
  }

  nodeUnselect(event: { node: { label: any; }; }) {
      // this.messageService.add({severity: 'info', summary: 'Node Unselected', detail: event.node.label});  
  }
  AbrirSideBar(){
    if(localStorage.getItem('accesos') == undefined ){
      //this.messageService.add({severity: 'info', summary: 'Mensaje', detail: 'Iniciar sesión' });
      this.visibleSidebar1=false;
      
      this.visible_iniciar_sesion=true;
    }else{
      let menu_aux=JSON.parse(localStorage.getItem('accesos')|| '{}').accesos.original.replaceAll('expandedicon','expandedIcon');
      menu_aux=menu_aux.replaceAll('collapsedicon','collapsedIcon');
      menu_aux=menu_aux.replaceAll('items','children');
      menu_aux=menu_aux.replaceAll('ruta_menu_sidebar','routerLink');
      this.files=JSON.parse(menu_aux).children;
      this.visibleSidebar1=true;
      this.expandAll();
    } 
    
  }

  expandAll(){
    this.files.forEach( node => {
        this.expandRecursive(node, true);
    } );
  }

  collapseAll(){
      this.files.forEach( node => {
          this.expandRecursive(node, false);
      } );
  }

  private expandRecursive(node:TreeNode, isExpand:boolean){
      node.expanded = isExpand;
      if (node.children){
          node.children.forEach( childNode => {
              this.expandRecursive(childNode, isExpand);
          } );
      }
  }
  CerrarSesion(){
    this.visible_cerrar_sesion=false;
    this.loading("Cerrando Sesión");
    this.form.reset();
    this.usuario_servicio.post_cerrar_sesion().subscribe(data=>{ 
      this.closeLoading();
      localStorage.removeItem("accesos");
      this.visibleSidebar1=false;
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
  CancelarSesion(){
    this.visible_cerrar_sesion=false;
    this.visible_iniciar_sesion=false;
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

}
