import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PersonaModelo } from './persona-modelo';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  baseURL: string = "";
  token = "";
  headers_token = {};

  constructor(private http: HttpClient) { }
  actualizar_accesos() {
    this.baseURL = environment.apiUrl + "/persona/";
    this.token = JSON.parse(localStorage.getItem('accesos') || '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.token } };
  }
  get_personas() {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_persona', this.headers_token);
  }
  post_personas(persona: PersonaModelo) {
    this.actualizar_accesos();
    const body = JSON.stringify(persona);
    return this.http.post(this.baseURL + 'post_persona', body, this.headers_token);
  }
  eliminar_personas(id: number) {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'eliminar_persona/' + id, this.headers_token);
  }
}
