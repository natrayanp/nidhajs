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
        this.x_adjust_factor = 0;
        this.y_adjust_factor = 0;
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
    }
    ///////  CREATE SHAPES : end   ///////
    moving(x, y) {
        this.set_x(x);
        this.set_y(y);
        if (this.baseshape === null && this.childshape === null) {
            this.moving_bare();
        }
        if (this.childshape.length) {
            this.childshape.forEach(le => { le.moving(0, 0); });
        }
    }
    get_x() {
        return this.x;
    }
    get_y() {
        return this.y;
    }
    set_x(x) {
        this.checkforempty(this.parentshape) ? this.x = x : this.x = this.parentshape.get_x() + this.x_adjust_factor;
    }
    set_y(y) {
        this.checkforempty(this.parentshape) ? this.y = y : this.y = this.parentshape.get_y() + this.y_adjust_factor;
    }
    checkforempty(obj) {
        if ((Object.keys(obj).length === 0 && obj.constructor === Object)) {
            return true;
        }
        return false;
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
        this.mynode = d3.select("#nodelayer").append("circle")
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
        this.create();
    }
    create() {
        this.mynode = d3.select("#nodelayer").append("rect")
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
class my_rect_leaf extends LeafShape {
    constructor(x, y, prntshape, w, h) {
        super(x, y, prntshape);
        this.baseshape = new base_rect_leaf(0, 0, this, w, h);
        this.create();
    }
    create() {
        this.childshape.push(new base_circle_leaf((this.baseshape.width), (this.baseshape.height) / 2, this.baseshape, (this.baseshape.height / 4)));
    }
    moving_bare() {
    }
}
exports.my_rect_leaf = my_rect_leaf;