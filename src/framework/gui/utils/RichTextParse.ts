import { EventEmitter } from "eventemitter3";
export class RichTextParse extends EventEmitter {
  public static START_PATT: string = "START_PATT";
  public static END_PATT: string = "END_PATT";
  public static CONTENT: string = "CONTENT";
  private text: string = "";
  private startPatt = [
    {
      name: "size",
      patt: /<size=[0-9]+>/,
      valuePatt: /[0-9]+/
    },
    {
      name: "color",
      patt: /<color=#[0-9a-fA-F]{3}>/,
      valuePatt: /#[0-9a-fA-F]{3}/
    },
    {
      name: "color",
      patt: /<color=#[0-9a-fA-F]{6}>/,
      valuePatt: /#[0-9a-fA-F]{6}/
    },
    {
      name: "icon",
      patt: /<icon=\"(.*?)\"\/>/,
      naked: true,
      valuePatt: /\"(.*?)\"/
    },
    {
      name: "icon",
      patt: /<icon=\'(.*?)\'\/>/,
      naked: true,
      valuePatt: /\'(.*?)\'/
    }
  ];
  private endPatt = [
    {
      name: "size",
      patt: /<\/size>/
    },
    {
      name: "color",
      patt: /<\/color>/
    },
    {
      name: "icon",
      patt: /<\/icon=\"(.*?)\">/,
      naked: true,
      valuePatt: /\"(.*?)\"/
    },
    {
      name: "icon",
      patt: /<\/icon=\'(.*?)\'>/,
      naked: true,
      valuePatt: /\'(.*?)\'/
    }
  ];
  constructor(text?: string) {
    super();
    if (text) {
      this.setText(text);
    }
    this.setPatt();
  }
  public setText(text: string) {
    this.text = text;
  }
  public setPatt(
    startPatt?: [
      {
        name: string;
        patt: RegExp;
        naked?: boolean;
        valuePatt?: RegExp;
      }
    ],
    endPatt?: [
      {
        name: string;
        patt: RegExp;
        naked?: boolean;
        valuePatt?: RegExp;
      }
    ]
  ) {
    if (startPatt) {
      this.startPatt = <any>startPatt;
    }
    if (endPatt) {
      this.endPatt = <any>endPatt;
    }
  }
  private richTextParseArr: Array<Map<string, string>> = new Array();
  private richTextParseObj: Map<string, Array<string>> = new Map();

  ontext(text: string) {
    let map = new Map();
    this.richTextParseObj.forEach((value: Array<string>, key: string) => {
      let tv = value[value.length - 1];
      if (tv != undefined) {
        map.set(key, tv);
      }
    });
    map.set("text", text);
    this.richTextParseArr.push(map);
    this.emit("text", text);
  }
  onopentag(tag: string, text: string, attribute: string, naked: boolean) {
    if (naked) {
      let map = new Map();
      map.set(tag, attribute.substring(1, attribute.length - 1));
      this.richTextParseArr.push(map);
      return;
    }
    if (!attribute) {
      this.onerror(tag, text);
    }
    let arr = this.richTextParseObj.get(tag);
    if (!Array.isArray(arr)) {
      arr = new Array();
    }
    arr.push(attribute);
    this.richTextParseObj.set(tag, arr);
    this.emit("opentag", tag, text, attribute, naked);
  }
  onattribute(attribute: string | undefined) {
    this.emit("attribute", attribute);
  }
  onclosetag(tag: string, text: string, attribute: string, naked: boolean) {
    if (naked) {
      let map = new Map();
      map.set(tag, attribute.substring(1, attribute.length - 1));
      this.richTextParseArr.push(map);
      return;
    }
    if (
      !this.richTextParseObj.get(tag) ||
      this.richTextParseObj.get(tag)?.length == 0
    ) {
      this.onerror(tag, text);
    }

      this.richTextParseObj
        .get(tag)
        ?.splice((<any>this.richTextParseObj).get(tag).length - 1, 1);
    
    this.emit("closetag", tag, text, attribute, naked);
  }
  onerror(tag?: string, text?: string) {
    this.emit("error", tag, text);
    if (!text) {
      throw new Error("解析富文本时【" + tag + "】正则有误，请检查！");
    } else {
      throw new Error(
        "解析富文本时【" + tag + "】" + text + "格式有误请检查！！"
      );
    }
  }
  onend() {
    this.emit("end", this.richTextParseArr);
  }
  public parse() {
    this.richTextParseArr.length = 0;
    this.richTextParseObj.clear();
    let labelInfoArr = this.getLabelInfoArr();
    let lastIndex = 0;
    for (let i = 0; i < labelInfoArr.length; i++) {
      let labelInfo = labelInfoArr[i];
      if (labelInfo.patt == RichTextParse.CONTENT) {
        this.ontext && this.ontext(this.text);
        continue;
      }
      if (lastIndex != labelInfo.index) {
        this.ontext &&
          this.ontext(this.text.substring(lastIndex, labelInfo.index));
        lastIndex = labelInfo.index;
      }
      if (labelInfo.patt == RichTextParse.START_PATT) {
        this.onopentag &&
          this.onopentag(
            labelInfo.name,
            labelInfo.text,
            labelInfo.attribute,
            labelInfo.naked
          );
        this.onattribute && this.onattribute(labelInfo.attribute);
        lastIndex = labelInfo.index + labelInfo.text.length;
      }
      if (labelInfo.patt == RichTextParse.END_PATT) {
        this.onclosetag &&
          this.onclosetag(
            labelInfo.name,
            labelInfo.text,
            labelInfo.attribute,
            labelInfo.naked
          );
        lastIndex = labelInfo.index + labelInfo.text.length;
      }
      if (i == labelInfoArr.length - 1 && lastIndex != this.text.length) {
        this.ontext &&
          this.ontext(this.text.substring(lastIndex, this.text.length));
      }
    }
    this.onend && this.onend();
  }

  getLabelInfoArr(): [
    {
      name: string;
      text: string;
      index: number;
      patt: any;
      attribute: string;
      naked: boolean;
    }
  ] {
    if (!this.text.split) {
      throw new Error("解析文字异常，拿到的文字为：" + this.text);
    }
    let matchArr = [];
    let arr = this.text.split("");
    let text = "";
    let index = 0;
    let pattStr;
    let tagAttribute;
    let startTagName;
    let naked = false;
    for (let i = 0; i < arr.length; i++) {
      text += arr[i];
      let match;
      for (let j = 0; j < this.startPatt.length; j++) {
        let m = text.match(this.startPatt[j].patt);
        if (m) {
          startTagName = this.startPatt[j].name;
          naked = <any>this.startPatt[j].naked;
          m["index"] += <any>index;
          match = m;
          pattStr = RichTextParse.START_PATT;
          if (this.startPatt[j].valuePatt) {
            tagAttribute = (<any>match[0]).match(this.startPatt[j].valuePatt)[0];
          }
        }
      }
      for (let j = 0; j < this.endPatt.length; j++) {
        let m = text.match(this.endPatt[j].patt);
        if (m) {
          startTagName = this.endPatt[j].name;
          naked =  <any>this.endPatt[j].naked;
          m["index"] +=  <any>index;
          match = m;
          pattStr = RichTextParse.END_PATT;
          if (this.endPatt[j].valuePatt) {
            if (!match[0].match( <any>this.endPatt[j].valuePatt)) {
              this.onerror(startTagName);
            }
            tagAttribute = (<any>match[0]).match(this.endPatt[j].valuePatt)[0];
          }
        }
      }
      if (match) {
        text = "";
        index = i + 1;
        matchArr.push({
          name: startTagName,
          text: match[0],
          index: match["index"],
          patt: pattStr,
          attribute: tagAttribute,
          naked: naked
        });
      }
    }
    if (matchArr.length == 0 && this.text && this.text.length != 0) {
      matchArr.push({
        patt: RichTextParse.CONTENT,
        text: this.text,
        index: this.text.length
      });
    }
    return <any>matchArr;
  }

  destroy(){
    
  }
}
