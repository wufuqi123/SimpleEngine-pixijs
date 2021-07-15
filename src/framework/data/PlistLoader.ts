import { LoaderResource } from "pixi.js";
import { PlistParser } from "../fInterpreter/PlistParser";

/**
 * plist  解析器
 */
export class PlistLoader {
    private static suffix: string[] = ["plist"];
    public static use(resource: LoaderResource, next: () => void): void {
        if (resource.extension && PlistLoader.suffix.includes(resource.extension)) {
            let data = <string>resource.data;
            let sax = new PlistParser();
            (<any>resource).plist = sax.parse(data);
            next();
            return;
        }
        next();
    }
}