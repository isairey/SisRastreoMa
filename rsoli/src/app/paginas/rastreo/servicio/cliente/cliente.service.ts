import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClienteModelo } from './cliente-modelo';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  baseURL: string = "";
  token = "";
  headers_token = {};

  constructor(private http: HttpClient) { }

  actualizar_accesos() {
    this.baseURL = environment.apiUrl + "/cliente/";
    this.token = JSON.parse(localStorage.getItem('accesos') || '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.token } };
  }
  get_clientes() {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_cliente', this.headers_token);
  }
  get_cliente(id:number){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'get_cliente/'+id, this.headers_token);
  }
  post_cliente(cliente:ClienteModelo){
    this.actualizar_accesos();
    const body=JSON.stringify(cliente);
    return this.http.post(this.baseURL + 'post_cliente',body,this.headers_token);
  }
  eliminar_cliente(id:number){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'eliminar_cliente/' + id, this.headers_token);
  }

}
