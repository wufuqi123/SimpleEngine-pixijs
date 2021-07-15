import { ParticlesLoader } from "./ParticlesLoader";
import { ResManager } from "../core/ResManager";

export class ParticlesManager {
  public static init() {
    ResManager.resLoader.use(ParticlesLoader.use);
  }
}