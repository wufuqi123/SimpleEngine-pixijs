import { Point } from "pixi.js";
import { Canvas } from "./Canvas";
import { ProgressBar } from "./ProgressBar";


/**
 * 遮罩进度条
 */
export class MaskProgressBar extends ProgressBar {

    protected progressMask!: Canvas;
    /**
     * 绘制图片
     */
    draw() {
        super.draw();
        if (!this.progressMask) {
            this.progressMask = new Canvas();
            this.progressSprite.maskComponent = this.progressMask;
            // this.progressSprite.addChild(this.progressMask);
        }
    }

    /**
     * 设置进度 UI
     */
    protected setProgressLayout() {
        let p = this.progressSprite.getGlobalPosition();
        let size = this.progressSprite.toGlobal(new Point(this.width * this.progress,this.height))
        this.progressSprite.width = this.width;
        this.progressMask.clear();
        this.progressMask.beginFill(0x000000);
        this.progressMask.drawRect(p.x, p.y, Math.abs(p.x - size.x), Math.abs(p.y - size.y));
        this.progressMask.endFill();
    }
}