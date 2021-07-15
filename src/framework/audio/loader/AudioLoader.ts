import { Timer } from "../../timer/Timer";
import { LoaderResource } from "pixi.js";
import { Log } from "../../log/Log";
import { AudioManager } from "../AudioManager";
import { AudioType } from "../AudioType";

export class AudioLoader {
  public static suffix: string[] = ["mp3", "ogg", "wav", "aac"];
  private static loadAudio: Array<{
    next: () => void;
    resource: LoaderResource;
  }> = new Array();
  //当前 声音加载最大线程数
  private static threadCount = 3;
  //当前加载了几个
  private static idle: number = 0;
  public static use(resource: LoaderResource, next: () => void): void {
    if (resource.extension && AudioLoader.suffix.includes(resource.extension)) {
      resource.xhr = null;
      //把任务加载到队列中
      AudioLoader.loadAudio.push({
        resource,
        next,
      });
      //加载最大线程数
      for (let i = AudioLoader.idle; i < AudioLoader.threadCount; i++) {
        AudioLoader.pop();
      }
    } else {
      next();
    }
  }
  //加载一次
  private static pop() {
    if (AudioLoader.idle > AudioLoader.threadCount) {
      return;
    }
    let audioObj = AudioLoader.loadAudio.pop();
    if (!audioObj) {
      return;
    }
    AudioLoader.idle++;
    let next = audioObj.next;
    let resource = audioObj.resource;

    AudioLoader.loadData(resource, () => {
      AudioLoader.idle--;
      for (let i = AudioLoader.idle; i < AudioLoader.threadCount; i++) {
        AudioLoader.pop();
      }
      Timer.setTimeout(() => {
        next();
      }, 10);
    });
  }

  //真实的走网络加载
  private static loadData(resource: LoaderResource, next: () => void) {
    resource.xhr = null;
    if (AudioManager.useAudioType == AudioType.AUDIO_CONTEXT) {
      resource.data = null;
      let xhr: any;
      try {
        xhr = new XMLHttpRequest();
      } catch (e) {
        try {
          xhr = new (<any>window).ActiveXObject("Microsoft.XMLHttp");
        } catch (e) {}
      }
      if (!xhr) {
        resource.error = new Error(
          "资源加载出错！！！网络资源异常！" + resource.url + "\n"
        );
        next();
        return;
      }
      xhr.open("GET", resource.url, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        if (xhr.readyState === 4) {
          if (xhr.status == 200 || xhr.status == 304) {
            resource.data = xhr.response;
            xhr = undefined;
            AudioManager.loadAudio(resource, next);
          } else {
            resource.error = new Error(
              "code:" +
                xhr.status +
                ":资源加载出错！！！网络资源异常！" +
                resource.url +
                "\n"
            );
            next();
          }
        }
      };
      xhr.onerror = function () {
        resource.error = new Error(
          "资源加载出错！！！网络资源异常！" + resource.url + "\n"
        );
        next();
      };
      xhr.send();
    } else if (AudioManager.useAudioType == AudioType.HTML) {
      AudioManager.loadAudio(resource, next);
    } else {
      resource.error = new Error(
        "资源加载出错！！！网络资源异常！" + resource.url + "\n"
      );
      next();
    }
  }
}
