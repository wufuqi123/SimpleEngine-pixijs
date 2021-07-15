export class SensitiveWordConfig {
    public static mSensitiveWordMap: any;
    public static END_MARK = "isEnd";
    public static WORD_END = "1";
    public static WORD_NO_END = "0";
    public static REPLACE_CHAR = "*";
    /**
     * 只过滤最小敏感词
     */
    public static MIN_MATCH_TYPE = 1;
    /**
     * 过滤所有敏感词
     */
    public static MAX_MATCH_TYPE = 2;

}