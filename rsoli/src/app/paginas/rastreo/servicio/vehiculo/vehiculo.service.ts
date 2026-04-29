import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { VehiculoModelo } from './vehiculo-modelo';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  baseURL: string = "";
  token = "";
  headers_token = {};

  constructor(private http: HttpClient) { }
  actualizar_accesos() {
    this.baseURL = environment.apiUrl + "/vehiculo/";
    this.token = JSON.parse(localStorage.getItem('accesos') || '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.token } };
  }
  get_vehiculos(id:number) {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_vehiculos/'+id, this.headers_token);
  }
  get_vehiculo(id:number){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'get_vehiculo/'+id, this.headers_token);
  }
  post_vehiculo(vehiculo:VehiculoModelo){
    this.actualizar_accesos();
    const body=JSON.stringify(vehiculo);
    return this.http.post(this.baseURL + 'post_vehiculo',body,this.headers_token);
  }
  eliminar_vehiculo(id:number){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'eliminar_vehiculo/' + id, this.headers_token);
  }
  get_vehiculos_usuario(){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_vehiculos_usuario', this.headers_token);
  }
}
