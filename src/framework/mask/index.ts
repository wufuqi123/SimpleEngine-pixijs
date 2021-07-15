import { systems } from "pixi.js";
systems.StencilSystem.prototype.push = function (maskData) {
  var maskObject = maskData.maskObject;
  var gl = this.renderer.gl;
  var prevMaskCount = (<any>maskData)._stencilCounter;
  if (prevMaskCount === 0) {
    // force use stencil texture in current framebuffer
    (<any>this).renderer.framebuffer.forceStencil();
    gl.enable(gl.STENCIL_TEST);
  }
  (<any>maskData)._stencilCounter++;
  // Increment the reference stencil value where the new mask overlaps with the old ones.
  gl.colorMask(false, false, false, false);
  gl.stencilFunc(gl.EQUAL, prevMaskCount, (<any>this)._getBitwiseMask());
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
  maskObject.renderable = true;
  (<any>maskObject).render(this.renderer);
  this.renderer.batch.flush();
  maskObject.renderable = false;
  // console.log(" push hhhhhhhhh",maskObject.reverseMask),
  (<any>this)._useCurrent((<any>maskObject).reverseMask);
};
(<any>systems.StencilSystem.prototype)._useCurrent = function (reverseMask: boolean) {
  var gl = this.renderer.gl;
  gl.colorMask(true, true, true, true);
  gl.stencilFunc(
    reverseMask ? gl.NOTEQUAL : gl.EQUAL,
    (<any>this).getStackLength(),
    (<any>this)._getBitwiseMask()
  );
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
};
