import { LeafShape } from '../nidhajs';
import  * as bs from '../baseshapes';


export class custom_dot_leaf extends LeafShape {
    constructor(x:number,y:number, prntshape:any,r: number) {
    super(x,y,prntshape);
    this.baseshape = new bs.base_circle_leaf(0,0,this,r);
    this.create();
  }

  create() {    
    let msx= this.childshape.push(new bs.base_circle_leaf(0,0,this,((<bs.base_circle_leaf>this.baseshape).radius/2)));
    console.log(this.childshape[msx-1].mynode);
    this.childshape[msx-1].mynode.attr("fill","yellow");
    console.log("sdddddd");
    console.log(msx)
  }

  moving_bare() {
  }

}