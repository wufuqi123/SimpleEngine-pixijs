/**
 * 对象池
 */
export class ObjectPool<T> {
  private pool: Array<T>;
  constructor() {
    this.pool = new Array<T>();
  }
  size() {
    return this.pool.length;
  }
  get(): T | undefined {
    return this.pool.shift();
  }
  put(obj: T) {
    this.pool.push(obj);
  }
  
  clear() {
    this.pool.length = 0;
  }
}
