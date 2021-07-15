import { List } from "../components/List";
import { AdapterContainer } from "../components/AdapterContainer";
import { Container } from "pixi.js";
export class BaseListAdapter<T> {
  list!: List;
  _data!: Array<T>;
  constructor(data: Array<T>) {
    this.data = data;
  }
  set data(data: Array<T>) {
    this._data = data;
    this.list && this.list.draw();
  }
  get data(): Array<T> {
    return this._data;
  }
  /**
   * 总共item个数
   */
  getCount(): number {
    return this.data.length;
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
  getRemeasure( position: number,
    convertView: AdapterContainer | undefined): {container:AdapterContainer,isOpen:boolean} | undefined {
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

  // /**
  //  * 简单复用写法
  //  * @param position
  //  * @param convertView
  //  * @param parent
  //  */
  // getAdapterContainer(
  //   position: number,
  //   convertView: AdapterContainer | undefined,
  //   parent: Layout
  // ): AdapterContainer {
  //   if (!convertView) {
  //     convertView = new AdapterContainer();
  //   }
  //   return convertView;
  // }

  //   /**
  //    * 多条目复用写法
  //    * @param position
  //    * @param convertView
  //    * @param parent
  //    */
  //   getAdapterContainer(
  //     position: number,
  //     convertView: AdapterContainer | undefined,
  //     parent: Layout
  //   ): AdapterContainer {
  //     let type = this.getItemType(position);
  //     if (!convertView) {
  //       if(type == 1){
  //         convertView = new AdapterContainer();
  //       }else if(type == 2){
  //         convertView = new AdapterContainer();
  //       }else{
  //         convertView = new AdapterContainer();
  //       }
  //     }
  //     return convertView;
  //   }
  // }
}
