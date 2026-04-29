import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RolService } from '../rol.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RolModelo } from '../rol-modelo';
import Swal from 'sweetalert2';
import { TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-modal-rol',
  templateUrl: './modal-rol.component.html',
  styleUrls: ['./modal-rol.component.css'],
  providers: [MessageService]
})
export class ModalRolComponent implements OnInit {

  @Input() titulo: string = "";
  form_rol!: FormGroup;
  @Input() rol = new RolModelo();

  files3!: TreeNode[];
  selectedFiles2: TreeNode | undefined;

  constructor(
    public bsModalRef: BsModalRef,
    private rol_servicio: RolService
  ) { }

  ngOnInit(): void {

    this.IniciarFormulario();
    this.CargarPermisos();

  }
  CargarPermisos() {
    this.loading();
    this.rol_servicio.get_permisos(this.rol.id_rol).subscribe(data => {
      this.close();
      // this.lista_roles=JSON.parse(JSON.stringify(data)).roles;
      let menu_aux = JSON.parse(JSON.stringify(data)).menu.original.replaceAll('expandedicon', 'expandedIcon');
      menu_aux = menu_aux.replaceAll('collapsedicon', 'collapsedIcon');
      menu_aux = menu_aux.replaceAll('items', 'children');
      menu_aux = menu_aux.replaceAll('ruta_menu_sidebar', 'routerLink');
      this.files3 = [JSON.parse(menu_aux)];
      this.selectedFiles2 = JSON.parse(JSON.stringify(data)).permisos.original;
      // console.log("ver res ",JSON.parse(JSON.stringify(data)).permisos.original);
    })
  }
  IniciarFormulario() {
    this.form_rol = new FormGroup({
      nombre_rol: new FormControl(this.rol.nombre_rol, [Validators.required, Validators.maxLength(20)])
    });
  }
  GuardarRol() {
    this.loading();

    let nuevo_rol = new RolModelo();
    this.rol.id_arbol = this.nodos_seleccionados(this.selectedFiles2);
    nuevo_rol = this.rol;
    this.rol.nombre_rol = this.form_rol.value.nombre_rol.trim();

    this.EnviarRol();

  }
  EnviarRol() {
    this.rol_servicio.post_rol(this.rol).subscribe(data => {
      this.close();

      // if(data.mensaje.length==0){
      if (JSON.parse(JSON.stringify(data)).mensaje.length == 0) {

        this.bsModalRef.hide();
        this.success();
      } else {
        this.error("Error", JSON.parse(JSON.stringify(data)).mensaje[0]);
      }

    },
      error => {
        this.close();
        console.log("ver error ", error);
      })
  }
  nodos_seleccionados(node: any) {
    var nueva_lista_permisos = new Array();
    // console.log("ver rol selected ",this.selectedFiles2);
    for (var numero in node) {
      nueva_lista_permisos.push(node[numero].key);
      if (node[numero].parent) {
        this.escalar_tree(node[numero].parent, nueva_lista_permisos);
      }
    }
    return this.quitar_duplicados(nueva_lista_permisos).toString();
  }
  escalar_tree(array: any, nueva_lista_permisos: any) {
    nueva_lista_permisos.push(array.key);
    if (array.parent) {
      this.escalar_tree(array.parent, nueva_lista_permisos);
    }
  }
  quitar_duplicados(nueva_lista_permisos: any) {
    let valoresUnico = nueva_lista_permisos.filter(
      (value: any, pos: any, self: string | any[]) => {
        return pos === self.indexOf(value);
      }
    );
    return valoresUnico;
  }
  error(titulo: string, mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje
    });
  }
  success() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Exito',
      showConfirmButton: false,
      timer: 1500
    });
  }
  loading() {
    Swal.fire({
      title: 'Verificando datos',
      html: 'Cargando',// add html attribute if you want or remove
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    });

  }
  close() {
    Swal.close();
  }



}
