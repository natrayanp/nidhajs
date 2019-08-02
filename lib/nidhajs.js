"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __importStar(require("d3"));
class LeafShape {
    constructor(x, y, prntshape) {
        this.x = 0;
        this.y = 0;
        this.iammoving = false;
        this.x_adjust_factor = 0;
        this.y_adjust_factor = 0;
        this.myroot = {};
        this.childshape = [];
        this.parentshape = {};
        this.baseshape = {};
        let nx = x;
        let ny = y;
        if (prntshape !== null) { // If parentshape is NOT null then x & y are adjx, adjy values
            this.parentshape = prntshape;
            this.x_adjust_factor = x;
            this.y_adjust_factor = y;
            let nx = this.parentshape.get_x();
            let ny = this.parentshape.get_y();
        }
        this.set_x(nx);
        this.set_y(ny);
        this.set_myroot();
    }
    ///////  CREATE SHAPES : end   ///////
    movingstart() {
        this.iammoving = true;
    }
    movingend(x, y) {
        this.iammoving = false;
    }
    moving(x, y) {
        if (!this.isemptyobject(this.parentshape) && this.parentshape.baseshape === this && this.iammoving && this.isemptyobject(this.parentshape.parentshape)) {
            // SCENARIO WHERE the moving element is the BASE of the ROOT
            // I have parent (THAT IS THE LAST CHAIN OF PARENT in up direction) and i am the base shape for the parent and i am moving, so i am responsible to update parents x, y
            // so all childs can allign with parent including me
            // After updating parent with lateset x,y position i better allign with my parent
            this.parentshape.set_x(x);
            this.parentshape.set_y(y);
            this.set_x(x);
            this.set_y(y);
        }
        else if (!this.isemptyobject(this.parentshape) && this.parentshape.baseshape === this && this.iammoving && !this.isemptyobject(this.parentshape.parentshape)) {
            // SCENARIO WHERE the moving element is the BASE of any SUB CLASS OF SUB ELEMENT of ROOT
            // I have parent (THAT IS THE LAST CHAIN OF PARENT in up direction) and i am the base shape for the parent and i am moving, so i am responsible to update parents x, y
            // so all childs can allign with parent including me
            // After updating parent with lateset x,y position i better allign with my parent
            this.parentshape.x = x;
            this.parentshape.y = y;
            this.set_x(x);
            this.set_y(y);
        }
        else if (!this.isemptyobject(this.parentshape) && !this.iammoving) {
            // SCENARIO WHERE the element is the CHILD of the moving BASE ELEMENT which of any SUB ELEMENT or BASE element of ROOT
            // I have parent but i am moving because of some one, so i should not pollut parents x, y
            // Since some one is moving me i better allign with my parent
            this.set_x(x);
            this.set_y(y);
        }
        else if (!this.isemptyobject(this.parentshape) && this.parentshape.baseshape !== this && this.iammoving) {
            // SCENARIO WHERE the moving element is the BASE of any SUB ELEMENT OF ROOT
            // I have parent and i am NOT the base shape for the parent but i am moving, so i should not pollut parents x, y
            // update my self only.  Since iam keeping me updated my childs will follow me
            this.x = x;
            this.y = y;
        }
        if (this.isemptyobject(this.baseshape) && this.childshape.length === 0) {
            this.moving_bare();
            this.parentshape.childshape.forEach(le => { if (le !== this) {
                le.moving(this.get_x(), this.get_y());
            } ; });
        }
        else {
            this.baseshape.moving(this.get_x(), this.get_y());
        }
    }
    get_x() {
        return this.x;
    }
    get_y() {
        return this.y;
    }
    set_x(x) {
        this.isemptyobject(this.parentshape) ? this.x = x : this.x = this.parentshape.get_x() + this.x_adjust_factor;
    }
    set_y(y) {
        this.isemptyobject(this.parentshape) ? this.y = y : this.y = this.parentshape.get_y() + this.y_adjust_factor;
    }
    isemptyobject(obj) {
        if ((Object.keys(obj).length === 0 && obj.constructor === Object)) {
            return true;
        }
        return false;
    }
    add_drag_forbase() {
        // This adds the drag behaviour for the first BASE ELEMENT in the called object
        if (typeof (this.mynode) === "undefined" && (!this.isemptyobject(this.baseshape))) {
            this.baseshape.add_drag_forbase();
        }
        else if (typeof (this.mynode) !== "undefined" && (this.isemptyobject(this.baseshape))) {
            this.mynode
                //.attr("fill","yellow")
                //.raise()
                .call(d3.drag()
                .on("start", () => this.movingstart())
                .on("drag", () => this.moving(d3.event.x, d3.event.y))
                .on("end", () => this.movingend(d3.event.x, d3.event.y)));
        }
    }
    set_myroot() {
        this.isemptyobject(this.parentshape) ? this.myroot = {} : this.myroot = this.parentshape.myroot;
    }
}
exports.LeafShape = LeafShape;
class base_circle_leaf extends LeafShape {
    constructor(x, y, prntshape, r) {
        super(x, y, prntshape);
        this.radius = r;
        this.create();
    }
    create() {
        this.mynode = d3.select("#leaflayer").append("circle")
            .attr("r", this.radius)
            .attr("cx", this.get_x())
            .attr("cy", this.get_y());
    }
    moving_bare() {
        this.mynode.attr("cx", this.get_x())
            .attr("cy", this.get_y());
    }
}
exports.base_circle_leaf = base_circle_leaf;
class base_rect_leaf extends LeafShape {
    constructor(x, y, prntshape, w, h) {
        super(x, y, prntshape);
        this.width = w;
        this.height = h;
        this.myroot = this;
        this.create();
    }
    create() {
        this.mynode = d3.select("#leaflayer")
            .append("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("x", this.get_x())
            .attr("y", this.get_y());
    }
    moving_bare() {
        this.mynode.attr("x", this.get_x())
            .attr("y", this.get_y());
    }
}
exports.base_rect_leaf = base_rect_leaf;
class my_dot_leaf extends LeafShape {
    constructor(x, y, prntshape, r) {
        super(x, y, prntshape);
        this.baseshape = new base_circle_leaf(0, 0, this, r);
        this.create();
    }
    create() {
        let msx = this.childshape.push(new base_circle_leaf(0, 0, this, (this.baseshape.radius / 2)));
        console.log(this.childshape[msx - 1].mynode);
        this.childshape[msx - 1].mynode.attr("fill", "yellow");
        console.log("sdddddd");
        console.log(msx);
    }
    moving_bare() {
    }
}
exports.my_dot_leaf = my_dot_leaf;
class my_rect_leaf extends LeafShape {
    constructor(x, y, prntshape, w, h) {
        super(x, y, prntshape);
        this.baseshape = new base_rect_leaf(0, 0, this, w, h);
        this.create();
    }
    create() {
        //@TESTING CODES
        this.childshape.push(new my_dot_leaf(/* -->  this is test for NON BASE shape as child */ 
        //this.childshape.push(new base_circle_leaf(      /* -->  this is test for BASE shape as child */
        (this.baseshape.width), (this.baseshape.height) / 2, this, (this.baseshape.height / 4)));
        //@TESTING CODES
    }
    moving_bare() {
    }
}
exports.my_rect_leaf = my_rect_leaf;
