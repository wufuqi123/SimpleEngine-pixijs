export default class ParseFlashGray {
  public static parse(obj:any,action:any){
    if(action.type == "flashIn"){
      obj.flash = 1;
    }else if(action.type == "flashOut"){
      obj.flash = 0;
    }else if(action.type == "flashTo"){
      obj.flash = action.value;
    }else if(action.type == "setFlash"){
      obj.flash = action.value;
    }else if(action.type == "flashChange"){
      obj.flash = action.endValue;
    }else if(action.type == "grayIn"){
      obj.gray = 1;
    }else if(action.type == "grayOut"){
      obj.gray = 0;
    }else if(action.type == "grayTo"){
      obj.gray = action.value;
    }else if(action.type == "setGray"){
      obj.gray = action.value;
    }else if(action.type == "grayChange"){
      obj.gray = action.endValue;
    }
  }
}