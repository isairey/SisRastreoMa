import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rastreo-satelital',
  templateUrl: './rastreo-satelital.component.html',
  styleUrls: ['./rastreo-satelital.component.css']
})
export class RastreoSatelitalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scroll(0,0);
  }

}
