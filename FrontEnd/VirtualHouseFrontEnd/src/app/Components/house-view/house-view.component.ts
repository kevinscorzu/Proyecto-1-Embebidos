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
    }, 1);
  }
  



  

  play() {
    this.ctx.fillStyle = 'red'; 
    this.ctx.fillRect(0, 0, 5, 5);
  }
  constructor(private ngZone: NgZone) {}
  
  animate(): void {}

}
