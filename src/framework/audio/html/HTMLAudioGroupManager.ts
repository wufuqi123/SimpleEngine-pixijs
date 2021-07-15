import { AudioGroupInterface } from "../interface/AudioGroupInterface";
import { AudioInterface } from "../interface/AudioInterface";
import { HTMLAudioGroup } from "./HTMLAudioGroup";



export class HTMLAudioGroupManager {
  private mGroupMap:Map<string,AudioGroupInterface> = new Map();
  private constructor(){}
  protected static instance: HTMLAudioGroupManager;
  public static getInstance() {
    if (!this.instance) {
      this.instance = new HTMLAudioGroupManager();
    }
    return this.instance;
  }
  /**
   * 获取组
   * @param groupName 组名
   */
  public getGroup(groupName:string):AudioGroupInterface{
    let group = this.mGroupMap.get(groupName);
    if(!group){
      group = new HTMLAudioGroup();
      group.name = groupName;
      this.mGroupMap.set(groupName,group);
    }
    return group;
  }
  
  /**
   * 添加音频
   * @param audio 
   */
  public addAudio(audio:AudioInterface){
    this.getGroup(audio.group).addAudio(audio);
  }

  /**
   * 移除声音
   * @param audio 
   */
  public remove(audio:AudioInterface){
    if(audio.group == undefined){
      return;
    }
   this.getGroup(audio.group).remove(audio);
  }

  /**
   * 获取音频，groupName如果不填写则获取全部音频
   * @param groupName 
   */
  public getAudios(groupName?:string):Array<AudioInterface>{
    if(groupName){
      return this.getGroup(groupName).getAudios();
    }
    let arr = new Array();
    this.mGroupMap.forEach(g=>{
      g.getAudios().forEach(a=>{
        if(!arr.includes(a)){
          arr.push(a);
        }
      });
    });
    return arr;
  }

  /**
   * 获取资源名，groupName如果不填写则获取全部资源名
   * @param groupName 
   */
  public getAlias(groupName?:string):Array<string>{
    if(groupName){
      return this.getGroup(groupName).getAlias();
    }
    let arr = new Array();
    this.mGroupMap.forEach(g=>{
      g.getAlias().forEach(a=>{
        if(!arr.includes(a)){
          arr.push(a);
        }
      });
    });
    return arr;
  }
  /**
   * 资源是否存在,groupName如果不填写则在全部组里查询
   * @param alias 资源名
   * @param groupName 
   */
  public hasAlias(alias:string,groupName?:string):boolean{
    if(groupName){
      return this.getGroup(groupName).hasAlias(alias);
    }
    let isExist = false;
    this.mGroupMap.forEach(g=>{
      if(g.hasAlias(alias)){
        isExist = true;
      }
    });
    return isExist;
  }

}