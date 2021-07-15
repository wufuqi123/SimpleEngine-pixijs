import { LoaderResource } from "pixi.js";
import { FontManager } from "./FontManager";
import { Log } from "../log/Log";
import { ParseBitmapFont } from "./ParseBitmapFont";
export class FontLoader {
  private static suffix: string[] = ["TTF", "ttf","OTF", "otf"];
  public static use(resource: LoaderResource, next: () => void): void {
    if (resource.extension && FontLoader.suffix.includes(resource.extension)) {
      let newStyle = document.createElement("style");
      newStyle.appendChild(
        document.createTextNode(
          "\
        @font-face {\
        font-family: '" +
            resource.name +
            "';\
        src: url('" +
            resource.url +
            "');\
            font-display: swap;\
        }\
        "
        )
      );
      document.head.appendChild(newStyle);
      (<any>document).fonts.ready.then(function() {
        let div =  document.createElement('div');
        div.innerHTML  = "测试字体";
        div.style.fontFamily = resource.name;
        FontManager.fontDiv.appendChild(div);
        // setTimeout(()=>{ FontManager.fontDiv.removeChild(div);},10)
        next();
      });
      return;
    }
    if(resource.extension === "fnt"){
      let xhr = resource.xhr;
      if(!xhr || !xhr.responseText){
        throw new Error("加载bitmap字体失败");
      }
      let baseurl = resource.url.substring(0,resource.url.lastIndexOf("/")+1);
      let ress = [];
      let responseText = xhr.responseText;
      let bitmapFontData =  ParseBitmapFont.parse(responseText);
      for(let i=0;i<bitmapFontData.pages.length;i++){
        let page = bitmapFontData.pages[i];
        let alias = "fnt————"+page.file.substring(0,page.file.indexOf("."));
        page.alias = alias;
        ress.push({url:baseurl+page.file,alias});
      }
      (<any>resource).BitmapFontData = bitmapFontData;
      if(ress.length == 0){
        next();
        return;
      }
      let load = new PIXI.Loader();
      ress.forEach((v)=>{
        load.add(v.alias,v.url);
      });
      load.onComplete.add(()=>{
        load.reset();
        ParseBitmapFont.parseTexture(bitmapFontData);
        next();
      });
      load.onProgress.add((loader: PIXI.Loader, resource: PIXI.LoaderResource)=>{
        let alias = resource.name;
        bitmapFontData.pages.forEach((page)=>{
          if(page.alias == alias){
            page.texture = resource.texture;
          }
        })
      });
      load.load();
      return;
    }
    next();
    
  }
  private static loadCss(): {} {
    return {};
  }
}
