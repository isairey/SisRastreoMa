import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeocercaModelo } from '../geocerca-model';
import Swal from'sweetalert2';
import { MonitoreoService } from '../monitoreo.service';

@Component({
  selector: 'app-modal-geocerca',
  templateUrl: './modal-geocerca.component.html',
  styleUrls: ['./modal-geocerca.component.css']
})
export class ModalGeocercaComponent implements OnInit {

  @Input() titulo: string = "";
  form_geocerca!: FormGroup;
  @Input() geocerca = new GeocercaModelo();

  constructor(
    public bsModalRef: BsModalRef,
    private monitoreo_servicio: MonitoreoService
  ) { }

  ngOnInit(): void {
    this.IniciarFormulario();
  }
  IniciarFormulario() {
    this.form_geocerca = new FormGroup({
      nombre_geocerca: new FormControl(this.geocerca.nombre_geocerca, [Validators.required, Validators.maxLength(50)]),
      descripcion: new FormControl(this.geocerca.descripcion, [Validators.maxLength(100)])
    });
  }
  GuardarGeocerca() {
    this.loading();
        
    this.geocerca.nombre_geocerca=this.form_geocerca.controls.nombre_geocerca.value;
    this.geocerca.descripcion=this.form_geocerca.controls.descripcion.value;

    if(!this.geocerca.nombre_geocerca){
      this.error("Error","Los campos de contrasenas no coinciden");
    }
    else{
      this.monitoreo_servicio.post_geocerca(this.geocerca).subscribe(data=>{
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
