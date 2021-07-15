import { CheckBox } from "./CheckBox";
import { RadioGroup } from "./RadioGroup";
import { Texture } from "pixi.js";
//单选框，需要配合RadioGroup来使用
export class Radio extends CheckBox {
  private _group!: RadioGroup;
  public _groupIndex: number = -1;
  constructor(options?: {
    normalTexture?: Texture;
    selectTexture?: Texture;
    disabledTexture?: Texture;
    width?: number;
    height?: number;
  }) {
    super(options);
  }
  /**
   * 设置 RadioGroup
   */
  set group(group: RadioGroup) {
    if (this._group && this._group != group) {
      throw new Error("当前单选按钮已经存在RadioGroup");
    }
    this._group = group;
    this._groupIndex = group.put(this);
  }
  get group(): RadioGroup {
    return this._group;
  }


  /**
   * 是否选中
   */
  set selected(selected: boolean) {
    if (this.group) {
      this.group.select = this._groupIndex;
    } else {
      this.setSelectedDraw(selected);
    }
    this.emit("selected",selected);
  }
  get selected(): boolean {
    return this._selected;
  }
  /**
   * 绘制图片
   * @param selected 
   */
  setSelectedDraw(selected: boolean) {
    if (this._selected == selected) {
      return;
    }
    this._selected = selected;
    this.currState = selected ? Radio.STATE.SELECT : Radio.STATE.NORMAL;
    this.draw();
    if (this._chageCallback) {
      this._chageCallback(selected);
    }
  }
  /**
   * 销毁
   * @param options 
   */
  destroy(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }) {
    if (this._group) {
      this._group.remove(this);
    }
    super.destroy(options);
  }
}
