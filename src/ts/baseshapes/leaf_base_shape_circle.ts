import { LeafShape } from '../nidhajs';
import * as d3 from 'd3';

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