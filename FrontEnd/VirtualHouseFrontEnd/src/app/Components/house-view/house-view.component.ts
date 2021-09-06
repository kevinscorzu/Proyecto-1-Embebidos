import { Component,ViewChild, ElementRef, OnInit ,NgZone} from '@angular/core';
import { ServerConectionService } from 'src/app/server-conection.service';
import { Square } from './square';
import { Circle } from './circle';

@Component({
  selector: 'app-house-view',
  templateUrl: './house-view.component.html',
  styleUrls: ['./house-view.component.css'],
  template:`
  <canvas #canvas width="600" height="300"></canvas>
  <button (click)="animate()">Play</button>   
`,
styles: ['canvas { border-style: solid }']
})



export class HouseViewComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;  
  
  private ctx: CanvasRenderingContext2D = null as any;
  doors: Square[] = [];
  lights: Circle[] = [];


  requestId:any;
  interval:any;


  ngOnInit(): void {
    }

    initializeLights(){
      var light0 = new Circle(this.ctx);
      light0.x = 100;
      light0.y = 100;
      light0.id = 0;
      this.lights.push(light0)

      var light1 = new Circle(this.ctx);
      light1.x = 100;
      light1.y = 320;
      light1.id = 1;
      this.lights.push(light1)

      var light2 = new Circle(this.ctx);
      light2.x = 400;
      light2.y = 70;
      light2.id = 2;
      this.lights.push(light2)

      var light3 = new Circle(this.ctx);
      light3.x = 330;
      light3.y = 300;
      light3.id = 3;
      this.lights.push(light3)

      var light4 = new Circle(this.ctx);
      light4.x = 710;
      light4.y = 70;
      light4.id = 4;
      this.lights.push(light4)

      var light5 = new Circle(this.ctx);
      light5.x = 670;
      light5.y = 380;
      light5.id = 5;
      this.lights.push(light5)

      for(let light of this.lights){
        light.draw()
        light.firstTime = false;
        }
    }
    reDrawLights(){
      for(let light of this.lights){
        light.draw()
        
        }
    }
    reDrawDoors(){
      for(let door of this.doors){
        door.draw()
        
        }
    }
    updateAll(){

        this.http.getAllHouse().subscribe((data) => {
        var json = JSON.parse(JSON.stringify(data));
        
        for (let element of this.lights){
          var status = json["led" + String(element.id)];
          element.on = status;
        }
        for (let element of this.doors){
          var status = json["door" + String(element.id)];
          element.on = status;
          if (element.id == 1){
            console.log("LA PUERTA 1:")
            console.log(status);
          }
        }
        this.reDrawLights();
        this.reDrawDoors();
      }, (error) => {
        console.log("Error al realizar la actualizacion de la casa");
        console.log(error);
      });

      
      
    }
    async loadImage(src: string): Promise<HTMLImageElement> {
      const image = new Image();
      image.src = src;
      return new Promise(resolve => {
          image.onload = (ev) => {
              resolve(image);
          }
      });
  }
    async takePicture(){
      
      this.http.getCamara().subscribe(async (data) => {
        var json = JSON.parse(JSON.stringify(data));
        let base64img = json["image"];
        let url = "data:image/gif;base64," + String(base64img);
        const image: HTMLImageElement = await this.loadImage(url);
        this.ctx.drawImage(image,200,465,450,450);
        console.log('Imagen cargada');
        
      }, (error) => {
        console.log("Error al cargar la imagen:");
        console.log(error);
      });
    };
    
    initializeDoors(){
      var door0 = new Square(this.ctx);
      door0.x = 90;
      door0.y = 0;
      door0.id = 0;
      this.doors.push(door0)

      var door1 = new Square(this.ctx);
      door1.x = 90;
      door1.y = 440;
      door1.id = 1;
      this.doors.push(door1)

      var door2 = new Square(this.ctx);
      door2.x = 480;
      door2.y = 150;
      door2.id = 2;
      door2.side = 'v';
      this.doors.push(door2)

      var door3 = new Square(this.ctx);
      door3.x = 600;
      door3.y = 130;
      door3.id = 3;
      this.doors.push(door3)

      var door4 = new Square(this.ctx);
      door4.x = 500;
      door4.y = 300;
      door4.id = 4;
      this.doors.push(door4)
      
      for(let door of this.doors){
        door.draw()
        
        }
    }

  drawBackground(){
    this.ctx.strokeRect(0, 0, 200, 200); //Sala
    this.ctx.strokeRect(0, 200, 200, 260); //Comedor
    this.ctx.strokeRect(200, 0, 400, 150); //Cocina
    this.ctx.strokeRect(200, 150, 300, 310); //Habitacion 1
    this.ctx.strokeRect(600, 0, 200, 150); //Bano
    this.ctx.strokeRect(500, 150, 300, 150); //Habitacion 3
    this.ctx.strokeRect(500, 300, 300, 160); //Habitacion 2
    this.ctx.font = 'italic 18px Arial';
    this.ctx.fillText('Sala', 10, 20);
    this.ctx.fillText('Comedor', 10, 220);
    this.ctx.fillText('Cocina', 210, 20);
    this.ctx.fillText('Habitacion 1', 210, 170);
    this.ctx.fillText('Pasillo', 510, 170);
    this.ctx.fillText('Habitacion 2', 600, 320);
    this.ctx.fillText('Baño',610, 20);
    this.ctx.fillText('Patio',10, 480);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      var canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
      var ctx = canvasEl.getContext('2d');
      this.ctx = ctx!;
      this.drawBackground();
      this.initializeLights();
      this.initializeDoors();
      this.updateAll();
    }, 1);
  }

  actionLight(id: number){
    for(let light of this.lights){
      if (light.id == id){
        light.on = !light.on;
      }
    }
    this.reDrawLights();
    this.http.postLedChanges(id).subscribe((data) => {
      console.log(data)
      this.updateAll();
    }, (error) => {
      console.log("Error al actualizar las luces");
      console.log(error);
    });
    
      
  }
  actionDoor(id: number){
    for(let door of this.doors){
      if (door.id == id){
        door.on = !door.on;
      }
      }
  }
  
  constructor(private ngZone: NgZone,private http: ServerConectionService) {}
  
  animate(): void {}

}
