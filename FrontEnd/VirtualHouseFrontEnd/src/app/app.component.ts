import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ReactiveFormsModule,FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app-routing.module';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {

  title = 'VirtualHouseFrontEnd';
  show = 'login'; // Por defecto muestra la ventana de login
  

  /* Al recargar la página */
  refresh(): void {
    window.location.reload();
  }
  constructor(){

  }




  
}
