export class Square {
    private color = 'red';
    private x = 0;
    private y = 0;
    private z = 30;
  
    constructor(private ctx: CanvasRenderingContext2D) {}
  
    
  
     draw(x: number, y: number, z: number) {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.z * this.x, this.z * this.y, this.z, this.z);
    }
  }