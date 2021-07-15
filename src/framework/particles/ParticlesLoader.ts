import { LoaderResource } from "pixi.js";
import { ParticleData } from "./ParticleData";
import { ResManager } from "../core/ResManager";
import { UUIDUtils } from "../utils/UUIDUtils";
/**
 * 粒子加载
 */
export class ParticlesLoader {
  private static suffix: string[] = ["particle"];
  public static use(resource: LoaderResource, next: () => void): void {
    if (
      resource.extension &&
      ParticlesLoader.suffix.includes(resource.extension)
    ) {
      resource.data = JSON.parse(resource.data);
      let path = resource.url.substring(0, resource.url.lastIndexOf("/") + 1);
      let _atlas_page_ = "_atlas_page_";
      let atlas = {
        names: [],
        pages: [],
        urls: [],
      };
      let loadArr = new Array();
      let textureArr = new Array();
      let particleData = new ParticleData();
      particleData.atlas = atlas;
      particleData.textureArr = textureArr;
      particleData.emitterConfig = resource.data.emitterConfig;
      (<any>resource).particleData = particleData;
      resource.data.urls.forEach((url: string) => {
        if (typeof url != "string" || url.length == 0) {
          return;
        }
        if (url.indexOf("/") == 0) {
          url = url.substring(1, url.length);
        }
        if (url.indexOf("./") == 0) {
          url = url.substring(2, url.length);
        }
        let name = ParticlesLoader.getName(url);
        atlas.names.push(resource.name + _atlas_page_ + name);
        atlas.pages.push(name);
        atlas.urls.push(path + url);
        loadArr.push({
          name: resource.name + _atlas_page_ + name,
          url: path + url,
          type: "image",
        });
      });
      resource.data.base64Arr.forEach((base64: string) => {
        if (typeof base64 != "string" || base64.length == 0) {
          return;
        }
       
        let name = UUIDUtils.getUUID();
        atlas.names.push(resource.name + _atlas_page_ + name);
        atlas.pages.push(name);
        atlas.urls.push(base64);
        loadArr.push({
          name: resource.name + _atlas_page_ + name,
          url: base64,
          type: "image",
        });
      });
      ResManager.loadResArr(loadArr, undefined, () => {
        atlas.pages.forEach((atla) => {
          textureArr.push(
            ResManager.getRes(resource.name + _atlas_page_ + atla)
          );
        });
      });
      next();
    } else {
      next();
    }
  }
  public static getName(url: string) {
    let name = url.substring(0, url.indexOf("."));
    if (name.indexOf("/") != -1) {
      name = name.substring(name.lastIndexOf("/") + 1, name.length);
    }
    return name;
  }
}
