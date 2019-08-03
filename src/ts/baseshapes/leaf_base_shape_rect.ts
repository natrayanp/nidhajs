import { LeafShape } from '../nidhajs';
import * as d3 from 'd3';

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


