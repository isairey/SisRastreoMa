import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { GestionModelo } from './gestion-modelo';
@Injectable({
  providedIn: 'root'
})
export class GestionService {
  baseURL: string = "";
  token = "";
  headers_token = {};
  constructor(private http:HttpClient) { }

  actualizar_accesos() {
    this.baseURL = environment.apiUrl + "/parametros/";
    this.token = JSON.parse(localStorage.getItem('accesos') || '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.token } };
  }

  get_gestiones() {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_gestion', this.headers_token);
  }
}
 