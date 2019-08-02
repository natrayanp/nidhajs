import * as d3 from 'd3';

export abstract class LeafShape {

    public x: number;
    public y: number;
    public myroot : LeafShape;
    public parentshape : LeafShape;
    public baseshape : LeafShape;
    public childshape : LeafShape[];
    public x_adjust_factor: number;
    public y_adjust_factor: number;
    public mynode: any;
    public iammoving: boolean;

    constructor(x:number,y:number, prntshape:any) {
      this.x = 0;
      this.y = 0;
      this.iammoving = false;
      this.x_adjust_factor = 0;
      this.y_adjust_factor = 0;
      this.myroot = <LeafShape>{};
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
      this.set_myroot();
    }
    
    ///////  CREATE SHAPES : start   ///////
    // set the base shape here
    // set the adjustment factor for child shapes
    public abstract create():void;  
    ///////  CREATE SHAPES : end   ///////

    movingstart() {
      this.iammoving = true;
    }

    movingend(x:number,y:number) {
      this.iammoving = false;
    }

    public moving(x:number,y:number): void
    {
         if(!this.isemptyobject(this.parentshape) && this.parentshape.baseshape === this && this.iammoving && this.isemptyobject(this.parentshape.parentshape)) {
              // SCENARIO WHERE the moving element is the BASE of the ROOT
              // I have parent (THAT IS THE LAST CHAIN OF PARENT in up direction) and i am the base shape for the parent and i am moving, so i am responsible to update parents x, y
              // so all childs can allign with parent including me
              // After updating parent with lateset x,y position i better allign with my parent
             
              this.parentshape.set_x(x);
              this.parentshape.set_y(y);
              this.set_x(x);
              this.set_y(y);

        } else if(!this.isemptyobject(this.parentshape) && this.parentshape.baseshape === this && this.iammoving && !this.isemptyobject(this.parentshape.parentshape)) {
              // SCENARIO WHERE the moving element is the BASE of any SUB CLASS OF SUB ELEMENT of ROOT
              // I have parent (THAT IS THE LAST CHAIN OF PARENT in up direction) and i am the base shape for the parent and i am moving, so i am responsible to update parents x, y
              // so all childs can allign with parent including me
              // After updating parent with lateset x,y position i better allign with my parent
              this.parentshape.x = x;
              this.parentshape.y = y;
              this.set_x(x);
              this.set_y(y);
        
        } else if (!this.isemptyobject(this.parentshape) && !this.iammoving) {
              // SCENARIO WHERE the element is the CHILD of the moving BASE ELEMENT which of any SUB ELEMENT or BASE element of ROOT
              // I have parent but i am moving because of some one, so i should not pollut parents x, y
              // Since some one is moving me i better allign with my parent
              this.set_x(x);
              this.set_y(y);
          }
          else  if(!this.isemptyobject(this.parentshape) && this.parentshape.baseshape !== this && this.iammoving) {
              // SCENARIO WHERE the moving element is the BASE of any SUB ELEMENT OF ROOT
              // I have parent and i am NOT the base shape for the parent but i am moving, so i should not pollut parents x, y
              // update my self only.  Since iam keeping me updated my childs will follow me
              this.x = x;
              this.y = y;
        } 


        if (this.isemptyobject(this.baseshape) && this.childshape.length===0) {

            this.moving_bare();
            this.parentshape.childshape.forEach( le => { if(le!==this) {le.moving(this.get_x(),this.get_y())};});
          } else {
            this.baseshape.moving(this.get_x(),this.get_y());
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
      this.isemptyobject(this.parentshape) ? this.x = x : this.x = this.parentshape.get_x() + this.x_adjust_factor;
    }

    public set_y(y:number) {
      this.isemptyobject(this.parentshape)  ? this.y = y: this.y = this.parentshape.get_y() + this.y_adjust_factor;
    }

    public isemptyobject(obj: any): boolean {
      if ((Object.keys(obj).length === 0 && obj.constructor === Object)) {
        return true;
      }  
      return false;    

    }

   add_drag_forbase() {
    // This adds the drag behaviour for the first BASE ELEMENT in the called object

    if (typeof(this.mynode) === "undefined" && (!this.isemptyobject(this.baseshape))) {
      this.baseshape.add_drag_forbase();
    } else if (typeof(this.mynode) !== "undefined" && (this.isemptyobject(this.baseshape))) {
        this.mynode
                      //.attr("fill","yellow")
                      //.raise()
                        .call(d3.drag()
                            .on("start", () => this.movingstart())
                            .on("drag", () => this.moving(d3.event.x,d3.event.y))
                            .on("end", () => this.movingend(d3.event.x,d3.event.y))
                            );

    }
  }

  set_myroot() {
    this.isemptyobject(this.parentshape)  ? this.myroot = <LeafShape>{}: this.myroot = this.parentshape.myroot;
  }

}


export class base_circle_leaf extends LeafShape {
  radius: number;

  constructor(x:number,y:number, prntshape:any,r: number) {
    super(x,y,prntshape);
    this.radius = r;
    this.create();
  }

  create() {
      this.mynode = d3.select("#leaflayer").append("circle")
                      .attr("r",this.radius)
                      .attr("cx",this.get_x())
                      .attr("cy",this.get_y());
  }


    moving_bare() {
    this.mynode.attr("cx", this.get_x())
               .attr("cy", this.get_y());
  }

}


export class base_rect_leaf extends LeafShape {
  width: number;
  height: number;

  constructor(x:number,y:number, prntshape:any,w: number,h: number) {
    super(x,y,prntshape);
    this.width = w;
    this.height = h;
    this.myroot = this;
    this.create();
  }

  create() {
      this.mynode = d3.select("#leaflayer")
                      .append("rect")
                      .attr("width",this.width)
                      .attr("height",this.height)
                      .attr("x",this.get_x())
                      .attr("y",this.get_y())
                        ;
  }

  moving_bare() {
    this.mynode.attr("x", this.get_x())
               .attr("y", this.get_y());
  }

}

export class my_dot_leaf extends LeafShape {
    constructor(x:number,y:number, prntshape:any,r: number) {
    super(x,y,prntshape);
    this.baseshape = new base_circle_leaf(0,0,this,r);
    this.create();
  }

  create() {    
    let msx= this.childshape.push(new base_circle_leaf(0,0,this,((<base_circle_leaf>this.baseshape).radius/2)));
    console.log(this.childshape[msx-1].mynode);
    this.childshape[msx-1].mynode.attr("fill","yellow");
    console.log("sdddddd");
    console.log(msx)
  }

  moving_bare() {
  }

}


export class my_rect_leaf extends LeafShape {
    
  constructor(x:number,y:number, prntshape:any,w: number,h: number) {
    super(x,y,prntshape);
    this.baseshape = new base_rect_leaf(0,0,this,w,h);
    this.create();
  }

  create() {
    //@TESTING CODES
    this.childshape.push(new my_dot_leaf(             /* -->  this is test for NON BASE shape as child */
    //this.childshape.push(new base_circle_leaf(      /* -->  this is test for BASE shape as child */
      ((<base_rect_leaf>this.baseshape).width),
      ((<base_rect_leaf>this.baseshape).height)/2,this,((<base_rect_leaf>this.baseshape).height/4)));
    //@TESTING CODES
  }

  moving_bare() {
  }

}