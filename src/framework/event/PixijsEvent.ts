import { InteractionManager } from "pixi.js";

//解决浏览器事件兼容
(<any>InteractionManager).prototype.addEvents = function () {
    if (this.eventsAdded || !this.interactionDOMElement) {
        return;
    }
    var style = this.interactionDOMElement.style;
    if (window.navigator.msPointerEnabled) {
        style.msContentZooming = 'none';
        style.msTouchAction = 'none';
    }
    else if (this.supportsPointerEvents) {
        style.touchAction = 'none';
    }
    if (this.supportsPointerEvents) {
        window.document.addEventListener('pointermove', this.onPointerMove, true);
        this.interactionDOMElement.addEventListener('pointerdown', this.onPointerDown, true);
        this.interactionDOMElement.addEventListener('pointerleave', this.onPointerOut, true);
        this.interactionDOMElement.addEventListener('pointerover', this.onPointerOver, true);
        window.addEventListener('pointercancel', this.onPointerCancel, true);
        window.addEventListener('pointerup', this.onPointerUp, true);
    }
    else {
        window.document.addEventListener('mousemove', this.onPointerMove, true);
        this.interactionDOMElement.addEventListener('mousedown', this.onPointerDown, true);
        this.interactionDOMElement.addEventListener('mouseout', this.onPointerOut, true);
        this.interactionDOMElement.addEventListener('mouseover', this.onPointerOver, true);
        window.addEventListener('mouseup', this.onPointerUp, true);
    }
    if (this.supportsTouchEvents) {
        this.interactionDOMElement.addEventListener('touchstart', this.onPointerDown, {capture:true,passive:false});
        this.interactionDOMElement.addEventListener('touchcancel', this.onPointerCancel, {capture:true,passive:false});
        this.interactionDOMElement.addEventListener('touchend', this.onPointerUp, {capture:true,passive:false});
        this.interactionDOMElement.addEventListener('touchmove', this.onPointerMove, {capture:true,passive:false});
    }
    this.eventsAdded = true;
  };