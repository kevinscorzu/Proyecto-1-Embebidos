export class Circle {
    public color = 'yellow';
    public x = 0;
    public y = 0;
    public r = 20;
    public on = 0;
    public id = -1;

  
    constructor(private ctx: CanvasRenderingContext2D) {}
  
    
  
     draw() {
      this.ctx.beginPath();
      this.ctx.fillStyle =  this.color;
      this.ctx.fill();
      this.ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
      if (this.on==1){
        this.ctx.fill();
      } else {
        this.ctx.stroke();
      }
      }
  }