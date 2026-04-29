import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DepartamentoModelo } from '../departamento-modelo';
import { DepartamentoService } from '../departamento.service';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDepartamentoComponent } from '../modal-departamento/modal-departamento.component';
import { PersonaModelo } from 'src/app/paginas/seguridad/persona/persona-modelo';

@Component({
  selector: 'app-lista-departamento',
  templateUrl: './lista-departamento.component.html',
  styleUrls: ['./lista-departamento.component.css'],
  providers: [MessageService]
})
export class ListaDepartamentoComponent implements OnInit {

  lista_departamentos: Array<DepartamentoModelo> = [];
  departamento_seleccionado = new DepartamentoModelo();
  loading: boolean = true;
  @ViewChild('dt') table!: Table;
  public modalRef!: BsModalRef;
  sesion: boolean = false;

  constructor(
    private departamento_servicio: DepartamentoService,
    private messageService: MessageService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    //se carga al principio
    this.GetDepartamentos();
    //
    this.sesion = JSON.parse(localStorage.getItem('accesos') || '{}').sesion; 
  }
  GetDepartamentos() {
    this.departamento_servicio.get_departamentos().subscribe(data => {
      this.loading = false;
      this.lista_departamentos = JSON.parse(JSON.stringify(data)).departamentos;
      console.log("ver res ", this.lista_departamentos);
    });
  }
  FormularioDepartamento(bandera: number) {
    this.BorrarToast();
    if (bandera == 0) {
      let nuevo_departamento = new DepartamentoModelo();
      this.modalRef = this.modalService.show(ModalDepartamentoComponent);
      this.modalRef.content.titulo = "Nuevo departamento";
      this.modalRef.content.departamento = nuevo_departamento;

      this.modalRef.onHide?.subscribe((reasor: string | any) => {
        this.GetDepartamentos();
      });
    }
    else {
      if (this.departamento_seleccionado.id_departamento == 0) {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'Seleccione un departamento para editar' });
      } else {
        this.modalRef = this.modalService.show(ModalDepartamentoComponent);
        this.modalRef.content.titulo = "Editar departamento";
        this.modalRef.content.departamento = this.departamento_seleccionado;
        this.modalRef.content.IniciarFormulario();
        this.modalRef.onHide?.subscribe((reasor: string | any) => {
          this.GetDepartamentos();
        });
      }
    }
  }
  EliminarDepartamento() {
    this.BorrarToast();
    if (this.departamento_seleccionado.id_departamento) {

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
          this.departamento_servicio.eliminar_departamento(this.departamento_seleccionado.id_departamento).subscribe(data => {
            this.closeLoading_alert();
            this.GetDepartamentos();
          })
        }
      })

    } else {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'Seleccione un departamento para eliminar' });
    }
  }
  seleccionarDepartamento(departamento: DepartamentoModelo) {
    this.BorrarToast();
    this.departamento_seleccionado = departamento;
    this.messageService.add({ severity: 'info', summary: 'Departamento seleccionado', detail: (this.departamento_seleccionado.nombre_departamento).toString() });
  }
  BorrarToast() {
    this.messageService.clear();
  }
  loading_alert(titulo: string) {

    Swal.fire({
      title: titulo,
      html: 'Cargando',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    });
  }
  closeLoading_alert() {
    Swal.close();
  }
}
