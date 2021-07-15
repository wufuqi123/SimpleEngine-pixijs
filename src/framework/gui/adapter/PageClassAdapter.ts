import { PageAdapter } from "./PageAdapter";
import { AdapterContainer } from "../components/AdapterContainer";
import { Container } from "pixi.js";

export class PageClassAdapter extends PageAdapter<any> {
  classz:Object|undefined;
   /**
   * classz 必须继承 AdapterContainer
   * @param classz 
   */
  setClass(classz:Object){
    this.classz = classz;
  }
  getAdapterContainer(
    position: number,
    convertView: AdapterContainer | undefined,
    parent: Container
  ): AdapterContainer {
    if(!this.classz){
      throw new Error(" ListAdapter 请注册class，调用 setClass 注册class");
    }
    let cl = <any>this.classz;
    if (!convertView) {
      convertView = new cl();
    }
    if(convertView){
      convertView._CurrIndex = position;
      convertView.setData(this.getItem(position), position);
    }
    return <AdapterContainer>convertView;
  }
}