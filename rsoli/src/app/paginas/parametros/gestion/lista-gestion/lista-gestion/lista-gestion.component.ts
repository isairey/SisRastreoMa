import { Component, OnInit,ViewChild } from '@angular/core';
import { GestionModelo } from '../../gestion-modelo';
import { GestionService} from '../../gestion.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalGestionComponent } from '../../modal-gestion/modal-gestion/modal-gestion.component'; 

@Component({
  selector: 'app-lista-gestion',
  templateUrl: './lista-gestion.component.html',
  styleUrls: ['./lista-gestion.component.css'],
  providers: [MessageService]
})
export class ListaGestionComponent implements OnInit {

  lista_gestiones: Array<GestionModelo> = [];
  gestion_seleccionado = new GestionModelo();
  loading: boolean = true;
  @ViewChild('dt') table!: Table;
  public modalRef!: BsModalRef;
  sesion: boolean = false;

  constructor(
    private gestion_servicio: GestionService,
    private messageService: MessageService,
    private modalService: BsModalService
  ) { }
    

  ngOnInit(): void {
    this.GetGestiones();
    this.sesion = JSON.parse(localStorage.getItem('accesos') || '{}').sesion;
  }
  GetGestiones() {
    this.gestion_servicio.get_gestiones().subscribe(data => {
      this.loading = false;
      this.lista_gestiones = JSON.parse(JSON.stringify(data)).gestiones;
      // console.log("ver res ",this.lista_persona);
    })
  }
  SeleccionarGestion(gestion: GestionModelo) {
    this.BorrarToast();
    this.gestion_seleccionado = gestion;
    this.messageService.add({ severity: 'info', summary: 'Gestion seleccionado', detail: (this.gestion_seleccionado.nombre_gestion).toString() });
  }
  BorrarToast() {
    this.messageService.clear();
  }
}
