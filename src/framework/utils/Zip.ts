import pako from "pako";
export class Zip {
  static zipStr(str: string): string {
    const binaryString = pako.gzip(encodeURIComponent(str), { to: "string" });
    return btoa(binaryString);
  }
  static unzip(b64Data: string): string {
    let strData = atob(b64Data);
    const charData = strData.split("").map(function (x) {
      return x.charCodeAt(0);
    });
    const binData = new Uint8Array(charData);
    const data = pako.inflate(binData);

    // strData = String.fromCharCode.apply(null, new Uint16Array(data));
    var res = "";
    var chunk = 8 * 1024;
    var i;
    let array = new Uint16Array(data);
    for (i = 0; i < array.length / chunk; i++) {
      res += String.fromCharCode.apply(
        null,
        array.slice(i * chunk, (i + 1) * chunk)
      );
    }
    res += String.fromCharCode.apply(null, array.slice(i * chunk));
    strData = res;
    return decodeURIComponent(strData);
  }
  static strLength(str: string): number {
    let total = 0,
      charCode,
      i,
      len;
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode <= 0x007f) {
        total += 1;
      } else if (charCode <= 0x07ff) {
        total += 2;
      } else if (charCode <= 0xffff) {
        total += 3;
      } else {
        total += 4;
      }
    }
    return total;
  }
}
