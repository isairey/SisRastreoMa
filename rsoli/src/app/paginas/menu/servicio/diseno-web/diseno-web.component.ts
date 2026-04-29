import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-diseno-web',
  templateUrl: './diseno-web.component.html',
  styleUrls: ['./diseno-web.component.css']
})
export class DisenoWebComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scroll(0,0);
  }

}
