export declare abstract class LeafShape {
    x: number;
    y: number;
    myroot: LeafShape;
    parentshape: LeafShape;
    baseshape: LeafShape;
    childshape: LeafShape[];
    x_adjust_factor: number;
    y_adjust_factor: number;
    mynode: any;
    iammoving: boolean;
    constructor(x: number, y: number, prntshape: any);
    abstract create(): void;
    movingstart(): void;
    movingend(x: number, y: number): void;
    moving(x: number, y: number): void;
    abstract moving_bare(): void;
    get_x(): number;
    get_y(): number;
    set_x(x: number): void;
    set_y(y: number): void;
    isemptyobject(obj: any): boolean;
    add_drag_forbase(): void;
    set_myroot(): void;
}
export declare class base_circle_leaf extends LeafShape {
    radius: number;
    constructor(x: number, y: number, prntshape: any, r: number);
    create(): void;
    moving_bare(): void;
}
export declare class base_rect_leaf extends LeafShape {
    width: number;
    height: number;
    constructor(x: number, y: number, prntshape: any, w: number, h: number);
    create(): void;
    moving_bare(): void;
}
export declare class my_dot_leaf extends LeafShape {
    constructor(x: number, y: number, prntshape: any, r: number);
    create(): void;
    moving_bare(): void;
}
export declare class my_rect_leaf extends LeafShape {
    constructor(x: number, y: number, prntshape: any, w: number, h: number);
    create(): void;
    moving_bare(): void;
}
