import { LeafShape } from '../nidhajs';
import  * as bs from '../baseshapes';

export class custom_rect_leaf extends LeafShape {
    
  constructor(x:number,y:number, prntshape:any,w: number,h: number) {
    super(x,y,prntshape);
    this.baseshape = new bs.base_rect_leaf(0,0,this,w,h);
    this.create();
  }

  create() {
    //@TESTING CODES
    //this.childshape.push(new my_dot_leaf(             /* -->  this is test for NON BASE shape as child */
    this.childshape.push(new bs.base_circle_leaf(      /* -->  this is test for BASE shape as child */
      ((<bs.base_rect_leaf>this.baseshape).width),
      ((<bs.base_rect_leaf>this.baseshape).height)/2,this,((<bs.base_rect_leaf>this.baseshape).height/4)));
    //@TESTING CODES
  }

  moving_bare() {
  }

}