import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeocercaModelo } from './geocerca-model';

// import { PersonaModelo } from './persona-modelo';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  baseURL: string = "";
  token = "";
  headers_token = {}; 

  constructor(private http:HttpClient) { }
  actualizar_accesos(){
    this.baseURL = environment.apiUrl+"/servicio/";
    this.token = JSON.parse(localStorage.getItem('accesos')|| '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest','Authorization':'Bearer '+this.token } }; 
  }
  get_filtros_monitoreo(){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'filtros_monitoreo', this.headers_token);
  }
  post_monitoreo_tiempo_real(parametros:any){
    this.actualizar_accesos();
    const body=JSON.stringify(parametros);
    return this.http.post(this.baseURL + 'monitoreo_tiempo_real',body, this.headers_token);
  }
  post_monitoreo_rutas(parametros:any){
    this.actualizar_accesos();
    const body=JSON.stringify(parametros);
    return this.http.post(this.baseURL + 'monitoreo_rutas',body, this.headers_token);
  }
  reporte_parqueos(parametros:any){
    this.actualizar_accesos();
    const body=JSON.stringify(parametros);
    return this.http.post(this.baseURL + 'reporte_parqueos',body, this.headers_token);
  }
  get_geocercas(){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_geocercas', this.headers_token);
  }
  post_geocerca(geocerca:GeocercaModelo){
    this.actualizar_accesos();
    const body=JSON.stringify(geocerca);
    return this.http.post(this.baseURL + 'post_geocerca',body,this.headers_token);
  }
  eliminar_geocerca(id:number){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'eliminar_geocerca/' + id, this.headers_token);
  }
  post_geocerca_notificacion(parametros:any){

    this.actualizar_accesos();
    const body=JSON.stringify(parametros);
    return this.http.post(this.baseURL + 'post_geocercas_seleccionados',body, this.headers_token);

  }
  get_geocercas_seleccionado(id:number){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_geocercas_seleccionados/' + id, this.headers_token);
  }
  
}
