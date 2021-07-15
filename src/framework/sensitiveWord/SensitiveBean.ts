export class SensitiveBean {
    private text: string;
    private matchType: number;

    public getText(): string {
        return this.text;
    }

    public setText(text: string) {
        this.text = text;
    }

    public getMatchType(): number {
        return this.matchType;
    }

    public setMatchType(matchType: number) {
        this.matchType = matchType;
    }

    public constructor(text: string, matchType: number) {
        this.text = text;
        this.matchType = matchType;
    }
}
