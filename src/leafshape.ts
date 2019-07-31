import * as d3 from 'd3';

export abstract class LeafShape {

    private x: number;
    private y: number;
    public parentshape : LeafShape;
    public baseshape : LeafShape;
    public childshape : LeafShape[];
    public x_adjust_factor: number;
    public y_adjust_factor: number;

    constructor(x:number,y:number, prntshape:any) {
      this.x = 0;
      this.y = 0;
      this.x_adjust_factor = 0;
      this.y_adjust_factor = 0;
      this.childshape = [];
      this.parentshape = <LeafShape>{};
      this.baseshape = <LeafShape>{};

      let nx = x;
      let ny = y;
      if (prntshape !== null) { // If parentshape is NOT null then x & y are adjx, adjy values
        this.parentshape = <LeafShape>prntshape;
        this.x_adjust_factor = x;
        this.y_adjust_factor = y;
        let nx = this.parentshape.get_x();
        let ny = this.parentshape.get_y();
      }
      this.set_x(nx);
      this.set_y(ny);
    }
    
    ///////  CREATE SHAPES : start   ///////
    // set the base shape here
    // set the adjustment factor for child shapes
    public abstract create():void;  
    ///////  CREATE SHAPES : end   ///////

    public moving(x:number,y:number): void
    {
          this.set_x(x);
          this.set_y(y);

          if (this.baseshape === null && this.childshape=== null) {
            this.moving_bare();
          } 
          if(this.childshape.length) {
              this.childshape.forEach( le => { le.moving(0,0);})
          }      
    }

    public abstract moving_bare():void;
    
    public get_x() {
      return this.x;
    }

    public get_y() {
      return this.y;
    }

    public set_x(x:number) {
      console.log(x);
      console.log((typeof(this.parentshape)));
      console.log(typeof(<LeafShape>{}));
      console.log(JSON.stringify(this.parentshape) === '{}');

      this.checkforempty(this.parentshape) ? this.x = x: this.x = this.parentshape.get_x() + this.x_adjust_factor;
    }

    public set_y(y:number) {
      this.checkforempty(this.parentshape)  ? this.y = y: this.y = this.parentshape.get_y() + this.y_adjust_factor;
    }

    private checkforempty(obj: any): boolean {
      if ((obj.entries().length === 0 && obj.constructor === Object)) {
        return true;
      }  
      return false;    

    }

}


export class base_circle_leaf extends LeafShape {
  radius: number;
  mynode: any;

  constructor(x:number,y:number, prntshape:any,r: number) {
    super(x,y,prntshape);
    this.radius = r;
    this.create();
  }

  create() {
      this.mynode = d3.select("#nodelayer").append("circle")
                      .attr("r",this.radius)
                      .attr("cx",this.get_x())
                      .attr("cy",this.get_y());
  }

  moving_bare() {
    this.mynode.attr("cx",this.get_x())
               .attr("cy",this.get_y());
  }

}


export class base_rect_leaf extends LeafShape {
  width: number;
  height: number;
  mynode: any;

  constructor(x:number,y:number, prntshape:any,w: number,h: number) {
    super(x,y,prntshape);
    this.width = w;
    this.height = h;
    this.create();
  }

  create() {
      this.mynode = d3.select("#nodelayer").append("rect")
                      .attr("width",this.width)
                      .attr("height",this.height)
                      .attr("x",this.get_x())
                      .attr("y",this.get_y());
  }

  moving_bare() {
    this.mynode.attr("x",this.get_x())
               .attr("y",this.get_y());
  }
  

}

export class my_rect_leaf extends LeafShape {
    
  constructor(x:number,y:number, prntshape:any,w: number,h: number) {
    super(x,y,prntshape);
    this.baseshape = new base_rect_leaf(0,0,this,w,h);
    this.create();
  }

  create() {
    this.childshape.push(new base_circle_leaf(
      ((<base_rect_leaf>this.baseshape).width),
      ((<base_rect_leaf>this.baseshape).height)/2,this.baseshape,((<base_rect_leaf>this.baseshape).height/4)));
  }

  moving_bare() {
  }

}