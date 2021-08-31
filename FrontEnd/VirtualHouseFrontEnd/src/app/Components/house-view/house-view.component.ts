import { Component,ViewChild, ElementRef, OnInit ,NgZone} from '@angular/core';

import { Square } from './square';

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
  squares: Square[] = [];

  requestId:any;
  interval:any;


  ngOnInit(): void {
    }

  ngAfterViewInit() {
    setTimeout(() => {
      var canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
      var ctx = canvasEl.getContext('2d');
      this.ctx = ctx!;
      this.ctx.strokeRect(0, 0, 200, 200); //Sala
      this.ctx.strokeRect(0, 200, 200, 260); //Comedor
      this.ctx.strokeRect(200, 0, 400, 150); //Cocina
      this.ctx.strokeRect(200, 150, 300, 310); //Habitacion 1
      this.ctx.strokeRect(600, 0, 200, 150); //Bano
      this.ctx.strokeRect(500, 150, 300, 150); //Habitacion 3
      this.ctx.strokeRect(500, 300, 300, 160); //Habitacion 2
    }, 1);
  }
  



  

  play() {
    
    this.ctx.strokeRect(0, 0, 100, 100);

  }
  constructor(private ngZone: NgZone) {}
  
  animate(): void {}

}
