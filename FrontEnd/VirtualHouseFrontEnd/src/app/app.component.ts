import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ReactiveFormsModule,FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app-routing.module';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit{

  title = 'VirtualHouseFrontEnd';
  username: string  = "";
  password: string  = "";

  
  constructor(private router:Router){

  }

  
  onLogIn(username:string, password:string){
    console.log(username);
    console.log(password);
    if(password == "admin" && username == "admin"){
      console.log("Credenciales correctos");
      
      this.router.navigate(['/houseView']);
    }
    else{
      console.log("Credenciales incorrectos");
      alert("Credenciales incorrectos");
      this.router.navigateByUrl('houseView');
    }
  }


  

  ngOnInit() {

  }
}
