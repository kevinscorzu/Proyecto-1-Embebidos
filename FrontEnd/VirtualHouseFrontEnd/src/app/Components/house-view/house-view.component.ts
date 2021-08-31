import { Component,ViewChild, ElementRef, OnInit ,NgZone} from '@angular/core';

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

    drawLights(){
      var light1 = new Circle(this.ctx);
      light1.x = 100;
      light1.y = 100;
      this.lights.push(light1)

      var light2 = new Circle(this.ctx);
      light2.x = 100;
      light2.y = 100;
      this.lights.push(light2)

      var light3 = new Circle(this.ctx);
      light3.x = 100;
      light3.y = 100;
      this.lights.push(light3)

      var light4 = new Circle(this.ctx);
      light4.x = 100;
      light4.y = 100;
      this.lights.push(light4)

      var light5 = new Circle(this.ctx);
      light5.x = 100;
      light5.y = 100;
      this.lights.push(light5)

      var light6 = new Circle(this.ctx);
      light6.x = 100;
      light6.y = 100;
      this.lights.push(light6)
      
      for(let light of this.lights){
        light.draw()
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
    this.ctx.fillText('Habitacion 3', 510, 170);
    this.ctx.fillText('Habitacion 2', 510, 320);
    this.ctx.fillText('Baño',610, 20);
    this.ctx.fillText('Patio',10, 480);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      var canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
      var ctx = canvasEl.getContext('2d');
      this.ctx = ctx!;
      this.drawBackground();
      this.drawLights();
    }, 1);
  }
  



  

  play() {
    
    this.drawLights();
    this.ctx.beginPath();
    this.ctx.arc(300,300,100,0,2*Math.PI, false);
    this.ctx.stroke();

  }
  constructor(private ngZone: NgZone) {}
  
  animate(): void {}

}
