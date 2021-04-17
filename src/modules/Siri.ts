/*
 * Author / Toshiya Marukubo
 * Twitter / https://twitter.com/toshiyamarukubo
 */

class Tool {
  // random number.
  static randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // random color rgb.
  static randomColorRGB() {
    return (
      'rgb(' +
      this.randomNumber(50, 180) +
      ', ' +
      this.randomNumber(50, 180) +
      ', ' +
      this.randomNumber(50, 180) +
      ')'
    );
  }
  // random color hsl.
  static randomColorHSL(hue: number, saturation: number, lightness: number) {
    return 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)';
  }
  // gradient color.
  static gradientColor(
    ctx: CanvasRenderingContext2D,
    cr: number,
    cg: number,
    cb: number,
    ca: number,
    x: number,
    y: number,
    r: number
  ) {
    const col = cr + ',' + cg + ',' + cb;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(' + col + ', ' + ca * 1 + ')');
    g.addColorStop(0.5, 'rgba(' + col + ', ' + ca * 0.5 + ')');
    g.addColorStop(1, 'rgba(' + col + ', ' + ca * 0 + ')');
    return g;
  }
}

/*
  When want to use angle.
*/

class Angle {
  public angle: number;
  public radius: number;

  constructor(angle: number) {
    this.angle = angle;
    this.radius = (this.angle * Math.PI) / 180;
  }

  incDec(num: number) {
    this.angle += num;
    this.radius = (this.angle * Math.PI) / 180;
    return this.radius;
  }
}

let siri: Siri;

class Shape {
  private ctx: CanvasRenderingContext2D;
  private y: number;
  private i: number;
  private a: Angle;
  private a1: Angle;
  private color: any;
  private cr: number;

  constructor(canvas: HTMLCanvasElement, y: number, i: number, cr: number) {
    this.ctx = canvas.getContext('2d');
    this.cr = cr;
    this.init(y, i);
  }

  init(y: number, i: number) {
    this.y = y;
    this.i = i;
    this.cr = 50;
    this.a = new Angle(Tool.randomNumber(0, 360));
    this.a1 = new Angle(Tool.randomNumber(0, 360));
    this.color = {
      r: Tool.randomNumber(50, 180),
      g: Tool.randomNumber(50, 180),
      b: Tool.randomNumber(50, 180),
      a: 1,
    };
  }

  drawCircle() {
    const ctx = this.ctx;
    // in
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = Tool.gradientColor(
      ctx,
      this.color.r,
      this.color.g,
      this.color.b,
      this.color.a,
      siri.width / 2,
      this.y,
      this.cr
    );
    ctx.translate(siri.width / 2, this.y);
    ctx.rotate(Math.sin(this.a1.radius));
    ctx.scale(
      Math.cos(this.a1.radius * this.i),
      Math.sin(this.a1.radius * this.i)
    );
    ctx.translate(-siri.width / 2, -this.y);
    ctx.beginPath();
    ctx.arc(siri.width / 2, this.y, this.cr, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
    // out
    ctx.save();
    ctx.lineWidth = 5;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = Tool.gradientColor(
      ctx,
      this.color.r,
      this.color.g,
      this.color.b,
      this.color.a,
      siri.width / 2,
      this.y,
      this.cr
    );
    ctx.strokeStyle = Tool.gradientColor(
      ctx,
      this.color.r,
      this.color.g,
      this.color.b,
      this.color.a,
      siri.width / 2,
      this.y,
      this.cr + 5
    );
    ctx.beginPath();
    ctx.arc(siri.width / 2, this.y, this.cr, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  updateParams() {
    this.a.incDec(1);
    this.a1.incDec(0.5);
    if (this.cr > 50) this.cr -= 1;
  }

  render() {
    this.drawCircle();
    this.updateParams();
  }
}

export class Siri {
  public canvas: HTMLCanvasElement;
  public width: number;
  public height: number;
  private ctx: CanvasRenderingContext2D;
  private shapes: Shape[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  init(_siri?: Siri) {
    if (_siri) {
      siri = _siri;
    }
    this.shapes = [];
    for (let i = 0; i < 3; i++) {
      const s = new Shape(this.canvas, this.height / 2, i + 1, this.width);
      this.shapes.push(s);
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].render();
    }
  }
}
