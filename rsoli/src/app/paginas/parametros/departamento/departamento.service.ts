import { Injectable } from '@angular/core';
import { DepartamentoModelo } from './departamento-modelo';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  baseURL: string = "";
  token = "";
  headers_token = {};

  constructor(private http: HttpClient) { }
  actualizar_accesos() {
    this.baseURL = environment.apiUrl + "/parametros/";
    this.token = JSON.parse(localStorage.getItem('accesos') || '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.token } };
  }
  get_departamentos() {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_departamento', this.headers_token);
  }
  post_departamentos(departamento: DepartamentoModelo) {
    this.actualizar_accesos();
    const body = JSON.stringify(departamento);
    console.log(body);
    return this.http.post(this.baseURL + 'post_departamento', body, this.headers_token);
  }
  eliminar_departamento(id: number) {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'eliminar_departamento/' + id, this.headers_token);
  }
}
