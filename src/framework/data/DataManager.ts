import { CSVLoader } from "./CSVLoader";
import { ResManager } from "../core/ResManager";
import { PlistLoader } from "./PlistLoader";
export class DataManager {
  public static fontDiv: HTMLElement;
  public static init() {
    ResManager.resLoader.use(CSVLoader.use);
    ResManager.resLoader.use(PlistLoader.use);
  }
}