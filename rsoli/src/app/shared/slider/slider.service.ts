import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Image } from './modelo-slider';

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  baseURL: string = "";
  token = "";
  headers_token = {}; 

  responsiveOptions:any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];

  constructor(private http: HttpClient) { }

  getImages() {

    return this.http.get<any>('assets/slider/imagenes.json')
      .toPromise()
      .then(res => <Image[]>res.data)
      .then(data => { return data; });
  }
}
