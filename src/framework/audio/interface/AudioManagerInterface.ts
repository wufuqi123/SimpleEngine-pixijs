import { LoaderResource } from "pixi.js";
import { AudioInterface } from "./AudioInterface";

export interface AudioManagerInterface {
  globalVolume: number;
  readonly isGlobalPause: boolean;
  readonly isOffsetPause: boolean;
  globalSpeed: number;
  update:(dt:number)=>void;
  muteAll:()=>void;
  unmuteAll:()=>void;
  pauseAll:()=>void;
  resumeAll:()=>void;
  globalPause:()=>void;
  globalResume:()=>void;
  play:(alias: string)=>AudioInterface;
  exists:(alias: string)=>boolean;
  release:(alias: string)=>void;
  releaseAll:()=>void;
  stopAll:()=>void;
  destroyAlias:(alias: string)=>void;
  destroyAll:()=>void;
  loadAudio:(resource: LoaderResource,callback:()=>void)=>void;
}