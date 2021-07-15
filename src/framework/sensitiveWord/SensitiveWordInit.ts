import { Thread } from "../thread/Thread";
import { SensitiveWordConfig } from "./SensitiveWordConfig";

/**
 * 敏感字词库  初始化工具
 */
export class SensitiveWordInit extends Thread {

    /**
     * 不让new
     */
    private constructor() {
        super();
    }


    /**
    * 初始化敏感词词库
    * @param sensitiveWords
    * @return
    */
    public static initKeyWord(sensitiveWords: Array<string>, callback: (map: Map<string, any> | undefined) => void) {
        let init = new SensitiveWordInit();
        init.on("onParseEnd", (map) => {
            init.close();
            callback(map);
        });
        init.start(sensitiveWords, SensitiveWordConfig.END_MARK, SensitiveWordConfig.WORD_NO_END, SensitiveWordConfig.WORD_END);

    }

    /**
     * run  方法，线程执行的入口
     * @param sensitiveWords 
     * @param END_MARK 
     * @param WORD_NO_END 
     * @param WORD_END 
     * @returns 
     */
    run(sensitiveWords: Array<string>, END_MARK: string, WORD_NO_END: string, WORD_END: string) {
        this.emit("onParseStart")
        if (sensitiveWords == null) {
            this.emit("onParseEnd")
            return null;
        }

        let keyWordArr: Set<string> = new Set();
        for (let i = 0; i < sensitiveWords.length; i++) {
            let s = sensitiveWords[i];
            keyWordArr.add(s.trim());
        }
        // 将敏感词库加入到HashMap中
        let map = this.addSensitiveWordToHashMap(keyWordArr, END_MARK, WORD_NO_END, WORD_END);
        this.emit("onParseEnd", map);
        // return SensitiveWordConfig.mSensitiveWordMap;
    }

    /**
    * 将敏感词库加入到HashMap中
    * @param keyWordSet
    */
    private addSensitiveWordToHashMap(keyWordArr: Set<string>, END_MARK: string, WORD_NO_END: string, WORD_END: string) {
        let map = {};
        let nowMap;
        let newWordMap: any;
        keyWordArr.forEach(key => {
            nowMap = map;
            for (let i = 0; i < key.length; i++) {
                let keyChar = key.charAt(i);
                let wordMap: any = nowMap[keyChar];
                if (wordMap) {
                    nowMap = wordMap;
                } else {
                    newWordMap = {};
                    newWordMap[END_MARK] = WORD_NO_END;
                    nowMap[keyChar] = newWordMap;
                    nowMap = newWordMap;
                }

                if (i == key.length - 1) {
                    nowMap[END_MARK] = WORD_END;
                }
            }
        });
        return map;
    }
}