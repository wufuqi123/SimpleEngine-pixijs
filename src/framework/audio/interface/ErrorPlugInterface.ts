export interface ErrorPlugInterface {
    /**
     * 内存未找到资源
     * @param resName 
     * @param e 
     */
    memoryNotFound?(resName:string,e:Error):void;
    /**
     * 全部资源报错
     * @param resName 
     * @param e 
     */
    error?(resName:string,e:Error):void;

}