import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { MonitoreoService } from '../monitoreo.service';
import Swal from'sweetalert2';
import { formatDate } from '@angular/common';




@Component({
  selector: 'app-monitoreo-vehiculo',
  templateUrl: './monitoreo-vehiculo.component.html',
  styleUrls: ['./monitoreo-vehiculo.component.css'],
  providers: [MessageService]
})
export class MonitoreoVehiculoComponent implements OnInit {
  private map: any;
  marker: any;
  lista_marcadores:any;
  polylines:any;

  tiles: any;
  vehiculo!: any[];
  vehiculo_seleccionado = [];

  tipo_monitoreo_seleccionado!: any;
  tipo_monitoreo!: any[];

  fecha_ratreo: Date=new Date();
  hora_inicio=new Date('2023-10-06 01:00:00');
  hora_fin=new Date('2023-10-06 23:59:59');

  bandera_tipo_monitoreo:boolean=false;

  bandera_timer:boolean=false;
  id_interval:any;
  limite_seleccion_vehiculos:number=1;
  contador_zoom_mapa:number=0;

  visibleSidebar1: any;

  //boton input mapa search


  constructor(
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private monitoreo_servicio:MonitoreoService,
  ) { }

  ngOnInit() {
    this.initMap();
    this.cargarTipoMonitoreo();
    this.primengConfig.ripple = true;
    this.IniciarFiltros();
  }
  IniciarFiltros(){
    this.loading_alert();
    this.monitoreo_servicio.get_filtros_monitoreo().subscribe(data=>{
      this.closeLoading_alert();
      this.vehiculo=JSON.parse(JSON.stringify(data)).lista_vehiculo;
    },
    error=>{
      this.closeLoading_alert();
    })
  }

  cargarTipoMonitoreo() {
    this.tipo_monitoreo = [
      { nombre: 'Tiempo real', code: 'tiempo_real' },
      { nombre: 'Rutas', code: 'rutas' },
    ];
  }
  initMap() {

        var  osm, controlCapas;

        this.map = L.map('map1', {
          center: [-16.6574403011881, -64.95190911770706],
          zoom: 6
        });
        osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            minZoom: 1,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright"/>OpenStreetMap</a>'
        }).addTo(this.map);

        var OpenStreetMap_HOT = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright"/>OpenStreetMap</a>'
        });

        var Stamen_Toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
            attribution: 'Map tiles by <a href="http://stamen.com"/>Stamen Design</a>',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20
        });
              
        var Esri_WorldStreetMap = 
            L.tileLayer(
                'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri'
                });

        var Esri_WorldTopoMap =
            L.tileLayer(
                'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri'
                });
        var Esri_WorldImagery =
            L.tileLayer(
                'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri'
                });



        var mapaBase = {
            'OSM': osm,
            'OpenStreetMap_HOT': OpenStreetMap_HOT,
            'Stamen_Toner': Stamen_Toner,
            'Esri_WorldStreetMap': Esri_WorldStreetMap,
            'Esri_WorldTopoMap': Esri_WorldTopoMap,
            'Satelite': Esri_WorldImagery,
        };

        var SafeCast = L.tileLayer('https://s3.amazonaws.com/te512.safecast.org/{z}/{x}/{y}.png', {
            maxZoom: 16,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href=" ">CC-BY-SA</a>)'
        });
        // var overlay = {"Safecat":SafeCast}


        var controlEscala;

        // controlCapas = L.control.layers(mapaBase, overlay);
        controlCapas = L.control.layers(mapaBase);
        controlCapas.addTo(this.map);

        controlEscala = L.control.scale();
        controlEscala.addTo(this.map);



  }
  initMap2(){

  }
  borrarMarcadores() {
    if(this.lista_marcadores){
      for (let indice of this.lista_marcadores){
        this.map.removeLayer(indice);
      }
    }
  }
  monitoreo_seleccionado(event: any){
    try {
      this.BorrarTimer();
      this.fecha_ratreo=new Date();
      this.hora_inicio=new Date('2023-10-06 01:00:00');
      this.hora_fin=new Date('2023-10-06 23:59:59');
      
      this.vehiculo_seleccionado=[];
      if(event.value.code=="tiempo_real"){
        this.limite_seleccion_vehiculos=2147483647;
        this.bandera_tipo_monitoreo=true;
      }else{
        this.limite_seleccion_vehiculos=1;
        this.bandera_tipo_monitoreo=false;
      }

    } catch (error) {

    }

  }
  error(titulo:string,mensaje:string){
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
      didClose:() =>{
        this.visibleSidebar1=true;
      }
    });
  }
  ejecutar_filtros(){
    let lista_vehiculos:any= JSON.parse(JSON.stringify(this.vehiculo_seleccionado));
    let id_vehiculos_seleccionados='';
    let contador:any=0;
    for (let clave of lista_vehiculos){
      contador++;
      if(contador==lista_vehiculos.length){
        id_vehiculos_seleccionados+=clave.id_vehiculo;
      }else{
        id_vehiculos_seleccionados+=clave.id_vehiculo+',';
      }
    }
    
    if(this.tipo_monitoreo_seleccionado.code=='tiempo_real'){

      this.monitoreo_servicio.post_monitoreo_tiempo_real({id_vehiculos:id_vehiculos_seleccionados}).subscribe(data=>{
        this.closeLoading_alert();
        this.AgregarMarcador( JSON.parse(JSON.stringify(data)));
      },
      error=>{
        this.closeLoading_alert();
        console.log("ver errores ",error);
      })
      this.bandera_timer=true;

    }else{
      this.loading_alert();

      formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')
      let f_ini=formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')+' '+this.hora_inicio.toLocaleTimeString();
      let f_fin=formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')+' '+this.hora_fin.toLocaleTimeString();

      this.monitoreo_servicio.post_monitoreo_rutas({id_vehiculos:id_vehiculos_seleccionados,fecha_inicio:f_ini,fecha_fin:f_fin}).subscribe(data=>{
        this.closeLoading_alert();
        
        this.AgregarMarcador( JSON.parse(JSON.stringify(data)));
      },
      error=>{
        this.closeLoading_alert();
        console.log("ver errores ",error);
      })
    }
  }
  aplicar_filtros(){
    this.contador_zoom_mapa=0;
    this.visibleSidebar1=false;
    if(this.vehiculo_seleccionado.length==0){
      this.error('Error','El campo vehiculo es requerido');
    }else{
      if(this.tipo_monitoreo_seleccionado==undefined){
        this.error('Error','El campo tipo de monitoreo es requerido');
      }else{
        if(this.tipo_monitoreo_seleccionado.code!='tiempo_real'){
          this.bandera_timer=false;
          if(!this.fecha_ratreo){
            this.error('Error','El campo fecha es requerido');
          }else{
            if(!this.hora_inicio){
              this.error('Error','El campo hora inicio es requerido');
            }else{
              if(!this.hora_fin){
                this.error('Error','El campo hora fin es requerido');
              }else{
                this.loading_alert();
                this.ejecutar_filtros();
                this.visibleSidebar1=false;
              }
            }
          }
        }
        else{
          this.loading_alert();
          this.TiempoInterval();
          this.visibleSidebar1=false;
        }
      }
    }
    
  }
  AgregarMarcador(marcadores:any) {

    this.borrarMarcadores();
    this.lista_marcadores=[];

    let linea_rutas=[];
    let lat:any;
    let lon:any;
    let contador:any=0;
    let icon:any;

    for (let indice of marcadores.lista_monitoreo_tiempo_real ){
      
        contador++;
        if(contador==1){

          if(this.tipo_monitoreo_seleccionado.code=="tiempo_real"){
            icon = {
              icon: L.icon({
                iconSize: [25, 31],
                iconAnchor: [12, 31],
                iconUrl: './assets/icono/marcadores/ubicacion/ubi-azul.svg',
              })
            };
          }else{
            icon = {
              icon: L.icon({
                iconSize: [25, 31],
                iconAnchor: [12, 31],
                iconUrl: './assets/icono/marcadores/ubicacion/ubi-rojo.svg',
              })
            };
          }

        }else{
          if(contador==marcadores.lista_monitoreo_tiempo_real.length){
            icon = {
              icon: L.icon({
                iconSize: [25, 31],
                iconAnchor: [12, 31],
                iconUrl: './assets/icono/marcadores/ubicacion/ubi-azul.svg',
              })
            };
          }else{
            if(indice.tiempo_parqueo=='00:00:00'){
              icon = {
                icon: L.icon({
                  // iconSize: [20, 8],
                  // iconAnchor: [7, 3],
                  iconSize: [8, 10],
                  iconAnchor: [4, 3],
                  iconUrl: './assets/icono/marcadores/flecha/flecha-azul2.svg',
                }),
                rotationAngle:indice.course
              };
            }
            else{
              icon = {
                icon: L.icon({
                  iconSize: [25, 31],
                  iconAnchor: [12, 31],
                  iconUrl: './assets/icono/marcadores/ubicacion/ubi-amarillo.svg'
                })
              };
            }

          }
        }

        if(indice.tiempo_parqueo=='00:00:00'){
          this.marker = L.marker([indice.latitude, indice.longitude], icon).addTo(this.map);
          this.marker.bindPopup("<div font-size: 10px; z-index:1000' > <div style='text-align: center;' > <b>DATOS DEL MOTORIZADO</b></div><br/>"+
          "<b>Placa :</b>  "+indice.placa+
          " <br> <b>Fecha :</b>  "+indice.devicetime+
          " <br> <b>Velocidad :</b>  "+parseFloat(indice.speed).toFixed(2)+" Km/h"+
          " <br> <b>Bateria :</b>  "+parseFloat(indice.bateria_vehiculo).toFixed(2)+" Volt."+
          " <br> <b>Ubicación :</b> </br>"+indice.address+ 
          "<div> ");
        }else{
          this.marker = L.marker([indice.latitude, indice.longitude], icon).addTo(this.map);
          this.marker.bindPopup("<div font-size: 10px; z-index:1000' > <div style='text-align: center;' > <b>DATOS DEL MOTORIZADO</b></div><br/>"+
          "<b>Placa :</b>  "+indice.placa+
          " <br> <b>Fecha :</b>  "+indice.devicetime+
          " <br> <b>Velocidad :</b>  "+parseFloat(indice.speed).toFixed(2)+" Km/h"+
          " <br> <b>Bateria :</b>  "+parseFloat(indice.bateria_vehiculo).toFixed(2)+" Volt."+
          " <br> <b>Tiempo parqueo :</b>  "+indice.tiempo_parqueo+
          " <br> <b>Ubicación :</b> </br>"+indice.address+ 
          "<div> ");
        }
        
        this.lista_marcadores.push(this.marker);

        linea_rutas.push(this.marker.getLatLng());
        lat=indice.latitude;
        lon=indice.longitude;


    }

    if(this.polylines){
      this.polylines.removeFrom(this.map);
    }

    if(linea_rutas.length>0){

      
      if(this.tipo_monitoreo_seleccionado.code!="tiempo_real"){
        this.polylines = L.polyline(linea_rutas, {
          color: '#58ACFA', // color de linea
          // weight: 7, // grosor de línea
          weight: 6, // grosor de línea
        }).addTo(this.map);
        
        this.map.fitBounds(this.polylines.getBounds());
      }
      if(this.contador_zoom_mapa==0){
        this.map.setView([lat, lon], 16);  
      }else{
        this.map.setView([lat, lon]);  
      }
      this.contador_zoom_mapa++;
      
    }else{
      this.BorrarToast();
      this.messageService.add({severity: 'info', summary: 'Mensaje', detail: 'No existe datos en la fecha' });
    }

    //solucion a problema de boton close de popop
    document.querySelector('.leaflet-pane.leaflet-popup-pane')!.addEventListener('click', event => {
      event.preventDefault();
    });
    
  }
  TiempoInterval(){
      this.id_interval = setInterval(() => {
        if(this.tipo_monitoreo_seleccionado.code=='tiempo_real'){
          this.ejecutar_filtros(); 
        }
      },7000);
  }
  BorrarTimer(){
    if (this.id_interval) {
      clearInterval(this.id_interval);
    }
  }
  loading_alert(){
    Swal.fire({
      title: 'Espere un momento por favor',
      html: 'Cargando',
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading()
      },
    }); 
  }
  closeLoading_alert(){
    Swal.close();
  }
  BorrarToast() {
    this.messageService.clear();
  }

}
