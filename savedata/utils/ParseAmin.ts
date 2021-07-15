export default class ParseAmin {
  public static parse(obj:any,action:any){
    switch(action.type){
      case "fadeIn":
        this.fadeIn(obj,action);
        break;
      case "fadeOut":
        this.fadeOut(obj,action);
        break;
      case "fadeTo":
        this.fadeTo(obj,action);
        break;
      case "moveBy":
        this.moveBy(obj,action);
        break;
      case "moveTo":
        this.moveTo(obj,action);
        break;
      case "scaleBy":
        this.scaleBy(obj,action);
        break;
      case "scaleTo":
        this.scaleTo(obj,action);
        break;
      case "rotateBy":
        this.rotateBy(obj,action);
        break;
      case "rotateTo":
        this.rotateTo(obj,action);
        break;
      case "spawn":
        this.spawnSequence(obj,action);
        break;
      case "sequence":
        this.spawnSequence(obj,action);
        break;
    }
  }

  protected static spawnSequence(obj:any,action:any){
    if(!Array.isArray(action.collection) || action.collection.length == 0){return}
    action.collection.forEach(element => {
      this.parse(obj,element);
    });
  }
  protected static fadeIn(obj:any,action:any){
    obj.opacity = 255;
  }
  protected static fadeOut(obj:any,action:any){
    obj.opacity = 0;
  }
  protected static fadeTo(obj:any,action:any){
    obj.opacity = action.opacity;
  }

  protected static moveBy(obj:any,action:any){
    if(!Array.isArray(action.position) || action.position.length == 0){return}
    let position = obj.position;
    if(!Array.isArray(position)){
      position = [];
      obj.position = position;
    }
    action.position.forEach((element,i) => {
      if(isNaN(position[i])){
        position[i] = 0;
      }
      if(isNaN(element)){
        element = 0;
      }
      position[i] = parseInt(position[i]) + parseInt(element);
    });
  }

  protected static moveTo(obj:any,action:any){
    if(!Array.isArray(action.position) || action.position.length == 0){return}
    let position = obj.position;
    if(!Array.isArray(position)){
      position = [];
      obj.position = position;
    }
    action.position.forEach((element,i) => {
      if(isNaN(element)){
        element = 0;
      }
      position[i] = parseInt(element);
    });
  }

  protected static scaleBy(obj:any,action:any){
    if(!Array.isArray(action.scale) || action.scale.length == 0){return}
    let scale = obj.scale;
    if(!Array.isArray(scale)){
      scale = [];
      obj.scale = scale;
    }
    action.scale.forEach((element,i) => {
      if(isNaN(scale[i])){
        scale[i] = 0;
      }
      if(isNaN(element)){
        element = 0;
      }
      scale[i] = parseFloat(scale[i]) + parseFloat(element);
    });
  }

  protected static scaleTo(obj:any,action:any){
    if(!Array.isArray(action.scale) || action.scale.length == 0){return}
    let scale = obj.scale;
    if(!Array.isArray(scale)){
      scale = [];
      obj.scale = scale;
    }
    action.scale.forEach((element,i) => {
      if(isNaN(element)){
        element = 0;
      }
      scale[i] = parseFloat(element);
    });
  }

  protected static rotateBy(obj:any,action:any){
    if(isNaN(action.rotate)){return}
    let rotate = obj.rotate;
    if(isNaN(rotate)){
      rotate = 0;
    }
    obj.rotate = parseInt(action.rotate) + parseInt(rotate);
  }

  protected static rotateTo(obj:any,action:any){
    if(isNaN(action.rotate)){return}
    obj.rotate = parseInt(action.rotate);
  }

}