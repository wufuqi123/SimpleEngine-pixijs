import { SensitiveWordConfig } from "./SensitiveWordConfig";

import { Thread } from "../thread/Thread";

/**
 * 敏感字解析器   使用多线程  异步执行
 */
export class SensitivewordEngine extends Thread {
    private map!: any;
    private WORD_END!: string;
    private END_MARK!: string;
    private REPLACE_CHAR!: string;
    private MIN_MATCH_TYPE!: number;
    private MAX_MATCH_TYPE!: number;

    /**
     * run  方法，线程执行的入口
     * @param text 
     * @param matchType 
     * @param replaceChar 
     */
    public run(text: string, matchType: number, replaceChar: string) {
        let str = this.replaceSensitiveWord(text, matchType, replaceChar);
        this.emit("parse", str);
    }

    /**
     * 开始执行线程任务
     * @param text 
     * @param matchType 
     * @param replaceChar 
     */
    public start(text: string, matchType: number, replaceChar: string) {
        this.map = SensitiveWordConfig.mSensitiveWordMap;
        this.WORD_END = SensitiveWordConfig.WORD_END;
        this.END_MARK = SensitiveWordConfig.END_MARK;
        this.REPLACE_CHAR = SensitiveWordConfig.REPLACE_CHAR;
        this.MIN_MATCH_TYPE = SensitiveWordConfig.MIN_MATCH_TYPE;
        this.MAX_MATCH_TYPE = SensitiveWordConfig.MAX_MATCH_TYPE;
        super.start(text, matchType, replaceChar)
    }

    /**
    * 获取敏感词数量
    * @return
    */
    public getWordSize(): number {
        if (!this.map) {
            return 0;
        }
        return this.map.size;
    }

    /**
     *  是否包含敏感词
     * @param text
     * @param matchType
     * @return
     */
    public isContaintSensitiveWord(text: string, matchType: number): boolean {
        let flag = false;
        for (let i = 0; i < text.length; i++) {
            let matchFlag = this.checkSensitiveWord(text, i, matchType);
            if (matchFlag > 0) {
                flag = true;
            }
        }
        return flag;
    }

    /**
    * 检查敏感词数量
    * @param text
    * @param beginIndex
    * @param matchType
    * @return
    */
    private checkSensitiveWord(text: string, beginIndex: number, matchType: number): number {
        let flag = false;
        let matchFlag = 0;
        let word;
        let nowMap = this.map;
        for (let i = beginIndex; i < text.length; i++) {
            word = text.charAt(i);
            nowMap = nowMap[word];
            if (nowMap != null) {
                matchFlag++;
                if (this.WORD_END == nowMap[this.END_MARK]) {
                    flag = true;
                    if (this.MIN_MATCH_TYPE == matchType) {
                        break;
                    }
                }
            } else {
                break;
            }
        }
        if (!flag) {
            matchFlag = 0;
        }
        return matchFlag;
    }

    /**
     * 获取敏感词内容
     * @param text
     * @param matchType
     * @return
     */
    public getSensitiveWord(text: string, matchType: number): Set<string> {
        let sensitiveWordList = new Set<string>();
        for (let i = 0; i < text.length; i++) {
            let length = this.checkSensitiveWord(text, i, matchType);
            if (length > 0) {
                sensitiveWordList.add(text.substring(i, i + length));
                i = i + length - 1;
            }
        }
        return sensitiveWordList;
    }


    /**
      * 替换敏感词
      * @param text
      * @param matchType
      * @param replaceChar
      * @return
      */
    public replaceSensitiveWord(text: string, matchType: number, replaceChar: string): {str:string,isDirty:boolean} {
        let resultText = text;
        let lowerStr = resultText.toLowerCase();
        let str = "";
        let sensitiveWord = this.getSensitiveWord(lowerStr, matchType);
        let replaceString;
        sensitiveWord.forEach((word, key) => {
            replaceString = this.getReplaceChars(replaceChar, word.length);
            str = lowerStr.replace(new RegExp(word, "g"), replaceString);
            lowerStr = str;
        })
        let stringBuilder = "";
        if (str.length == 0) {
            return {str:resultText,isDirty:sensitiveWord.size!=0};
        }
        for (let i = 0; i < resultText.length; i++) {
            let c = resultText.charAt(i);
            let c1 = str.charAt(i);
            if (this.REPLACE_CHAR == c1) {
                stringBuilder += c1;
            } else {
                stringBuilder += c;
            }
        }
        return {str:stringBuilder,isDirty:sensitiveWord.size!=0};
    }


    /**
    * 根据length获取replaceChar*length的字符串
    * @param replaceChar
    * @param length
    * @return
    */
    private getReplaceChars(replaceChar: string, length: number): string {
        let resultReplace = replaceChar;
        for (let i = 1; i < length; i++) {
            resultReplace += replaceChar;
        }
        return resultReplace;
    }

}