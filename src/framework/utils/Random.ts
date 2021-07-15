export class Random {
  public static nextInt(num:number){
    return Random.randomScope(0,num-1);
  }
  public static randomScope(minNum:number,maxNum:number){
    switch(arguments.length){ 
      case 1: 
          return parseInt(Math.random()*minNum+1,10); 
      case 2: 
          return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
      default: 
          return 0; 
    }  
  }
}