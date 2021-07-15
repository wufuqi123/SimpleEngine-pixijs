import { Log } from "../log/Log";

const PREFIX = "$unixie$";

export class PlayerPrefs {
  static set(key: any, value?: any) {
    if (typeof key === "string") {
      // set a single value
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    } else if (typeof key === "object" && typeof value === "undefined") {
      // set multiple values
      for (let k in key) {
        this.set(k, key[k]);
      }
    }
  }

  static get(key: string) {
    let data = localStorage.getItem(`${PREFIX}${key}`);
    if(!data || data == "undefined"){
      return;
    }
    return JSON.parse(data);
  }

  static remove(key: string) {
    localStorage.removeItem(`${PREFIX}${key}`);
  }

  static clear() {
    localStorage.clear();
  }
}
