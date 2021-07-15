import { ResManager } from "../core/ResManager";

let readSkeletonData = PIXI.spine.core.SkeletonJson.prototype.readSkeletonData;
/**
 * 读取spine数据
 * 
 * 为什么要重写此函数（重要）
 *         此函数有被异步加载调用， js trycatch不了异步的报错！
 * 
 * 添加spine报错时   定位哪一个spine的处理
 */
PIXI.spine.core.SkeletonJson.prototype.readSkeletonData = function(json: string | any): PIXI.spine.core.SkeletonData{
    try {
        return readSkeletonData.call(this,json);
    } catch (error) {
        console.log(json,this);
        let imgNameArr = new Array();
        let atlas = this.attachmentLoader?(<any>this.attachmentLoader).atlas:undefined;
        if(atlas && Array.isArray(atlas.pages)){
            //拿到spine图片路径，SkeletonJson类里只能通过图片来确定spine。
            atlas.pages.forEach((element:{name:string}) => {
                if(element && !imgNameArr.includes(element.name)){
                    imgNameArr.push(element.name);
                }
            });
        }
        // throw error;
        throw new Error(`spine异常  报错的spine图片:[${imgNameArr.toString()}]。\n${error.toString()}`);
    }
}

// /**
//  * spine加载解析
//  * 
//  * 添加spine报错时   定位哪一个spine的处理
//  */
// export class SpineLoadAtlasParser implements PIXI.ILoaderPlugin{
//     static spineUse:Function|undefined;
//     public static use(resource: PIXI.LoaderResource, next: () => any):any{
//         // console.log("askldhjjkasd","你好啊！",resource,SpineLoadAtlasParser.spineUse)
//         try{
//             if(SpineLoadAtlasParser.spineUse){
//                 SpineLoadAtlasParser.spineUse(resource,next);
//             }
//         }catch(e){
//             throw new Error(`spine异常  报错的spine:${resource.name}。\n${e.toString()}`);
//         }
//     }
//     public static init(){
//         let loader = <any>PIXI.Loader;
//         if(Array.isArray(loader._plugins)){
//             loader._plugins.remove(PIXI.spine.AtlasParser);
//         }
//         let loaderObj = <any>ResManager.resLoader;
//         if(Array.isArray(loaderObj._afterMiddleware)){
//             if(loaderObj._afterMiddleware.includes(PIXI.spine.AtlasParser.use)){
//                 loaderObj._afterMiddleware.remove(PIXI.spine.AtlasParser.use)
//             }
//         }
//         SpineLoadAtlasParser.spineUse = PIXI.spine.AtlasParser.use.bind(ResManager.resLoader);
//         ResManager.resLoader.use(SpineLoadAtlasParser.use);
//     }
// }