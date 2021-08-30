import { Component, OnInit } from '@angular/core';

import {ReactiveFormsModule,FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit{

  title = 'VirtualHouseFrontEnd';
  username: string  = "";
  password: string  = "";

  


  
  onLogIn(username:string, password:string){
    console.log(username);
    console.log(password);
    if(password == "admin" && username == "admin"){
      console.log("Credenciales correctos");
      alert("Credenciales correctos");
    }
    else{
      console.log("Credenciales incorrectos");
      alert("Credenciales incorrectos");
    }
  }


  

  ngOnInit() {

  }
}
