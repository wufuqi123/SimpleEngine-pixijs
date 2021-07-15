/**
 * 解析  xml
 */
export class SaxParse{
    protected _parser: DOMParser|null;
    constructor(){
        if (window.DOMParser) {
            this._parser = new DOMParser();
        } else {
            this._parser = null;
        }
    }

    /**
     * 解析xml文本
     * @param textxml 
     * @returns 
     */
    public parse(textxml:string):HTMLElement{
        return this._parseXML(textxml);
    }

    protected _parseXML(textxml:string):HTMLElement{
        var xmlDoc;
        if (this._parser) {
            xmlDoc = this._parser.parseFromString(textxml, "text/xml");
        } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(textxml);
        }
        return xmlDoc.documentElement;
    }
}