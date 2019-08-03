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







