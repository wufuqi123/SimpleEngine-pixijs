import { Pager } from "../components/Pager";
import { AdapterContainer } from "../components/AdapterContainer";
import { Container } from "pixi.js";
export class PageAdapter<T> {
  pager!: Pager;
  _data!: Array<T>;
  _sourceData!: Array<T>;
  _loop: boolean = false;
  private _loopCount: number = 1;
  constructor(data: Array<T>) {
    this.data = data;
  }
  set data(data: Array<T>) {
    this._sourceData = data;
    this.loop = this.loop;
  }
  get data(): Array<T> {
    return this._data;
  }
  set loopCount(loopCount: number) {
    let lastLoopCount = this._loopCount;
    let currLoopCount = Math.floor(loopCount);
    this._loopCount = currLoopCount;
    if (this.loop && lastLoopCount != currLoopCount) {
      this.loop = this.loop;
    }
  }
  get loopCount(): number {
    return this._loopCount;
  }
  private copyData(headData?: Array<T>, tailData?: Array<T>) {
    if (!Array.isArray(this._data)) {
      this._data = new Array();
    }
    this._data.length = 0;
    if (Array.isArray(headData)) {
      headData.forEach((item) => {
        this._data.push(item);
      });
    }
    this._sourceData.forEach((item) => {
      this._data.push(item);
    });
    if (Array.isArray(tailData)) {
      tailData.forEach((item) => {
        this._data.push(item);
      });
    }
  }
  set loop(loop: boolean) {
    this._loop = loop;
    let headData = new Array();
    let tailData = new Array();
    if (loop) {
      for (let j = 0; j < this.loopCount; j++) {
        for (let i = 0; i < this._sourceData.length; i++) {
          headData.push(this._sourceData[i]);
        }
        for (let i = 0; i < this._sourceData.length; i++) {
          tailData.push(this._sourceData[i]);
        }
      }
    }
    this.copyData(headData, tailData);
    this.pager && this.pager.draw();
  }
  get loop(): boolean {
    return this._loop;
  }
  /**
   * 总共item个数
   */
  getCount(): number {
    return this.data.length;
  }
  getSourceCount(): number {
    return this._sourceData.length;
  }
  getLoopSourceCount(): number {
    return this._sourceData.length * this.loopCount;
  }
  /**
   * 获取数据
   * @param position 当前角标
   */
  getItem(position: number): T {
    return this.data[position];
  }
  /**
   * 多类型条目
   * @param position 当前角标
   */
  getItemType(position: number): number {
    return 0;
  }
  /**
   * 测量
   */
  getRemeasure(
    position: number,
    convertView: AdapterContainer | undefined
  ): { container: AdapterContainer; isOpen: boolean } | undefined {
    return;
  }
  /** 子类一定要实现此方法
   * 获取容器
   * @param position 当前角标
   * @param convertView 复用的view
   * @param parent 父类
   */
  getAdapterContainer(
    position: number,
    convertView: AdapterContainer | undefined,
    parent: Container
  ): AdapterContainer {
    if (!convertView) {
      convertView = new AdapterContainer();
    }
    return convertView;
  }
}
