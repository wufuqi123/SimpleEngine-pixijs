import { LoaderResource } from "pixi.js";
// import video from "video.js";
import { Log } from "../log/Log";
export class VideoLoader {
  private static suffix: string[] = ["mp4", "webm", "avi", "rmvb"];
  public static use(resource: LoaderResource, next: () => void): void {
    // console.log("use", resource);
    if (resource.extension && VideoLoader.suffix.includes(resource.extension)) {
      let video: HTMLVideoElement = resource.data;
      video.id = resource.name + "-" + VideoLoader.guid();
      video.preload = "auto";
      //内联播放
      video.setAttribute("src", resource.url);
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("x5-playsinline", "");
      //启用x5内核h5播放器
      video.setAttribute("x5-video-player-type", "h5");
      //不知道，网上说要设置
      video.setAttribute("x-webkit-airplay", "allow");
      // video.onended = () => {
      //   video.playbackRate = 1;
      //   video.muted = false;
      //   next();
      // };
      // video.muted = true;
      // let UA = navigator.userAgent.toLowerCase().toString();
      // if (typeof UA == "string" && UA.indexOf("mqqbrowser") != -1) {
      //   video.playbackRate = 8;
      // } else {
      //   video.playbackRate = 15;
      // }
      // video.play();
      let callback = function(){
        Log.info("heheheheheeh","加载完成")
        video.removeEventListener("canplaythrough",callback);
        next();
      };
      video.addEventListener("canplaythrough",callback)
      video.load();

      
    } else {
      next();
    }
  }
  private static loadCss(): {} {
    return {};
  }
  private static guid(): string {
    return "xxxxxxxx-xxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
