interface event_name {
    event_code: string;
}
export interface event_callback_response {
    even: string;
    event_code: string;
    data: any;
}
export declare class Connectors {
    start_obj: LeafShape;
    end_obj: LeafShape;
    chart_con_groupid: string;
    chart_obj: any;
    con_group: any;
    con_groupid: string;
    con_line: any;
    bezierWeight: number;
    pathid: number;
    remove_end_dot: boolean;
    constructor(start_obj: LeafShape, end_obj?: LeafShape);
    movingstart(): void;
    movingend(): void;
    moving(): void;
    init_connector(): void;
    path_maintenance(end_obj?: LeafShape, x?: number, y?: number): void;
    isemptyobject(obj: any): boolean;
    check_dup_con(new_end_obj: LeafShape): boolean;
}
export declare class TextLeaf {
    margin_left: number;
    margin_right: number;
    margin_top: number;
    margin_bottom: number;
    row_gap: number;
    column_gap: number;
    default_txt_b_width: number;
    default_txt_b_height: number;
    calc_total_width: number;
    calc_total_height: number;
    row_textbox: any[];
    text_align: string;
    rootshape: LeafShape;
    col_width: any[];
    row_height: any[];
    max_col_width: number[];
    max_row_height: number[];
    constructor(rootsh: LeafShape);
    init_text(): void;
    text_modified(): void;
    get_text_wh(textval: string): {
        tmp_txt_w: number;
        tmp_txt_h: number;
    };
    private draw_text_ele;
    txt_moving(x: number, y: number): void;
}
export declare abstract class LeafShape {
    x: number;
    y: number;
    myroot: LeafShape[];
    textshape: LeafShape[];
    parentshape: LeafShape;
    baseshape: LeafShape;
    childshape: LeafShape[];
    x_adjust_factor: number;
    y_adjust_factor: number;
    mybaseleaf: any;
    connect_ports: any;
    iammoving: boolean;
    leafs_with_drag: LeafShape[];
    drag_disabled: boolean;
    drag_func_call: any[];
    text_array: any[];
    text_obj: TextLeaf;
    groupid: string;
    mvg_obj: LeafShape;
    chart_obj: any;
    path_obj: any;
    leafs_con_cnt: any;
    con_start_obj: LeafShape;
    working_on_con: Connectors;
    bucket_num: number;
    bucket_ele__indx: number;
    fill: string;
    stroke: string;
    stroke_width: number;
    data: any;
    click_event_code: string;
    constructor(x: number, y: number, prntshape: any, groupid: string, ta: any[], chartobj?: {}, d?: any);
    abstract create(): void;
    abstract size_calc(): void;
    movingstart(): void;
    movingend(x: number, y: number): void;
    moving(x: number, y: number): void;
    abstract moving_bare(): void;
    abstract recalc_adj_factor(): void;
    get_x(): number;
    get_y(): number;
    set_x(x: number): void;
    set_y(y: number): void;
    isemptyobject(obj: any): boolean;
    add_connector_function(con_start_obj: LeafShape, classname: string, funs: any[]): void;
    add_drag_on_cpy_forbase(funs: any[]): void;
    add_drag_forbase(): this | undefined;
    set_click_event(ev: event_name): void;
    object_in_array(tar_array: any, element: any): boolean;
    set_myroot(): void;
    get_path_id(): any;
    text_modify(): void;
    do_adj_recalc(): void;
    do_move_bare(mv_ba_obj: LeafShape): void;
    do_move_connectors(): void;
}
export declare class base_rect_leaf_w_text extends LeafShape {
    width: number;
    height: number;
    mytext: any;
    constructor(x: number, y: number, prntshape: any, groupid: string, w: number, h: number);
    create(): void;
    add_text(adj_t_x?: number, adj_t_y?: number, text_val?: string, fill_clr?: string): void;
    moving_bare(): void;
    recalc_adj_factor(): void;
    redraw(): void;
    size_calc(): void;
}
export declare class base_circle_leaf extends LeafShape {
    radius: number;
    constructor(x: number, y: number, prntshape: any, groupid: string, r: number);
    create(): void;
    moving_bare(): void;
    recalc_adj_factor(): void;
    leaf_resize(radius: number): void;
    size_calc(): void;
}
export declare class base_rect_leaf extends LeafShape {
    width: number;
    height: number;
    constructor(x: number, y: number, prntshape: any, groupid: string, w: number, h: number);
    create(): void;
    moving_bare(): void;
    redraw(): void;
    recalc_adj_factor(): void;
    size_calc(): void;
}
export declare function isemptyobject(obj: any): boolean;
export {};
