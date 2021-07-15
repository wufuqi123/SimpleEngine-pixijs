import { MultistateComponent } from "./MultistateComponent";
import { EventManager } from "../../event/EventManager";
import { Texture } from "pixi.js";
/**
 * 复选框
 */
export class CheckBox extends MultistateComponent {
  _selectTexture!: Texture;
  protected _selected: boolean = false;
  _chageCallback: Function | undefined;
  public static STATE = {
    NORMAL: "normal",
    SELECT: "select",
    DISABLED: "disabled"
  };
  constructor(options?: {
    normalTexture?: Texture;
    selectTexture?: Texture;
    disabledTexture?: Texture;
    width?: number;
    height?: number;
  }) {
    super(options);
    this.buttonMode = true;
    if (options) {
      if (options.selectTexture) {
        this.selectTexture = options.selectTexture;
      }
    }
  }
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = disabled;
    this.buttonMode = !disabled;
    this.interactive = !disabled;
    this.draw();
  }
  /**
   * 设置事件
   */
  handleEvents() {
    this.on(EventManager.ALL_CLICK, () => {
      this.selected = !this.selected;
    });
  }
  /**
   * 改变回调
   * @param callback
   */
  setChageCallback(callback: Function) {
    this._chageCallback = callback;
  }
  /**
   * 是否选中
   */
  set selected(selected: boolean) {
    if (this._selected == selected) {
      return;
    }
    this._selected = selected;
    this.currState = selected ? CheckBox.STATE.SELECT : CheckBox.STATE.NORMAL;
    this.draw();
    if (this._chageCallback) {
      this._chageCallback(selected);
    }
    this.emit("selected",selected);
  }
  get selected(): boolean {
    return this._selected;
  }
  /**
   * 设置选中态
   */
  set selectTexture(texture: Texture) {
    this.rootSprite.addState(CheckBox.STATE.SELECT, texture);
    this._selectTexture = texture;
    this.draw();
  }
  get selectTexture(): Texture {
    return this._selectTexture;
  }
  removeEvents(){
    super.removeEvents();
    this.off("selected");
  }
}
