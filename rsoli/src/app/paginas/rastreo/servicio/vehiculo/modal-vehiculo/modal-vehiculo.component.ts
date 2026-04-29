import { Component,Input, OnInit } from '@angular/core';


import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VehiculoService } from '../vehiculo.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { VehiculoModelo } from '../vehiculo-modelo';
import Swal from'sweetalert2';
import { DepartamentoModelo } from 'src/app/paginas/parametros/departamento/departamento-modelo';

@Component({
  selector: 'app-modal-vehiculo',
  templateUrl: './modal-vehiculo.component.html',
  styleUrls: ['./modal-vehiculo.component.css']
})
export class ModalVehiculoComponent implements OnInit {

  @Input() titulo: string = "";
  form_vehiculo!: FormGroup;
  @Input() vehiculo= new VehiculoModelo();

  lista_departamento_seleccionados:DepartamentoModelo = new DepartamentoModelo();
  lista_departamento :Array<DepartamentoModelo>=[];
  filtro_departamento!: any[];

  constructor(
    public bsModalRef: BsModalRef,
    private vehiculo_servicio:VehiculoService
  ) { }

  ngOnInit(): void {
    this.IniciarFormulario();
  }
  IniciarFormulario(){
    if(this.vehiculo.id_vehiculo==0){
      this.form_vehiculo = new FormGroup({
        lista_departamento_seleccionados: new FormControl(this.lista_departamento_seleccionados, [Validators.required]),
        placa: new FormControl(this.vehiculo.placa, [Validators.required,Validators.maxLength(10)]),

        marca: new FormControl(this.vehiculo.marca, [Validators.maxLength(20)]),
        modelo: new FormControl(this.vehiculo.modelo, [Validators.maxLength(20)]),
        color: new FormControl(this.vehiculo.color, [Validators.maxLength(20)]),
        cilindrada: new FormControl(this.vehiculo.cilindrada, [Validators.maxLength(10)]),

        uniqueid: new FormControl(this.vehiculo.uniqueid, [Validators.required,Validators.maxLength(20)]),
        linea_gps: new FormControl(this.vehiculo.linea_gps, [Validators.required,Validators.maxLength(10)]),
        modelo_gps: new FormControl(this.vehiculo.modelo_gps, [Validators.required,Validators.maxLength(20)]),
        
      }); 
    }else{
       this.form_vehiculo = new FormGroup({
        lista_departamento_seleccionados: new FormControl(this.lista_departamento_seleccionados, [Validators.required]),
        placa: new FormControl(this.vehiculo.placa, [Validators.required,Validators.maxLength(10)]),

        marca: new FormControl(this.vehiculo.marca, [Validators.maxLength(20)]),
        modelo: new FormControl(this.vehiculo.modelo, [Validators.maxLength(20)]),
        color: new FormControl(this.vehiculo.color, [Validators.maxLength(20)]),
        cilindrada: new FormControl(this.vehiculo.cilindrada, [Validators.maxLength(10)]),


        uniqueid: new FormControl(this.vehiculo.uniqueid, [Validators.required,Validators.maxLength(20)]),
        linea_gps: new FormControl(this.vehiculo.linea_gps, [Validators.required,Validators.maxLength(10)]),
        modelo_gps: new FormControl(this.vehiculo.modelo_gps, [Validators.required,Validators.maxLength(20)]),
       }); 
    }
  }
  CargarValores(){
    this.loading();
    console.log("ver clientes1",this.vehiculo.id_vehiculo);
    this.vehiculo_servicio.get_vehiculo(this.vehiculo.id_vehiculo).subscribe(data=>{  
      console.log("ver vehiculo",data);
      this.close();
      this.lista_departamento = JSON.parse(JSON.stringify(data)).departamentos;
      
      if(this.vehiculo.id_vehiculo!=0){

        this.vehiculo=JSON.parse(JSON.stringify(data)).vehiculo[0];
        this.lista_departamento_seleccionados=JSON.parse(JSON.stringify(data)).departamento_seleccionado[0];
      }else{

        this.lista_departamento_seleccionados = new DepartamentoModelo();
      }
      this.IniciarFormulario();

    },
    error=>{
        this.close();
        this.error("Error","Verifique su conexion internet");
    })

  }
  GuardarVehiculo(){
    
    if(this.form_vehiculo.controls.lista_departamento_seleccionados.value.nombre_departamento==""){
      this.error("Error","El campo departamento es requerido");

    }else{
      this.loading();

      this.vehiculo.id_departamento=this.form_vehiculo.controls.lista_departamento_seleccionados.value.id_departamento;
      this.vehiculo.placa=this.form_vehiculo.controls.placa.value;

      this.vehiculo.marca=this.form_vehiculo.controls.marca.value;
      this.vehiculo.modelo=this.form_vehiculo.controls.modelo.value;
      this.vehiculo.color=this.form_vehiculo.controls.color.value;
      this.vehiculo.cilindrada=this.form_vehiculo.controls.cilindrada.value;


      this.vehiculo.uniqueid=this.form_vehiculo.controls.uniqueid.value;

      this.vehiculo.linea_gps=this.form_vehiculo.controls.linea_gps.value;
      this.vehiculo.modelo_gps=this.form_vehiculo.controls.modelo_gps.value;
      this.vehiculo.id_cliente=this.vehiculo.id_cliente;
     

      this.vehiculo_servicio.post_vehiculo(this.vehiculo).subscribe(data=>{
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
