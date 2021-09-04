import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {



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
      
    }
  }



  ngOnInit(): void {
  }

}
