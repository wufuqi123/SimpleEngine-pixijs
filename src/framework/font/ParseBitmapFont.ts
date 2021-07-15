import { BitmapFontData } from "./BitmapFontData";

export class ParseBitmapFont {
  public static parse(text: string): BitmapFontData {
    //截取 info 数据
    let infoStartIndex = text.indexOf("info ") + 5;
    let infoEndIndex =
      text.substring(infoStartIndex, text.length).indexOf("\n") +
      infoStartIndex;
    let infoDataText = text.substring(infoStartIndex, infoEndIndex);

    //截取 chars  count数据
    let charsCountStartIndex = text.indexOf("chars ") + 6;
    let charsCountEndIndex =
      text.substring(charsCountStartIndex, text.length).indexOf("\n") +
      charsCountStartIndex;
    let charsCountData = text.substring(
      charsCountStartIndex,
      charsCountEndIndex
    );
    //info  转obj
    let infoDataArr = infoDataText.split(" ");
    let infoData: any = {};
    for (let i = 0; i < infoDataArr.length; i++) {
      // let kv = infoDataArr[i].split("=");
      let data = this.parseEquation(infoDataArr[i]);
      for (let key in data) {
        infoData[key] = data[key];
      }
    }
    //char的数量  转obj
    let countData = this.parseEquation(charsCountData);

    //截取  char的数据
    let charText = text;
    let charTextArr = [];
    for (let i = 0; i < countData.count; i++) {
      let charStartIndex = charText.indexOf("char ") + 5;
      let charEndIndex =
        charText.substring(charStartIndex, charText.length).indexOf("\n") +
        charStartIndex;
      charTextArr.push(charText.substring(charStartIndex, charEndIndex));
      charText = charText.substring(charEndIndex, charText.length);
    }

    //char转obj
    let charArr = [];
    for (let i = 0; i < charTextArr.length; i++) {
      let char: any = {};
      let charInfoText = charTextArr[i].split(" ");
      for (let i = 0; i < charInfoText.length; i++) {
        let data = this.parseEquation(charInfoText[i]);
        for (let key in data) {
          char[key] = data[key];
        }
      }
      charArr.push(char);
    }

    //截取 page的数据
    let pageText = text;
    let pageTextArr = [];
    while (pageText.indexOf("page ") != -1) {
      let pageStartIndex = pageText.indexOf("page ") + 5;
      let pageEndIndex =
        pageText.substring(pageStartIndex, pageText.length).indexOf("\n") +
        pageStartIndex;
      pageTextArr.push(pageText.substring(pageStartIndex, pageEndIndex));
      pageText = pageText.substring(pageEndIndex, pageText.length);
    }

    //page转obj
    let pageArr = [];
    for (let i = 0; i < pageTextArr.length; i++) {
      let page: any = {};
      let pageInfoText = pageTextArr[i].split(" ");
      for (let i = 0; i < pageInfoText.length; i++) {
        let data = this.parseEquation(pageInfoText[i]);
        for (let key in data) {
          page[key] = data[key];
        }
      }
      pageArr.push(page);
    }

    let bitmapFontData = new BitmapFontData();
    bitmapFontData.info = infoData;
    bitmapFontData.chars = charArr;
    bitmapFontData.charCount = countData.count;
    bitmapFontData.pages = pageArr;
    return bitmapFontData;
  }
  //等式转obj   aa=1  aa=a  aa=0,0,0,0
  private static parseEquation(equation: string): any {
    equation = equation.replace(/^\s*|\s*$/g, "");
    let obj: any = {};
    let kv = equation.split("=");
    if (kv.length != 0) {
      if (kv[0] == "") {
        return obj;
      }
      obj[kv[0]] = undefined;
    }
    if (kv.length == 2) {
      let values = kv[1].split(",");
      for (let i = 0; i < values.length; i++) {
        let value = values[i];
        if (value.indexOf('"') == 0 || value.indexOf("'") == 0) {
          value = value.substring(1, value.length);
        }
        if (
          value.indexOf('"') == value.length - 1 ||
          value.indexOf("'") == value.length - 1
        ) {
          value = value.substring(0, value.length - 1);
        }
        if (!isNaN(parseInt(value)) && value != "") {
          value = <any>parseInt(value);
        }
        values[i] = value;
      }
      if (values.length == 1) {
        obj[kv[0]] = values[0];
      } else if (values.length != 0) {
        obj[kv[0]] = values;
      }
    }
    return obj;
  }

  public static parseTexture(bitmapFontData:BitmapFontData){
    bitmapFontData.chars.forEach((char)=>{
      let texture;
      bitmapFontData.pages.forEach((page)=>{
        if(char.page == page.id){
          texture = page.texture;
        }
      });
      if(texture){
        char.texture = new PIXI.Texture(texture, new PIXI.Rectangle(char.x, char.y, char.width, char.height));
      }
      bitmapFontData.charMap.set(char.id,char);
    });
  }
}
