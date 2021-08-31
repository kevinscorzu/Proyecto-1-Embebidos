import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {Router} from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { routingComponents } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HouseViewComponent } from 'src/app/Components/house-view/house-view.component';






@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
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
