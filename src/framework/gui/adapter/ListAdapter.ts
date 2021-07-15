import {
  BaseListAdapter,
  AdapterContainer,
  Log,
} from "../../index";
import { Container } from "pixi.js";
export class ListAdapter extends BaseListAdapter<any> {
  classz:Object|undefined;
  constructor(data: any) {
    super(data);
  }
  /**
   * classz 必须继承 AdapterContainer
   * @param classz 
   */
  setClass(classz:Object){
    this.classz = classz;
  }

  setBaseListAdapterData(data: Array<any>) {
    this.data = data;
  }

    /**
   * 测量
   */
  getRemeasure( position: number,
    convertView: AdapterContainer | undefined,): {container:AdapterContainer,isOpen:boolean} | undefined {
    if(!this.classz){
      throw new Error(" ListAdapter 请注册class，调用 setClass 注册class");
    }
    let cl = <any>this.classz;
    if (!convertView) {
      convertView = new cl();
    }
    if(!convertView){
      return;
    }
    convertView._CurrIndex = position;
    let isOpen = convertView.measure(this.getItem(position), position);
    return {container:convertView,isOpen:!!isOpen};
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
