import { Log } from "../log/Log";
import { SaxParse } from "./SaxParse";

export class PlistParser extends SaxParse{
    parse  (xmlTxt:string) :any{
        let plist = this._parseXML(xmlTxt);
        if (plist.tagName !== 'plist') {
            Log.warn(`解析plist文件出错！`);
            return {};
        }

        // Get first real node
        let node = null;
        for (let i = 0, len = plist.childNodes.length; i < len; i++) {
            node = plist.childNodes[i];
            if (node.nodeType === 1)
                break;
        }
        return this._parseNode(node);
    }

    protected _parseNode(node:any) :any{
        let data = null, tagName = node.tagName;
        if(tagName === "dict"){
            data = this._parseDict(node);
        }else if(tagName === "array"){
            data = this._parseArray(node);
        }else if(tagName === "string"){
            if (node.childNodes.length === 1)
                data = node.firstChild.nodeValue;
            else {
                //handle Firefox's 4KB nodeValue limit
                data = "";
                for (let i = 0; i < node.childNodes.length; i++)
                    data += node.childNodes[i].nodeValue;
            }
        }else if(tagName === "false"){
            data = false;
        }else if(tagName === "true"){
            data = true;
        }else if(tagName === "real"){
            data = parseFloat(node.firstChild.nodeValue);
        }else if(tagName === "integer"){
            data = parseInt(node.firstChild.nodeValue, 10);
        }
        return data;
    }

    protected _parseArray(node:any) {
        let data = [];
        for (let i = 0, len = node.childNodes.length; i < len; i++) {
            let child = node.childNodes[i];
            if (child.nodeType !== 1)
                continue;
            data.push(this._parseNode(child));
        }
        return data;
    }

    protected _parseDict (node:any) {
        let data:any = {};
        let key = null;
        for (let i = 0, len = node.childNodes.length; i < len; i++) {
            let child = node.childNodes[i];
            if (child.nodeType !== 1)
                continue;

            // Grab the key, next noe should be the value
            if (child.tagName === 'key')
                key = child.firstChild.nodeValue;
            else
                data[key] = this._parseNode(child);                 // Parse the value node
        }
        return data;
    }
}