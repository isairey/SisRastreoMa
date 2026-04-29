import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartamentoService } from '../departamento.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DepartamentoModelo } from '../departamento-modelo';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-departamento',
  templateUrl: './modal-departamento.component.html',
  styleUrls: ['./modal-departamento.component.css'],
  providers: [MessageService]
})
export class ModalDepartamentoComponent implements OnInit {

  @Input() titulo: string = "";
  form_departamento!: FormGroup;
  @Input() departamento = new DepartamentoModelo();

  constructor(
    public bsModalRef: BsModalRef,
    private departamento_servicio: DepartamentoService
  ) { }

  ngOnInit(): void {
    this.IniciarFormulario();
  }

  IniciarFormulario() {

    this.form_departamento = new FormGroup({
      nombre_departamento: new FormControl(this.departamento.nombre_departamento, [Validators.required, Validators.maxLength(20)]),
    });
  }
  GuardarDepartamento() {
    this.loading("Guardando datos");
    console.log(this.departamento.nombre_departamento)
    let nuevo_departamento = this.departamento;
    nuevo_departamento.nombre_departamento = this.form_departamento.value.nombre_departamento.trim();

    nuevo_departamento.id_departamento = this.departamento.id_departamento;

    this.departamento_servicio.post_departamentos(nuevo_departamento).subscribe(data => {
      this.closeLoading();
      if (JSON.parse(JSON.stringify(data)).mensaje[0]) {
        this.error('Error!!', JSON.parse(JSON.stringify(data)).mensaje[0]);
      } else {
        this.bsModalRef.hide();
      }
    }, error => {
      this.closeLoading();
      this.error("Error", "Verifique su conexion a internet");
      console.log(error);
    });
  }
  loading(titulo: string) {

    Swal.fire({
      title: titulo,
      html: 'Cargando',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    });

  }
  closeLoading() {
    Swal.close();
  }
  error(titulo: string, mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
      didClose: () => {

      }
    });
  }
}
