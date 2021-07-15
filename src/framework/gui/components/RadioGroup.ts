import { Radio } from "./Radio";
import { EventEmitter } from "eventemitter3";
//单选框 组
export class RadioGroup extends EventEmitter {
  private radioArr: Array<Radio> = new Array();
  private _select: number = -1;

  has(radio: Radio): boolean {
    return this.indexOf(radio) !== -1;
  }
  indexOf(radio: Radio): number {
    return this.radioArr.indexOf(radio);
  }

  add(...radio: Radio[]) {
    radio.forEach(r => {
      r.group = this;
    })
  }

  put(radio: Radio): number {
    let index = this.indexOf(radio);
    if (index !== -1) {
      return index;
    }
    this.radioArr.push(radio);
    return this.radioArr.length - 1;
  }
  remove(radio: Radio) {
    this.radioArr.remove(radio);
    this.radioArr.forEach((v, i) => {
      v._groupIndex = i;
    })
  }
  set select(select: number) {
    this.selectRadios(select);
  }
  get select(): number {
    return this._select;
  }

  selectRadios(index: number,isSendEvent=true) {
    let select = -1;
    this.radioArr.forEach((item, i) => {
      if (i == index) {
        select = i;
      }
      item.setSelectedDraw(index == i);
    });
    this._select = select;
    if(isSendEvent){
      this.emit("change", select)
    }
  }
}
