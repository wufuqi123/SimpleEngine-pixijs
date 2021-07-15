import { AudioGroupInterface } from "./AudioGroupInterface";
import { AudioInterface } from "./AudioInterface";

export interface AudioGroupManagerInterface {
  getGroup(groupName:string):AudioGroupInterface;
  addAudio(audio:AudioInterface):void;
  remove(audio:AudioInterface):void;
  getAudios(groupName?:string):Array<AudioInterface>;
  getAlias(groupName?:string):Array<string>;
  hasAlias(alias:string,groupName?:string):boolean;
}