export default class ParseSet {
  public static parse(obj:any,action:any){
    if (action.res != undefined) {
      obj.res = action.res;
    }
    if (action.opacity != undefined) {
      obj.opacity = action.opacity;
    }
    if (action.position != undefined) {
      obj.position = action.position;
    }
    if (action.scale != undefined) {
      obj.scale = action.scale;
    }
    if (action.anchor != undefined) {
      obj.anchor = action.anchor;
    }
    if (action.rotate != undefined) {
      obj.rotate = action.rotate;
    }
    if (action.action != undefined) {
      obj.action = action.action;
    }
    if (action.align != undefined) {
      obj.align = action.align;
    }
    if (action.isLoop != undefined) {
      obj.isLoop = action.isLoop;
    }
    if (action.repeat != undefined) {
      obj.repeat = action.repeat;
    }
    if (action.zIndex != undefined) {
      obj.zIndex = action.zIndex;
    }
  }
}