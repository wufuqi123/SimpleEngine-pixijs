import { Component } from "../../core/Component";

export class AdapterContainer extends Component {
  protected _height!: number;
  protected _width!: number;
  _CurrIndex: number = 0;
  constructor() {
    super();
    this.layout();
  }
  layout(){

  }
  measure(data:any,position:number):boolean|undefined{
    return;
  }
  setData(data:any,position:number){}
  set height(height: number) {
    this._height = height;
  }
  get height(): number {
    return this._height;
  }
  set width(width: number) {
    this._width = width;
  }
  get width(): number {
    return this._width;
  }
}
