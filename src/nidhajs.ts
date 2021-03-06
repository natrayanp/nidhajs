import * as d3 from 'd3';

interface text_conf {
  margin_left: number;
  margin_right: number;
  margin_top: number;
  margin_bottom: number;
  row_gap: number;
  column_gap: number;
  calc_width: number;
  calc_height: number;
  row_textbox: any[];
}

interface text_element {
  //myrootshape : LeafShape;
  r_ind: number;
  c_ind: number;
  x_adj: number;
  y_adj: number;
  txt_w: number;
  txt_h: number;
  txt_align: string;
  textval: string;
  myTleaf: any;
}

interface event_name {
  event_code: string;
}

export interface event_callback_response {
  even: string;
  event_code: string;
  data: any;        
}



export class Connectors {

  public start_obj: LeafShape;
  public end_obj: LeafShape;
  //public con_cnt : number;
  public chart_con_groupid: string;
  public chart_obj: any;
  public con_group: any;
  public con_groupid: string;
  public con_line: any;
  public bezierWeight: number;
  public pathid: number;
  remove_end_dot: boolean;
  

  constructor (start_obj: LeafShape, end_obj = <LeafShape>{}) {
    this.start_obj = start_obj;
    this.end_obj = end_obj;
    this.pathid = this.start_obj.myroot[0].get_path_id();
    this.chart_obj = this.start_obj.myroot[0].chart_obj;
    this.chart_con_groupid = this.chart_obj.con_groupid;
    this.bezierWeight = 0.775;
    this.con_groupid="";
    this.remove_end_dot = true;
    if (this.isemptyobject(this.end_obj)) {
        this.movingstart();
    } else {
      this.remove_end_dot = false;
      this.movingstart();
      this.movingend();
    }
    
  }


  movingstart() {
      //console.log("inside connectors movingstart");
      ////console.log(obj);
      //console.log(this.end_obj);
      //let xe1 = this.myroot[0].chart_obj.getInstance(classname);
      this.init_connector();
      //obj.mvg_obj = this.end_obj;
      ////console.log(obj);
      //console.log(this);
      //console.log("checkcheck");
      //consloe.log("ddfdf");
  }

  movingend() {
    // find the target input dot and create a new dot and delete the drag dot
    // if target == a node then cx & cy should be the end dot values.
    // new end obj is the target nodes IN CIRCLE
    /// TO DO 

    let new_end_obj = this.end_obj;  // change this to target nodes IN CIRCLE    /// TO DO 
    //console.log(this);
    //console.log(this.end_obj);
    
   // let cxx = this.end_obj.mybaseleaf.attr("cx")
   // let cyy = this.end_obj.mybaseleaf.attr("cy")
    

  new_end_obj = this.end_obj.myroot[0].chart_obj.find_target("draw_area",this.end_obj,"in");

  console.log(new_end_obj);
  console.log((this.isemptyobject(new_end_obj)));
    console.log("-------------");

  //console.log(new_end_obj);
   if ((!this.isemptyobject(new_end_obj)) && (!(this.check_dup_con(new_end_obj)))) {
    
  console.log("mmmmmm")  ;
  if (this.remove_end_dot) {  // Remove this only if it is moving.  Connectors created while loading not to be removed
  console.log(this.end_obj);
    this.end_obj.mybaseleaf.remove();
  }
  
       
    this.end_obj = new_end_obj;
      //console.log("mmmmmm")  ;

    let dragdot = this.con_group.append("circle")
        .attr("id","conn-handler-end")
        .attr("class","connector-handle")
        .attr("cx",  new_end_obj.mybaseleaf.attr("cx")) 
        .attr("cy",  new_end_obj.mybaseleaf.attr("cy"))
        .attr("r",  4)
        .raise();
    //console.log(this);
    this.path_maintenance();
    //console.log("#####---");
    //console.log(this.start_obj);
    //console.log(this.end_obj);
    //console.log("#####---");
    this.start_obj.myroot[0].path_obj.push(this);
    this.end_obj.myroot[0].path_obj.push(this);

    //Change related to save chart data
    //Add new parent to a LEAF.  raw data in chart object also updated after this: START
    //console.log("----- add new parent START -----");
    let new_parent_id = this.start_obj.myroot[0].data.data.id;
    let parent_exists: boolean = false;
    //console.log(new_parent_id);
    //console.log(parent_exists);
    this.end_obj.myroot[0].data.data.parentIds.forEach((pid: string) => { 
                                                          if(pid===new_parent_id){
                                                              parent_exists = true;
                                                            }
                                                        });
    //console.log(parent_exists);
    if(!parent_exists){
      this.end_obj.myroot[0].data.data.parentIds.push(new_parent_id);
    }
    //Add new parent to a LEAF.  raw data in chart object also updated after this: END

   } else {
     this.con_group.remove();
   }
   


    //console.log(new_end_obj);
   this.end_obj = new_end_obj;
   //this.end_obj =  <LeafShape>{};

  }


  moving() {    
      this.path_maintenance();
  }


  init_connector() {

    //this.pathid = this.getpathid();
    //console.log("pathid - " + this.pathid);
    this.con_groupid = "con_" + this.start_obj.groupid + this.pathid;
    this.con_groupid = this.con_groupid.replace('#','_');


    this.con_group = d3.select(this.chart_con_groupid).append("g")
              .attr("id",this.con_groupid)
              .attr("class","connector"); 
    
    this.con_groupid = "#" +  this.con_groupid;
    console.log(this.start_obj);
    let dragdot = this.con_group.append("circle")
            .attr("id","conn-handler-start")
            .attr("class","connector-handle")
            .attr("cx",  this.start_obj.mybaseleaf.attr("cx"))
            .attr("cy",  this.start_obj.mybaseleaf.attr("cy"))
            .attr("r",  4)
            .raise();
console.log("-------------");
    // Moving circle of the connector
    //console.log("moving dot start");
    //console.log(this.con_groupid);
    if(this.isemptyobject(this.end_obj)) {
    let msx = new base_circle_leaf(0,0,this.start_obj.parentshape,this.con_groupid,(<any>this.start_obj.parentshape).dot_radius);
    //console.log("moving dot end");
    msx.mybaseleaf
      .attr("id", "conn-handler-end")
      //.attr("class","connector-handle")
      .attr("fill-opacity", 1)
      .attr("fill", "blue");
    msx.iammoving = true;
    msx.add_drag_forbase();
    this.end_obj = msx;
    }
    //console.log("inside path start");
    //console.log(msx);
    
    //console.log("insidepathstart___");
    //console.log(this.end_obj);
    //console.log(this.isemptyobject(this.end_obj));
    //this.end_obj = this.isemptyobject(this.end_obj) ? msx : this.end_obj;
    //this.end_obj = this.isemptyobject(this.end_obj)  ? msx : this.end_obj;
    //console.log(msx);
    //console.log(this.end_obj);

    //this.mvg_obj = mxstt;

    // Moving circle of the connector END
    this.con_line = d3.line()
        .curve(d3.curveBundle.beta(1));

    let dragline = this.con_group.append("path") // start a new line
        .attr("class", "connector-path")
        .raise();  

    dragline.on("mouseover",(d: any ,i: any ,n: any) => {
      console.log("$$$$$$$");
      console.log(d);
      console.log(i);
      console.log(n[i]);
      console.log(d3.select(n[0]).node());
      console.log( d3.event.pageX, d3.event.pageY );
      console.log("$$$$$$$");
      d3.select(n[0]).select(".connector-path").attr("stroke-width", 85);
});
    
  }

  path_maintenance(end_obj = <LeafShape>{},x: number = 0, y:number = 0) {

    let x1 =  this.start_obj.get_x();
    let y1 =  this.start_obj.get_y();
    let target_empty = false;
    console.log("***");
    console.log(this);
    //this.isemptyobject(end_obj);
    //console.log("indise path main");
    //console.log(this.end_obj);
    let x4 =  target_empty ? x : this.end_obj.get_x();
    let y4 =  target_empty ? y : this.end_obj.get_y();

    //console.log("x1 - "+ x1 + " y1- " + y1 + " x4- " + x4 + " y4- " + y4);
    

    let dx = Math.abs(x4 - x1) * this.bezierWeight;
    //console.log(dx);
  
    let x2 = x1 + dx;
    let x3 = x4 - dx;
    
    let myline = "M" + x1 + "," + y1 
                  +"C" + x2 + "," + y1 
                  + " " + x3 + "," +  y4
                  + " " + x4 + "," +  y4;
    
    let ourconnector = d3.select(this.con_group.node());
    console.log("$$$$");
    //console.log( d3.select(ourconnector));
    let mydragline = ourconnector.select(".connector-path");
    let updatedline = mydragline.attr("d",myline);
    
    let connector_start = ourconnector.select("#conn-handler-start")
                          .attr("cx",x1)
                          .attr("cy",y1);

    let connector_end = ourconnector.select("#conn-handler-end")
                          .attr("cx",x4)
                          .attr("cy",y4)
                          .attr("r",  4);
                          
    
  }

/*
  getpathid() {
    //console.log("getpath");
    //console.log(this);
    return this.chart_obj.get_path_id();
  }
*/
  public isemptyobject(obj: any): boolean {

  if ((Object.keys(obj).length === 0 && obj.constructor === Object)) {
    return true;
  }  
  return false;    

}

check_dup_con(new_end_obj: LeafShape) {
  //console.log(this.start_obj);
  //console.log(new_end_obj);
  let conn_exists = false;
  new_end_obj.myroot[0].path_obj.forEach (
    (conm: Connectors) => {
      
      // I am child and I have the same parent.  Multiple connections for same leafs not allowed
      if((conm.start_obj === new_end_obj) || (conm.start_obj === this.start_obj)) {
          if((conm.end_obj === new_end_obj) || (conm.end_obj === this.start_obj)) {
              conn_exists= true;
              console.log("xxxxxxxxxxxxxxxxxx1");
          }
      }
      
      // I am already connected child of the new parent.  No connection allowed
      if(this.start_obj.myroot[0] == conm.end_obj.myroot[0]) {
        console.log("xxxxxxxxxxxxxxxxxx2");
        conn_exists= true;
      }

      // I am parent and Iam child.  So circular refernce not allowed
      if(new_end_obj.myroot[0] === this.start_obj.myroot[0]) {
                console.log("xxxxxxxxxxxxxxxxxx3");

        conn_exists = true;
      }
        
    });

//console.log(conn_exists);
//console.log("#####");
return conn_exists;
}

}

export class TextLeaf {
    public margin_left: number;
    public margin_right: number;
    public margin_top: number;
    public margin_bottom: number;
    public row_gap: number;
    public column_gap: number;
    public default_txt_b_width: number;
    public default_txt_b_height: number;
    public calc_total_width: number;
    public calc_total_height: number;
    public row_textbox:  any[];
    public text_align: string;
    public rootshape: LeafShape;
    public col_width: any[];
    public row_height: any[];
    public max_col_width: number[];
    public max_row_height: number[];


    constructor (rootsh: LeafShape) {
          this.margin_left= 20;
          this.margin_right= 20;
          this.margin_top= 5;          
          this.margin_bottom= 5;
          this.row_gap= 10;
          this.column_gap= 10;
          this.default_txt_b_width = 60;
          this.default_txt_b_height = 40;
          this.calc_total_width = 0;
          this.calc_total_height = 0;
          this.row_textbox = [];
          this.text_align = "middle";
          this.rootshape = rootsh;
          console.log("rootsh");
          console.log(rootsh);          
          console.log(rootsh.data);
          console.log(rootsh.data.data != undefined);
          if (rootsh.data.data != undefined) {
            this.rootshape.text_array = rootsh.data.data.leaf_d_txt;
          } else {
            this.rootshape.text_array = [];
          }
          
          this.col_width = [];
          this.row_height = [];
          this.max_col_width = []; 
          this.max_row_height = [];          
    }

    init_text() {
        this.max_col_width = []; 
        this.max_row_height = []; 
        let empt_arr = [];
        let in_tmp_val = {
              "r_ind" : 0,
              "c_ind" : 0,
              "x_adj" : 0,
              "y_adj" : 0,
              "txt_w" : 0,
              "txt_h" : 0,
              "txt_align" : this.text_align,
              "textval" : "",
              "myTleaf" : null,
              "fontfamily": "sans-serif",
              "fontsize": "15px",
              "fill":"black",
              "fontweight": 545
          };

      //Check if i have only one text box
        let only_one_txt = false;
        let no_text = false;
        ((this.rootshape.text_array.length) 
            ? ((this.rootshape.text_array.length === 1) 
                  ? ((this.rootshape.text_array[0].length === 1) ? only_one_txt = true : only_one_txt = false)
                  : only_one_txt = false)
            : no_text = true);

        console.log("only_one_txt - " + only_one_txt);
        console.log("no_text -" + no_text);
        console.log(this.rootshape.text_array);
        
      this.col_width = [];
      this.row_height = [];
      //Set rowindex Adding
        if (!no_text) {
          //Populate initial value and its width and height
            this.rootshape.text_array.forEach( (row_item, roi) => {
                if (this.row_height[roi] === undefined) { this.row_height.push([]);};
                if (this.row_textbox[roi] === undefined) { this.row_textbox.push([]); };
               
                
                row_item.forEach( (col_item: any, coi: number) => {
                    if (this.col_width[coi] === undefined) { this.col_width.push([]); };
                    // populate row_textbox values
                      let in_tmp_val_cpy = JSON.parse(JSON.stringify(in_tmp_val));
                      in_tmp_val_cpy.r_ind = roi;
                      in_tmp_val_cpy.c_ind = coi;                  
                      in_tmp_val_cpy.txt_align = only_one_txt ? "middle": "start";                  
                      in_tmp_val_cpy.textval = col_item.textval;
                      console.log("in_tmp_val_cpy.textval = = " + in_tmp_val_cpy.textval);
                      let { tmp_txt_w, tmp_txt_h } = this.get_text_wh(in_tmp_val_cpy.textval);
                      console.log("tmp_txt_w - ",tmp_txt_w);
                      console.log("tmp_txt_h - ", tmp_txt_h);
                      in_tmp_val_cpy.txt_w = tmp_txt_w;
                      in_tmp_val_cpy.txt_h = tmp_txt_h;
                      console.log("in_tmp_val_cpy.txt_w - ",in_tmp_val_cpy.txt_w);
                      console.log("in_tmp_val_cpy.txt_h - ", in_tmp_val_cpy.txt_h);

                      this.row_textbox[roi].push(in_tmp_val_cpy);


                    // populate row and col values to get max w and h
                      this.col_width[coi].push(tmp_txt_w);
 
                      this.row_height[roi].push(tmp_txt_h);

                       

            })
            });


          console.log("row_height");
          console.log(this.row_height);
          console.log( "col_width");
           console.log( this.col_width);

          //Calculate max width & height
            this.col_width.forEach( (roit) => {
                //let max_w_a = Math.min(Math.max(...roit),20);
                let max_w_a = Math.max(...roit);
                this.max_col_width.push(max_w_a);
            });

            this.row_height.forEach( (roit) => {
                let max_h_a = Math.min(Math.max(...roit),15);
                this.max_row_height.push(max_h_a);
            });

          console.log("max_col_width - ");
            console.log( this.max_col_width);
          console.log("max_row_height - " );
           console.log( this.max_row_height);


          //reCalculate each text item to fit with max width & height            
            this.row_textbox.forEach( (row_item, roi) => {
                row_item.forEach( (col_item: any, coi: any) => {
                    col_item.txt_w = this.max_col_width[coi];
                    col_item.txt_h = this.max_row_height[roi];
            })
            });



          //Calculate parent element width and Height
            let bas_t_w = (<any>(<LeafShape>this.rootshape).baseshape).width;
            let bas_t_h = (<any>(<LeafShape>this.rootshape).baseshape).height;
            let t_w, t_h = 0;

            t_w = this.max_col_width.reduce((accumulator, currentValue) => accumulator + currentValue);
            t_h = this.max_row_height.reduce((accumulator, currentValue) => accumulator + currentValue);

            t_w = t_w + this.margin_left + (((this.max_col_width.length)-1)*this.column_gap) + this.margin_right;
            t_h = t_h + this.margin_top + (((this.max_row_height.length)-1)*this.row_gap) + this.margin_bottom;

          console.log("bas_t_w - " + bas_t_w);
          console.log("bas_t_h - " + bas_t_h);
          console.log("t_w - " + t_w);
          console.log("t_h - " + t_h);

            t_w = Math.max(t_w,bas_t_w);
            t_h = Math.max(t_h,bas_t_h);

                      //console.log("final t_w - " + t_w);
          //console.log("final t_h - " + t_h);
 
          //set parent w,h to Calculated parent's element width and Height
          (<any>(<LeafShape>this.rootshape).baseshape).width = t_w;
          (<any>(<LeafShape>this.rootshape).baseshape).height = t_h;
 

          //Calculate adjustment factors
            this.row_textbox.forEach( (row_item, roi) => {
                row_item.forEach( (col_item: any, coi: number) => {
                  //First Row
                    if(roi === 0) {
                      //First column
                      if( coi === 0) {
                      //Have only one row and one column
                        console.log("inside one row and one column");
                        if(only_one_txt) {     
                          console.log(<LeafShape>this.rootshape);
                          console.log(col_item);
                          col_item.x_adj = (<any>(<LeafShape>this.rootshape).baseshape).width/2;
                          col_item.y_adj = (<any>(<LeafShape>this.rootshape).baseshape).height/2;
                          col_item.txt_align = "middle";
                          console.log(col_item.x_adj);
                          console.log(col_item.y_adj);
                        } else {
                          col_item.x_adj = this.margin_left;
                          col_item.y_adj = this.margin_top;
                          col_item.txt_align = "start";
                        }
                        //First Row but NOT First column
                      } else {
                          col_item.x_adj = this.row_textbox[roi][coi-1].x_adj + this.row_textbox[roi][coi-1].txt_w + this.column_gap;
                          col_item.y_adj = this.margin_top;
                          col_item.txt_align = "start";
                      }
                      ////NOT First Row
                    } else {
                          col_item.x_adj = this.row_textbox[roi-1][coi].x_adj;
                          col_item.y_adj = this.row_textbox[roi-1][coi].y_adj + this.row_textbox[roi-1][coi].txt_h + this.row_gap;
                          col_item.txt_align = "start";
                      }
            })
            });
        
   

        //Since this is init reDraw base and DRAW text elements
        //console.log("-----");
        //console.log((<LeafShape>this.rootshape));
        //console.log("-----");
          (<any>(<LeafShape>this.rootshape).baseshape).redraw();

            this.row_textbox.forEach( (row_item, roi) => {
                row_item.forEach( (col_item: any, coi: any) => {
                    this.draw_text_ele(col_item);
            })
            }); 

        }
    }

  
    text_modified() {
      let gr_id = (<LeafShape>this.rootshape).groupid;
      let text_tmp = d3.select(gr_id).selectAll("text").remove();
      this.row_textbox = [];
      //consoele.log("dkdkdkdk");
      
      this.init_text();
      /*
      console.log(this);
      (<LeafShape>this.rootshape).myroot[0].mvg_obj =(<LeafShape>this.rootshape).myroot[0];
      let uu =  (<LeafShape>this.rootshape).myroot[0].baseshape.movingstart();
      let xx = (<LeafShape>this.rootshape).myroot[0].baseshape.moving(this.rootshape.myroot[0].x,this.rootshape.myroot[0].y);
      */
      
    }


    get_text_wh(textval: string) {
      let textleaf_tmp = d3.select("#rough")
                  .append("text")
                  .attr("x",0)
                  .attr("y",0)
                  .text(textval);
      let tmp_width, tmp_height = 0;

      //console.log(textleaf_tmp);
      textleaf_tmp ? tmp_width = Math.max(this.default_txt_b_width,(<any>textleaf_tmp).node().getBBox().width): tmp_width = this.default_txt_b_width;
      textleaf_tmp ? tmp_height = Math.max(this.default_txt_b_height,(<any>textleaf_tmp).node().getBBox().height): tmp_height = this.default_txt_b_height;
      textleaf_tmp.remove();
      return ({"tmp_txt_w": tmp_width, "tmp_txt_h": tmp_height });
    }


   private draw_text_ele(tb:any) {

      let gr_id = (<LeafShape>this.rootshape).groupid;
      let r_x = (<LeafShape>this.rootshape).get_x();
      let r_y = (<LeafShape>this.rootshape).get_y();

      let text_tmp = d3.select(gr_id)
                    .append("text")
                    .attr("id","text_"+tb.r_ind+"_"+ tb.c_ind)
                    .attr("width",tb.txt_w)
                    .attr("height",tb.txt_h)
                    .attr("x",r_x+tb.x_adj)
                    .attr("y",r_y+tb.y_adj)
                    .attr("font-family", tb.fontfamily)
                    .attr("font-size", tb.fontsize)
                    .attr("fill", tb.fill)
                    .attr("font-weight", tb.fontweight)
                    .text(tb.textval)
                    .style("text-anchor",tb.txt_align)
                    .style("alignment-baseline","middle");
      tb.myTleaf = text_tmp;

    }

  public txt_moving(x:number,y:number) {

      this.row_textbox.forEach( (row_item, roi) => {
          row_item.forEach( (col_item: any, coi: any) => {
              col_item.myTleaf.attr("x",x + col_item.x_adj)
                              .attr("y",y + col_item.y_adj)
      })
      });
  }

/*
      //Have only one row and one column
        if (!no_text && only_one_txt) {



            let { tmp_txt_w, tmp_txt_h } = this.get_text_wh(in_tmp_val.textval);
            
            let tmp_cl_w = [];
            let tmp_cl_h = [];
            this.col_width.push(tmp_cl_w.push(tmp_txt_w));
            this.row_height.push(tmp_cl_h.push(tmp_txt_h));
            this.max_col_width.push(tmp_txt_w);
            this.max_row_height.push(tmp_txt_h);

            let { tmp_txt_mw, tmp_txt_mh } = this.get_max_width_height(in_tmp_val,0,0);

            in_tmp_val.txt_w = tmp_txt_w;
            in_tmp_val.txt_h = tmp_txt_h;

            this.row_textbox[0].splice(0,0,);
        }
        


            if (this.row_textbox[ri] === undefined) { this.row_textbox[ri] = []; };
            this.row_textbox[ri].splice(ci,0,in_tmp_val);      
    }
    

  



    add_row_text(textval: string, groupid: string, align: string = "", ci: number = 0,ri: number = 0 ) {
      //console.log("test add text row");
      //console.log(textval);
      //console.log(groupid);
      //console.log(align);
      //console.log(ci);
      //console.log(ri);

      let { tmp_txt_w, tmp_txt_h } = this.get_text_wh(textval);
      //console.log(tmp_txt_w);
      //console.log(tmp_txt_h);
      let { tmp_x, tmp_y, tmp_align } = this.get_adj_val(this.row_textbox,ci,ri,tmp_txt_w,tmp_txt_h);
      //console.log(tmp_x);
      //console.log(tmp_y);
      //console.log(tmp_align);
      let tt = this.draw_text(tmp_x,tmp_y,tmp_txt_w,tmp_txt_h,textval,groupid,tmp_align,ci,ri);

    }




   get_adj_val(xxx_textbox,ci,ri,tmp_txt_w,tmp_txt_h) {
      let x, y = 0;
      let align = "";

      let isempty_txl: boolean;
            //console.log("get_adj_val START");      
      xxx_textbox[ci] === undefined || xxx_textbox[ci].x_adj === undefined  ? isempty_txl = true: isempty_txl = false;

   
        if (this.row_textbox[ri] === undefined) { 
            //console.log("row to operate doesn't exist"); 
            if (this.row_textbox.length) {
                    //console.log("has other rows already");
                    if (this.row_textbox.length === ri) {
                        //console.log("New row is the next to existing MAX row of other existing rows");
                        //Get previous rows data
                        x = this.row_textbox[ri-1][ci].x_adj ;
                        y = this.row_textbox[ri-1][ci].y_adj + this.row_textbox[ri-1][ci].txt_h + this.row_gap;
                        align = "start"
                    }


            } else {
              //console.log("has NO other rows");
              /*  SDAFASDF 


                    let mast_w = Math.max((<LeafShape>this.rootshape).baseshape.width,(tmp_txt_w + this.margin_left + this.margin_right));

                    let mast_h = Math.max((<LeafShape>this.rootshape).baseshape.height,(tmp_txt_h + this.margin_top + this.margin_bottom));

                    (<LeafShape>this.rootshape).baseshape.width = mast_w;
                    (<LeafShape>this.rootshape).baseshape.height = mast_h;
                    (<LeafShape>this.rootshape).baseshape.redraw();

                    x = (<LeafShape>this.rootshape).baseshape.x + (mast_w/2);
                    y = (<LeafShape>this.rootshape).baseshape.y + (mast_h/2);

                    align = "middle";
            
                }
        } else {
          if (this.row_textbox[ri][ci] === undefined) {
            //console.log("row exist but column to operate doesn't exist");
            //Adding a new item in a row
              let mast_w = Math.max((<LeafShape>this.rootshape).baseshape.width,((<LeafShape>this.rootshape).baseshape.width + tmp_txt_w + this.column_gap));

              let mast_h = Math.max((<LeafShape>this.rootshape).baseshape.height,(tmp_txt_h + this.margin_top + this.margin_bottom));

             (<LeafShape>this.rootshape).baseshape.width = mast_w;
             (<LeafShape>this.rootshape).baseshape.height = mast_h;
              (<LeafShape>this.rootshape).baseshape.redraw();

              if (ri === 0) {
                this.row_textbox[ri][ci-1].x_adj = (<LeafShape>this.rootshape).baseshape.x + this.margin_left;
                this.row_textbox[ri][ci-1].y_adj = (<LeafShape>this.rootshape).baseshape.y + this.margin_top;
              } else {
                
                if (ci === 0) {
                  this.row_textbox[ri][ci-1].x_adj = (<LeafShape>this.rootshape).baseshape.x + this.margin_left;
                } else {
                  this.row_textbox[ri][ci-1].x_adj =  this.row_textbox[ri][ci-1].x_adj;
                }               
                
                let ds = [];
                this.row_textbox[ri-1].forEach((t) => {
                      ds.push(t.txt_h);
                });
                //console.log("%%%%$$");
                //console.log(ds);
                let tmp_max_h = Math.max(...ds);                
                //console.log(tmp_max_h);
                this.row_textbox[ri][ci-1].y_adj = this.row_textbox[ri-1][ci-1].y_adj + tmp_max_h;
              }

              
              
              this.row_textbox[ri][ci-1].txt_align = "start";
              let tt = this.re_draw_text(this.row_textbox[ri][ci-1]);

              x = this.row_textbox[ri][ci-1].x_adj + this.row_textbox[ri][ci-1].txt_w + this.column_gap;
              y = this.row_textbox[ri][ci-1].y_adj;
                            
              align = "start"


          }

        }

        /*
        //new column
        ////console.log(ci <= (this.row_textbox.));
        //find out total columns
        //let mast_w_1 = this.row_textbox;
        let mast_w_1 = Math.max((<LeafShape>this.rootshape).baseshape.width,tmp_txt_w)
        //console.log(mast_w);
        let mast_h = Math.max((<LeafShape>this.rootshape).baseshape.height,tmp_txt_h)
        //console.log(mast_h);
        //console.log("x - ", mast_h/2);
        //console.log("y - ", mast_w/2);
        //console.log("$$$$------------------");


      //console.log(isempty_txl);
      if (!isempty_txl) {
          x = xxx_textbox[ci].x_adj;
          y = xxx_textbox[ci].y_adj;

          xxx_textbox.forEach( (tb,i) => {                                             
                                            if (i >= ci) {
                                                xxx_textbox[i].x_adj += (tmp_txt_w + this.row_gap);
                                                //xxx_textbox[i].y_adj = y;  
                                            }
                                        });
      } else {
              //console.log("kdkdkkdkkd");
              //console.log(this.rootshape);
          if (ci === 0) {
              x = this.rootshape.x + this.margin_right;
              y = this.rootshape.y + this.margin_top;
          } else {
              x = xxx_textbox[ci-1].x_adj + tmp_txt_w + this.row_gap;
              y = xxx_textbox[ci-1].y_adj;
          }

      }
  
      //console.log({"tmp_x": x, "tmp_y": y});
      //x = x - (this.row_gap) + (this.margin_left);
      //console.log("get_adj_val END");      
      return ({"tmp_x": x, "tmp_y": y, "tmp_align" : align});
    }


 

    private draw_text(tmp_x_adj,tmp_y_adj,tmp_txt_w,tmp_txt_h,textval,groupid,align,ci,ri,isredraw = false) {
      
      if (!isredraw) {
            //console.log("inside draw not red_draw" );
            //console.log(tmp_x_adj);
            //console.log(tmp_y_adj);
            let text_tmp = d3.select(groupid)
                          .append("text")
                          .attr("id","text_"+ri+"_"+ci)
                          .attr("width",tmp_txt_w)
                          .attr("height",tmp_txt_h)
                          .attr("x",tmp_x_adj)
                          .attr("y",tmp_y_adj)
                          .text(textval)
                          .style("text-anchor",align)
                          .style("alignment-baseline","middle");

          let in_tmp_val = {
              "x_adj" : tmp_x_adj,
              "y_adj" : tmp_y_adj,
              "txt_w" : tmp_txt_w,
              "txt_h" : tmp_txt_h,
              "txt_align" : align,
              "textval" : textval,
              "textleaf" : text_tmp
          };
        //arr.splice(2, 0, "Lene");
            if (this.row_textbox[ri] === undefined) { this.row_textbox[ri] = []; };
            this.row_textbox[ri].splice(ci,0,in_tmp_val);
      } 
    }

  private re_draw_text(textbox) {
    //console.log("inside red_draw" );
    //console.log(textbox);
                        let text_tmp = textbox.textleaf
                          .attr("width",textbox.txt_w)
                          .attr("height",textbox.txt_h)
                          .attr("x",textbox.x_adj)
                          .attr("y",textbox.y_adj)
                          .text(textbox.textval)
                          .style("text-anchor",textbox.txt_align)
                          .style("alignment-baseline","middle");

  }
  */

}

  




/*
Text box data to be sent from calling function
{
  margin_left: 20;
  margin_right: 20;
  margin_top: 20;
  margin_bottom: 20;
  row_gap: 10;
  column_gap: 10;
  calc_width: number;
  calc_height: number;
  row_textbox: [{   myrootshape : <LeafShape>{};
                    x_adj: number;
                    y_adj: number;
                    txt_w: number;
                    txt_h: number;
                    textval: string;
                    textleaf: any;
                 },
                 {  myrootshape : <LeafShape>{};
                    x_adj: number;
                    y_adj: number;
                    txt_w: number;
                    txt_h: number;
                    textval: string;
                    textleaf: any;
                 },

               ],
  col_textbox: [{   myrootshape : <LeafShape>{};
                    x_adj: number;
                    y_adj: number;
                    txt_w: number;
                    txt_h: number;
                    textval: string;
                    textleaf: any;
                 },
                 {  myrootshape : <LeafShape>{};
                    x_adj: number;
                    y_adj: number;
                    txt_w: number;
                    txt_h: number;
                    textval: string;
                    textleaf: any;
                 },

               ]
}

*/

export abstract class LeafShape {

    public x: number;
    public y: number;
    public myroot : LeafShape[];
    public textshape : LeafShape[];
    public parentshape : LeafShape;
    public baseshape : LeafShape;
    public childshape : LeafShape[];
    public x_adjust_factor: number;
    public y_adjust_factor: number;
    public mybaseleaf: any;
    /* We can store both plug and outport like below so it accomodate any connectors in future
    // inside outport we should split them as per X location[]
      { 
        outport : Leafshape[],
        inport  : Leafshape[],
        outplug : Leafshape[],
        inplug  : Leafshape[],
      }
    */
    public connect_ports : any; 
    //public textleaf: text_conf;
    public iammoving: boolean;
    public leafs_with_drag: LeafShape[];
    public drag_disabled: boolean;
    public drag_func_call : any[];
    public text_array : any[];
    public text_obj: TextLeaf;
    public groupid: string;
    public mvg_obj: LeafShape;
    public chart_obj : any;
    public path_obj : any;
    public leafs_con_cnt: any;
    public con_start_obj: LeafShape;
    public working_on_con : Connectors;
    public bucket_num: number;  
    public bucket_ele__indx: number; 
    public fill: string;
    public stroke: string;
    public stroke_width: number;
    public data: any;
    //public shapeconf: any;
    public ismould: boolean;
    public click_event_code: string;
    
    
    

    constructor(x:number,y:number, prntshape:any, groupid: string, ta: any[], chartobj = {}, d: any = {}, sconf: any = {}) {
      this.x = 0;
      this.y = 0;
      this.iammoving = false;
      this.x_adjust_factor = 0;
      this.y_adjust_factor = 0;
      this.textshape = [];
      this.childshape = [];
      this.myroot = [];
      this.parentshape = <LeafShape>{};
      this.baseshape = <LeafShape>{};
      this.leafs_with_drag = [];
      this.drag_disabled = true;
      this.drag_func_call = [null,null,null];
      this.text_obj = <TextLeaf>{};
      this.groupid = groupid;      
      this.chart_obj = {};      
      this.connect_ports = {};
      this.text_array=[];
      this.bucket_num = -1;
      this.bucket_ele__indx  = -1;

      this.fill =  "#FFE4C4";
      this.stroke = "#DAA520";
      this.stroke_width = 2;

     // Connector related properties
      this.leafs_con_cnt = 0;
      this.path_obj = [];
      this.con_start_obj = <LeafShape>{};
      this.mvg_obj = <LeafShape>{};
      this.working_on_con = <Connectors>{};
      // Connector related properties
      this.data = d;
      //this.shapeconf = sconf;
      this.ismould = false;          
      if(this.data.hasOwnProperty("data") ) {
        console.log(this.data.data);
        console.log(this.data.data.hasOwnProperty('shapeconf'));  
        if (this.data.data.hasOwnProperty('shapeconf')){
          console.log(this.data.data.shapeconf.hasOwnProperty('shptype'));
          if (this.data.data.shapeconf.hasOwnProperty('shptype')){
            console.log(this.data.data.shapeconf.shptype);
            if (this.data.data.shapeconf.shptype === "mould") {
              this.ismould = true;
            }
          }      
        }
      }
      //Click event
      this.click_event_code = "";

      let nx = x;
      let ny = y;
      if (prntshape !== null) { // If parentshape is NOT null then x & y are adjx, adjy values
        this.parentshape = <LeafShape>prntshape;
        this.x_adjust_factor = x;
        this.y_adjust_factor = y;
        nx = this.parentshape.get_x();
        ny = this.parentshape.get_y();
        console.log(this);
      } else  {
        // TEXT can be added only to the 1st root element
        //console.log("super super");
        this.text_array = ta;
        this.text_obj = new TextLeaf(this);
        this.chart_obj = chartobj;
      }
      this.set_x(nx);
      this.set_y(ny);
      this.set_myroot();

      if (prntshape !== null && d !== undefined) {
        console.log(d);
        console.log(this.data);
        console.log("dddddddppppppps");
        d["obj"] = prntshape.myroot[0];
      } else if (prntshape === null && d !== undefined) {
        d["obj"] = this;
      }

    }
    
    ///////  CREATE SHAPES : start   ///////
    // set the base shape here
    // set the adjustment factor for child shapes
    public abstract create():void;  
    ///////  CREATE SHAPES : end   ///////

    public abstract size_calc(): void;

    movingstart() {
        console.log("movingstarted");
        console.log(this);
        this.myroot[0].chart_obj.moving_leaf = this;
        if(!(this.iammoving && this.drag_disabled)) {
          if (this.drag_func_call[0] !== null ) {
              //console.log("hahastartmoving")
              //console.log(this);
              console.log("kskskd");
              if (this.drag_func_call[0] === "Connectors") {
                  let new_con_instance = <Connectors>this.myroot[0].chart_obj.getInstance(this.drag_func_call[0],this.con_start_obj);
                  this.mvg_obj = new_con_instance.end_obj;
                  //this.myroot[0].path_obj.push(new_con_instance);
                  this.working_on_con = new_con_instance;
              }
          }
          else if (this.drag_func_call[1] !== null) { 
            let mxstt = this.drag_func_call[1](this);
            this.mvg_obj = mxstt;
          } else {
            this.mvg_obj = this;
          }
          //this.iammoving = true;
          this.mvg_obj.iammoving = true;
          
        } else {
          console.log("Do nothing");
          //Don't do anything
        }
    }

    movingend(x:number,y:number) {
        console.log("Moving end");
        console.log(!(this.iammoving && this.drag_disabled));
        if(!(this.iammoving && this.drag_disabled)) {
          console.log(this.drag_func_call[3]);
            if (this.drag_func_call[0] !== null ) {
                //console.log("hahaendmoving")
                //this.drag_func_call[0].movingend(this);
                if (this.drag_func_call[0] === "Connectors") {
                this.working_on_con.movingend();
                this.working_on_con = <Connectors>{};
                this.mvg_obj =  <LeafShape>{};
                }
            }
            else if (this.drag_func_call[3] !== undefined) { 
                 if (this.drag_func_call[3] !== null) { 
                    console.log("iiiii");
                    let mxstt = this.drag_func_call[3](this);
                    this.mvg_obj =  <LeafShape>{};
                  }
            }
            let moving_obj = this.isemptyobject(this.mvg_obj)? this : this.mvg_obj;
            moving_obj.iammoving = false;
            this.mvg_obj =  <LeafShape>{};

        } else {
          //Don't do anything          
        }

        //Recalculate root nodes bucket
        //"g#leaf_Eve"
            console.log("movingend");
            console.log(this);
        if (this.ismould) {
          this.myroot[0].chart_obj.push_leaf("sidemenu_area",this);
        } else {
          this.myroot[0].chart_obj.push_leaf("draw_area",this);
        }
        
        //this.myroot[0].chart_obj.
        this.myroot[0].chart_obj.moving_leaf= <LeafShape>{};

        //Change related to save chart data
        //Update the latest position of the Leaf. Raw data in chart object updated : START
        this.myroot[0].data.data.x = this.myroot[0].get_x();
        this.myroot[0].data.data.y = this.myroot[0].get_y();
        //Update the latest position of the Leaf. Raw data in chart object updated : END

    }

 public moving(x:number,y:number): void
    {
        //console.log("---ui am moving");
      console.log(this);
      console.log(this.mvg_obj);
      let moving_obj = this.isemptyobject(this.mvg_obj)? this : this.mvg_obj;
      console.log("insidinv moving");
        console.log((!(moving_obj.iammoving && moving_obj.drag_disabled)));
        if(!(moving_obj.iammoving && moving_obj.drag_disabled)) {

         if(!this.isemptyobject(moving_obj.parentshape) && moving_obj.parentshape.baseshape === moving_obj && moving_obj.iammoving && this.isemptyobject(moving_obj.parentshape.parentshape)) {
              // SCENARIO WHERE the moving element is the BASE of the ROOT
              // I have parent (THAT IS THE LAST CHAIN OF PARENT in up direction) and i am the base shape for the parent and i am moving, so i am responsible to update parents x, y
              // so all childs can allign with parent including me
              // After updating parent with lateset x,y position i better allign with my parent
                       
              moving_obj.parentshape.set_x(x);
              moving_obj.parentshape.set_y(y);
              moving_obj.set_x(x);
              moving_obj.set_y(y);

        } else if(!this.isemptyobject(moving_obj.parentshape) && moving_obj.parentshape.baseshape === moving_obj && moving_obj.iammoving && !this.isemptyobject(moving_obj.parentshape.parentshape)) {
              // SCENARIO WHERE the moving element is the BASE of any SUB CLASS OF SUB ELEMENT of ROOT
              // I have parent (THAT IS THE LAST CHAIN OF PARENT in up direction) and i am the base shape for the parent and i am moving, so i am responsible to update parents x, y
              // so all childs can allign with parent including me
              // After updating parent with lateset x,y position i better allign with my parent
              
              moving_obj.parentshape.x = x;
              moving_obj.parentshape.y = y;
              moving_obj.set_x(x);
              moving_obj.set_y(y);
        
        } else if (!this.isemptyobject(moving_obj.parentshape) && !moving_obj.iammoving) {
              // SCENARIO WHERE the element is the CHILD of the moving BASE ELEMENT which of any SUB ELEMENT or BASE element of ROOT
              // I have parent but i am moving because of some one, so i should not pollut parents x, y
              // Since some one is moving me i better allign with my parent
              
              moving_obj.set_x(x);
              moving_obj.set_y(y);
          }
          else  if(!this.isemptyobject(moving_obj.parentshape) && moving_obj.parentshape.baseshape !== moving_obj && moving_obj.iammoving) {
              // SCENARIO WHERE the moving element is the BASE of any SUB ELEMENT OF ROOT
              // I have parent and i am NOT the base shape for the parent but i am moving, so i should not pollut parents x, y
              // update my self only.  Since iam keeping me updated my childs will follow me
              moving_obj.x = x;
              moving_obj.y = y;
        } 

        this.do_move_bare(moving_obj);
        /*
        if (this.isemptyobject(moving_obj.baseshape) && moving_obj.childshape.length===0 ) {
            
            moving_obj.moving_bare();
            if (moving_obj.parentshape.baseshape === moving_obj) {
                moving_obj.parentshape.childshape.forEach( le => { if(le!==moving_obj) {le.moving(moving_obj.get_x(),moving_obj.get_y())};});
                let sdcr;
               ((moving_obj.parentshape.text_obj.row_textbox !== undefined) && (moving_obj.parentshape.text_obj.row_textbox.length>0))?moving_obj.parentshape.text_obj.txt_moving(moving_obj.get_x(),moving_obj.get_y()): sdcr="";
            }
            
          } else {            
            moving_obj.baseshape.moving(moving_obj.get_x(),moving_obj.get_y());
        }
        */

        // Move Connectors
          if(moving_obj.iammoving){
            this.do_move_connectors();
            /*
              console.log("&$&$&$&");
              console.log(this);
              console.log(this.myroot[0].path_obj.length > 0);
          if(this.myroot[0].path_obj.length >0) {
            this.myroot[0].path_obj.forEach(
              (pob: Connectors) => {                  
                  console.log(pob);
                  pob.path_maintenance();
              })
          }
          */
          }

          //Call the drag callback
          //console.log("indise path movingmain");
          //console.log(this.drag_func_call);
          //console.log(moving_obj.iammoving);
          if (this.drag_func_call[0] !== null && moving_obj.iammoving) { 
            //this.drag_func_call[0].moving(this);
              this.working_on_con.moving();

          } else if (this.drag_func_call[2] !== null) {
            this.drag_func_call[2](moving_obj);
          }
            //this.mvg_obj = mxsttm;
      } else { 
          //Don't do anything     
      }  
    }

    public abstract moving_bare():void;

    // Recalculate the adj factor after any change in size of the base element
    public abstract recalc_adj_factor():void;
    
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
      
      if(obj !== undefined) {
        if ((Object.keys(obj).length === 0 && obj.constructor === Object)) {
          return true;
        }
      }  
      return false;    

    }

    add_connector_function(con_start_obj: LeafShape,classname: string,funs:any[]) {
      
      let xe = this.add_drag_forbase();
      this.con_start_obj=con_start_obj;

      //console.log(this);
      //console.log(xe);
      //console.log("44444");
      //let xe1 = this.myroot[0].chart_obj.getInstance(classname,xe);
      this.drag_func_call = [classname,...funs];    
    }

    add_drag_on_cpy_forbase(funs:any[]) {
      this.add_drag_forbase();      
      this.drag_func_call = [null,...funs];    
    }

   add_drag_forbase() {
           //console.log("------groupid-------");

     //console.log(this);
           //console.log("------groupid-------");

    // This adds the drag behaviour for the first BASE ELEMENT in the called object
    if (typeof(this.mybaseleaf) === "undefined" && (!this.isemptyobject(this.baseshape))) {
      this.baseshape.add_drag_forbase();
    } else if (typeof(this.mybaseleaf) !== "undefined" && (this.isemptyobject(this.baseshape))) {
        this.mybaseleaf
                      //.attr("fill","yellow")
                      //.raise()
                        .call(d3.drag()
                            .on("start", () => this.movingstart())
                            .on("drag", () => this.moving(d3.event.x,d3.event.y))
                            .on("end", () => this.movingend(d3.event.x,d3.event.y))
                            );
                            //console.log("kdkdkdk");
                            //console.log(this);
        this.drag_disabled = false;
        return this;
        /* Logic to bring this to the root
        this.myroot[(this.myroot.length)-2].leafs_with_drag.push(this);
        this.set_mydrags();
        */
    }
  }

    set_click_event(ev: event_name) {

      if (typeof(this.mybaseleaf) === "undefined" && (!this.isemptyobject(this.baseshape))) {
          this.baseshape.set_click_event(ev);
      } else if (typeof(this.mybaseleaf) !== "undefined" && (this.isemptyobject(this.baseshape))) {
          this.mybaseleaf.click_event_code = ev.event_code;
          this.mybaseleaf.on("click",(d: any)=> { console.log(this.click_event_code); this.myroot[0].chart_obj.click_calbk({"even":"click","event_code":this.mybaseleaf.click_event_code,"data":{"d":d}});
                          });
          
      }
  }


/*
    
   calc_text_d(txt_ele: LeafShape,prnt: LeafShape) {

      if(txt_ele.bs_sh === "C") {
          txt_ele.textval.length ? 
                    txt_ele.txt_w = Math.max(txt_ele.txt_w,(txt_ele.txt_shp.node().getBBox().width)): 
                    txt_ele.txt_w;       

          txt_ele.textval.length ? 
                    txt_ele.txt_h = Math.max(txt_ele.txt_h,(txt_ele.txt_shp.node().getBBox().height)): 
                    txt_ele.txt_h;

          (<base_circle_leaf>prnt.baseshape).radius = Math.max(txt_ele.txt_w/2,txt_ele.txt_h/2);

      } else if(txt_ele.bs_sh === "R") {
          txt_ele.textval.length ? 
                    txt_ele.txt_w = Math.max(txt_ele.txt_w,(txt_ele.txt_shp.node().getBBox().width)): 
                    txt_ele.txt_w;       

          txt_ele.bs_sh.textval.length ? 
                    txt_ele.txt_h = Math.max(txt_ele.txt_h,(txt_ele.txt_shp.node().getBBox().height)): 
                    txt_ele.bs_sh.txt_h;

          (<base_rect_leaf>prnt.baseshape).width = Math.max((<base_rect_leaf>prnt.baseshape).width,txt_ele.txt_w);

          (<base_rect_leaf>prnt.baseshape).height = Math.max((<base_rect_leaf>prnt.baseshape).height,txt_ele.txt_h);
      }


  }
    
    


  set_mydrags() {
    
    let mydr = [];
    
    this.myroot[0].childshape.forEach( ch => {
                                if( ch.leafs_with_drag.length) {
                                      ch.leafs_with_drag.forEach (cha => {
                                          if (!this.object_in_array(mydr,cha)) {
                                            mydr.push(cha);
                                          };
                                        })
                                };

    });
    if (this.myroot[0].baseshape.leafs_with_drag.length) { mydr.push(this.myroot[0].baseshape.leafs_with_drag); }
    if (mydr.length) { mydr.forEach( ee => this.myroot[0].leafs_with_drag.push(ee)); };
  }

  */

  object_in_array (tar_array: any, element: any) {
      let found = false;
      tar_array.forEach( (tar: any) => {if(tar === element){found = true;}} );
      return found;
  }

  set_myroot() {  //To be called AFTER CUSTOM SHAPE CREATE method
    this.myroot = [];
    if (!this.isemptyobject(this.parentshape)) {
      //console.log(this);

          if(this.parentshape.myroot.length) {
              this.parentshape.myroot.forEach( pr =>  this.myroot.push(pr));                  
          }
    }  
    this.myroot.push(this);
    if(this.childshape.length) {
        this.childshape.forEach ( ch => ch.set_myroot());
    }
  }

  get_path_id() {
    return this.leafs_con_cnt += 1;
  } 

  text_modify() {
    //myroot[0] is taken to ensure tex is added only to the top most element
    //This modifes the base shape that holds the text
    this.myroot[0].text_obj.text_modified();
    //This modifes the adj factor based on the new size after text modification
    this.myroot[0].do_adj_recalc();
    console.log("after recalc modify");
    //This moves the base shapes to the new postion based on the new adj values
    this.myroot[0].do_move_bare(this);
    console.log("after movebare ");
    //This moves the connectors based on the leafs new size and child positions
    this.do_move_connectors();
  }

  do_adj_recalc() { 
      this.recalc_adj_factor();
      this.childshape.forEach( le => { le.recalc_adj_factor();});    
  }

  do_move_bare(mv_ba_obj: LeafShape) {    
    if (this.isemptyobject(mv_ba_obj.baseshape) && mv_ba_obj.childshape.length===0 ) {
        mv_ba_obj.moving_bare();
        if (mv_ba_obj.parentshape.baseshape === mv_ba_obj) {
            mv_ba_obj.parentshape.childshape.forEach( le => { if(le!==mv_ba_obj) {le.moving(mv_ba_obj.get_x(),mv_ba_obj.get_y())};});
            let sdcr;
            ((mv_ba_obj.parentshape.text_obj.row_textbox !== undefined) && (mv_ba_obj.parentshape.text_obj.row_textbox.length>0))?mv_ba_obj.parentshape.text_obj.txt_moving(mv_ba_obj.get_x(),mv_ba_obj.get_y()): sdcr="";           
        }
    } else {            
        mv_ba_obj.baseshape.moving(mv_ba_obj.get_x(),mv_ba_obj.get_y());
    }
  }




  do_move_connectors() {
      console.log("&$&$&$&");
      console.log(this);
      console.log(this.myroot[0].path_obj.length > 0);
  if(this.myroot[0].path_obj.length >0) {
    this.myroot[0].path_obj.forEach(
      (pob: Connectors) => {                  
          console.log(pob);
          pob.path_maintenance();
      })
  }
          
  }

  

}


export class base_rect_leaf_w_text extends LeafShape {

  width: number;
  height: number;
  mytext: any;  


  constructor(x:number,y:number, prntshape:any, groupid:string, w: number,h: number) {
    super(x,y,prntshape,prntshape.groupid,[[""]]);
    this.width = w;
    this.height = h;
    //this.myroot = this;
    this.create();
  }

  create() {
    console.log("tttttt");
console.log(this.groupid);
//console.log(d3.select("#leaf_Eve"));
  console.log(d3.select("g#sleaf_pandas_read_csv"));
    //console.log("tttttt");
      this.mybaseleaf = d3.select(this.groupid)
                      .append("rect")
                      .attr("width",this.width)
                      .attr("height",this.height)
                      .attr("x",this.get_x())
                      .attr("y",this.get_y())
                     // .attr("fill-opacity",0.5)
                      ;
                      this.mybaseleaf.raise();
      //Add an empty text                      
      //this.add_text(4,4,'','green');
  }

  add_text(adj_t_x: number = 0,adj_t_y: number = 0,text_val: string = '',fill_clr: string = 'white') {
      console.log("Text mv");
      console.log(this);
      console.log(this.get_y());
      console.log("Text mv");
      //if ((this.isemptyobject(this.mytext))) {
        if(this.mytext != undefined) {
          this.mytext.attr("x",this.get_x()+5)
                      .attr("y",this.get_y()+7)
                      .text(text_val)
                      .style("fill", fill_clr);
      } else {
          this.mytext = d3.select(this.groupid)
                    .append("text")
                    .attr("id",this.groupid+"_base_text")
                    .attr("x",this.get_x()+adj_t_x)
                    .attr("y",this.get_y()+adj_t_y)
                    .text(text_val)
                    .style("fill", fill_clr)
                    .attr("font-weight", 600)
                    .style("font", "1px")
                    //.style("text-anchor","middle")
                    .style("alignment-baseline","middle")
                    .style("cursor", "pointer");
      }
  }

  moving_bare() {
    //console.log("ii moving bare text leaf");
    //console.log(this);
    this.mybaseleaf.attr("x", this.get_x())
               .attr("y", this.get_y());
    
    if (this.mytext != undefined) {
      this.mytext.attr("x",this.get_x()+5)
                    .attr("y",this.get_y()+7)
    }
  }

recalc_adj_factor() {
    this.set_x(this.isemptyobject(this.parentshape)?this.get_x():0);
    this.set_y(this.isemptyobject(this.parentshape)?this.get_y():0); 
}

  redraw() {
    console.log(this);
    console.log("Inside redraw");
    console.log(this.get_x());
    console.log(this.get_y());
    this.mybaseleaf.attr("width",this.width)
                      .attr("height",this.height)
                      .attr("x",this.get_x())
                      .attr("y",this.get_y());
  }

  /*
size_calc() {
    this.textval ? this.width = Math.max(this.width,this.textleaf.node().getBBox().width): this.width;
    this.textval ? this.height = Math.max(this.height,this.textleaf.node().getBBox().height): this.height;
    return {"width": this.width, "height": this.height};
  }
  */
 public size_calc(): void {
  throw new Error("Method not implemented.");
}

}


export class base_circle_leaf extends LeafShape {
  radius: number;
  //over_ride_groupid: string;

  constructor(x:number,y:number, prntshape:any,groupid: string,r: number) {
    super(x,y,prntshape,groupid,[[""]]);
    //this.over_ride_groupid = (groupid !== ""?groupid:prntshape.groupid);
    this.radius = r;
    this.create();
  }

  create() {
        // If have text first plot it before caluculating the text length
      //console.log( d3.select("#connectionslayer").select("#con_gleaf_Eve1"));
      //console.log("-=");
      this.mybaseleaf = d3.select(this.groupid).append("circle")
                      .attr("r",this.radius)
                      .attr("cx",this.get_x())
                      .attr("cy",this.get_y());
                      //.attr("fill-opacity",0.5);
  }


  moving_bare() {
    console.log("ii moving bare circle leaf");
    this.mybaseleaf.attr("cx", this.get_x())
               .attr("cy", this.get_y());
  }

  recalc_adj_factor() {
    this.set_x(this.isemptyobject(this.parentshape)?this.get_x():0);
    this.set_y(this.isemptyobject(this.parentshape)?this.get_y():0); 
  }

 leaf_resize(radius: number) {    
    //this.childshape[0].leaf_resize(this);
  }

  size_calc() {
    this.mybaseleaf.attr("r",this.radius)
                    .attr("cx", this.get_x())
                    .attr("cy", this.get_y());

  }


}




export class base_rect_leaf extends LeafShape {

  width: number;
  height: number;


  constructor(x:number,y:number, prntshape:any, groupid:string, w: number,h: number) {
    super(x,y,prntshape,prntshape.groupid,[[""]]);
    this.width = w;
    this.height = h;
    //this.myroot = this;
    this.create();
  }

  create() {
    //console.log("tttttt");
//console.log(this.groupid);
//console.log(d3.select("#leaf_Eve"));
    //console.log("tttttt");
      this.mybaseleaf = d3.select(this.groupid)
                      .append("rect")
                      .attr("width",this.width)
                      .attr("height",this.height)
                      .attr("x",this.get_x())
                      .attr("y",this.get_y())
                     // .attr("fill-opacity",0.5)
                      ;
                      this.mybaseleaf.raise();
  }

  moving_bare() {
    this.mybaseleaf.attr("x", this.get_x())
               .attr("y", this.get_y());
  }

  redraw() {
    this.mybaseleaf.attr("width",this.width)
                      .attr("height",this.height)
                      .attr("x",this.get_x())
                      .attr("y",this.get_y());
  }

recalc_adj_factor() {
    this.set_x(this.isemptyobject(this.parentshape)?this.get_x():0);
    this.set_y(this.isemptyobject(this.parentshape)?this.get_y():0); 
}
  /*
size_calc() {
    this.textval ? this.width = Math.max(this.width,this.textleaf.node().getBBox().width): this.width;
    this.textval ? this.height = Math.max(this.height,this.textleaf.node().getBBox().height): this.height;
    return {"width": this.width, "height": this.height};
  }
  */
 public size_calc(): void {
  throw new Error("Method not implemented.");
}

}


export function isemptyobject(obj: any): boolean {
      
  if(obj !== undefined) {
    if ((Object.keys(obj).length === 0 && obj.constructor === Object)) {
      return true;
    }
  }  
  return false;    

}

/*
export class base_circle_leaf extends LeafShape {
  radius: number;
  //over_ride_groupid: string;

  constructor(x:number,y:number, prntshape:any,groupid: string,r: number) {
    super(x,y,prntshape,groupid,[[""]]);
    //this.over_ride_groupid = (groupid !== ""?groupid:prntshape.groupid);
    this.radius = r;
    this.create();
  }

  create() {
        // If have text first plot it before caluculating the text length
      //console.log( d3.select("#connectionslayer").select("#con_gleaf_Eve1"));
      //console.log("-=");
      this.mybaseleaf = d3.select(this.groupid).append("circle")
                      .attr("r",this.radius)
                      .attr("cx",this.get_x())
                      .attr("cy",this.get_y());
                      //.attr("fill-opacity",0.5);
  }


  moving_bare() {
    this.mybaseleaf.attr("cx", this.get_x())
               .attr("cy", this.get_y());
  }

 leaf_resize(radius: number) {    
    //this.childshape[0].leaf_resize(this);
  }

  size_calc() {
    this.mybaseleaf.attr("r",this.radius)
                    .attr("cx", this.get_x())
                    .attr("cy", this.get_y());

  }


}
*/

