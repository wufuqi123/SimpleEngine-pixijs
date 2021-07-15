export class ResDestroyArray<T> {
  private array = new Array();

  /**
   * 获取长度
   */
  public get length():number{
    return this.array.length;
  }
  /**
   * 添加 资源
   * @param resName 
   */
  public push(...resNames:T[]){
    if(resNames==undefined){
      return;
    }
    resNames.forEach(resName=>{
      if(!this.includes(resName)){
        this.array.push(resName)
      }
    })
  }

  /**
   * 是否包含资源
   * @param resName 
   */
  public includes(resName:T):boolean{
    if(resName instanceof Object){
      let r = JSON.stringify(resName);
      for(let i = 0;i<this.array.length;i++){
        if(JSON.stringify(this.array[i])==r){
          return true;
        }
      }
      return false;
    }else{
      return this.array.includes(resName);
    }
  }


  /**
   * 移除资源
   * @param resNames 
   */
  public remove(...resNames:T[]){
    if(resNames==undefined){
      return;
    }
    resNames.forEach(resName=>{
      this.array.remove(resName)
    })
  }

  /**
   * 清空资源
   */
  public clear(){
    this.array.clear();
  }


  /**
   * 获取长度
   */
  public size():number{
    return this.length;
  }

  /**
   * 转数组
   */
  public toArray():Array<T>{
    let arr = new Array();
    arr.push(...this.array);
    return arr;
  }

}