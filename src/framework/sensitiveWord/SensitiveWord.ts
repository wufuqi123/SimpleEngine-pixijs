import { TextUtils } from "../utils/TextUtils";
import { SensitiveBean } from "./SensitiveBean";
import { SensitiveWordConfig } from "./SensitiveWordConfig";
import { SensitivewordEngine } from "./SensitivewordEngine";
import { SensitiveWordInit } from "./SensitiveWordInit";

/**
 * 屏蔽字库工具
 * 
 * 使用方法：  
 * 1.先初始化敏感字词库   SensitiveWord.getInstance().initSensitiveWord(["我日","毛泽东"]);
 * 2.进行敏感字查询
 *          SensitiveWord.getInstance().addSensitiveWordTask("你好啊，我日，Mm 123",(text)=>{
 *              //当前text值为：   你好啊，**，Mm 123
 *          })
 */
export class SensitiveWord {
    private static mSensitiveWord: SensitiveWord;

    /**
     * 任务队列
     */
    private static taskQueue: Array<{ sensitiveBean: SensitiveBean, sensitiveCallback: (replaceText: string,isDirty:boolean) => void }> = new Array();

    /**
     * 最大任务数量
     */
    public static MAX_TASK_COUNT = 5;

    /**
     * 当前正在执行的任务数
     */
    private static currTaskNumber = 0;
    /**
     * 词库是否加载成功
     */
    private static isLoading: boolean = false;
    /**
     * 在词库没加载成功时的任务
     */
    private static noLoadingTaskMap: Map<SensitiveBean, (replaceText: string,isDirty:boolean) => void> = new Map();

    private constructor() { }
    /**
     * 获取单例实例
     * @returns 
     */
    public static getInstance(): SensitiveWord {
        if (!this.mSensitiveWord) {
            this.createInstance();
        }
        return this.mSensitiveWord;
    }

    /**
     * 创建一个实例对象
     * @returns 
     */
    private static createInstance(): SensitiveWord {
        if (this.mSensitiveWord == null) {
            this.mSensitiveWord = new SensitiveWord();
        }
        return this.mSensitiveWord;
    }


    /**
     * 初始化  过滤字词库    
     * @param sensitiveWords ["我日","毛泽东" ,...这种要过滤的字符串]
     */
    public initSensitiveWord(sensitiveWords: Array<string>) {
        SensitiveWordInit.initKeyWord(sensitiveWords, (map) => {
            SensitiveWord.isLoading = true;
            SensitiveWordConfig.mSensitiveWordMap = map;
            SensitiveWord.noLoadingTaskMap.forEach((sensitiveCallback, sensitiveBean) => {
                this.replaceSensitiveWord(sensitiveBean, sensitiveCallback);
            });
            SensitiveWord.noLoadingTaskMap.clear();
        });
    }

    /**
     * 执行过滤字   
     * @param text 要过滤的字
     * @param sensitiveCallback 过滤后返回新的字符串
     */
    public addSensitiveWordTask(text: string, sensitiveCallback: (replaceText: string,isDirty:boolean) => void) {
        this.addTask(new SensitiveBean(text, SensitiveWordConfig.MAX_MATCH_TYPE), sensitiveCallback);
    }


    /**
     * 执行过滤字  任务
     * @param sensitiveBean 
     * @param sensitiveCallback 
     * @returns 
     */
    private addTask(sensitiveBean: SensitiveBean, sensitiveCallback: (replaceText: string,isDirty:boolean) => void) {
        if (TextUtils.isEmpty(sensitiveBean.getText())) {
            sensitiveCallback(sensitiveBean.getText(),false);
            return;
        }
        if (!SensitiveWord.isLoading) {
            SensitiveWord.noLoadingTaskMap.set(sensitiveBean, sensitiveCallback);
            return;
        }
        if (SensitiveWord.MAX_TASK_COUNT <= SensitiveWord.currTaskNumber) {
            SensitiveWord.taskQueue.push({ sensitiveBean, sensitiveCallback });
            return;
        }
        SensitiveWord.currTaskNumber++;
        this.replaceSensitiveWord(sensitiveBean, sensitiveCallback);
    }


    /**
     * 替换敏感词
     * @return
     */
    private replaceSensitiveWord(sensitiveBean: SensitiveBean, sensitiveCallback: (replaceText: string,isDirty:boolean) => void) {
        let engine = new SensitivewordEngine();
        engine.on("parse", (textObj:{str: string;isDirty:boolean}) => {
            engine.close();
            sensitiveCallback(textObj.str,textObj.isDirty);
            SensitiveWord.currTaskNumber--;
            let data = SensitiveWord.taskQueue.pop();
            if (data) {
                this.addTask(data.sensitiveBean, data.sensitiveCallback);
            }
        })
        engine.start(sensitiveBean.getText(), sensitiveBean.getMatchType(), SensitiveWordConfig.REPLACE_CHAR);
    }

}