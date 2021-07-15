//http://tweenjs.github.io/tween.js/examples/03_graphs.html
export class Easing {
  public static linear(): Function {
    return function(t: number): number {
      return t;
    };
  }

  public static inQuad(): Function {
    return function(t: number): number {
      return t * t;
    };
  }

  public static outQuad(): Function {
    return function(t: number): number {
      return t * (2 - t);
    };
  }

  public static inOutQuad(): Function {
    return function(t: number): number {
      t *= 2;
      if (t < 1) return 0.5 * t * t;
      return -0.5 * (--t * (t - 2) - 1);
    };
  }

  public static inCubic(): Function {
    return function(t: number): number {
      return t * t * t;
    };
  }

  public static outCubic(): Function {
    return function(t: number): number {
      return --t * t * t + 1;
    };
  }

  public static inOutCubic(): Function {
    return function(t: number): number {
      t *= 2;
      if (t < 1) return 0.5 * t * t * t;
      t -= 2;
      return 0.5 * (t * t * t + 2);
    };
  }

  public static inQuart(): Function {
    return function(t: number): number {
      return t * t * t * t;
    };
  }

  public static outQuart(): Function {
    return function(t: number): number {
      return 1 - --t * t * t * t;
    };
  }

  public static inOutQuart(): Function {
    return function(t: number): number {
      t *= 2;
      if (t < 1) return 0.5 * t * t * t * t;
      t -= 2;
      return -0.5 * (t * t * t * t - 2);
    };
  }

  public static inQuint(): Function {
    return function(t: number): number {
      return t * t * t * t * t;
    };
  }

  public static outQuint(): Function {
    return function(t: number): number {
      return --t * t * t * t * t + 1;
    };
  }

  public static inOutQuint(): Function {
    return function(t: number): number {
      t *= 2;
      if (t < 1) return 0.5 * t * t * t * t * t;
      t -= 2;
      return 0.5 * (t * t * t * t * t + 2);
    };
  }

  public static inSine(): Function {
    return function(t: number): number {
      return 1 - Math.cos((t * Math.PI) / 2);
    };
  }

  public static outSine(): Function {
    return function(t: number): number {
      return Math.sin((t * Math.PI) / 2);
    };
  }

  public static inOutSine(): Function {
    return function(t: number): number {
      return 0.5 * (1 - Math.cos(Math.PI * t));
    };
  }

  public static inExpo(): Function {
    return function(t: number): number {
      return t === 0 ? 0 : Math.pow(1024, t - 1);
    };
  }

  public static outExpo(): Function {
    return function(t: number): number {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };
  }

  public static inOutExpo(): Function {
    return function(t: number): number {
      if (t === 0) return 0;
      if (t === 1) return 1;
      t *= 2;
      if (t < 1) return 0.5 * Math.pow(1024, t - 1);
      return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
    };
  }

  public static inCirc(): Function {
    return function(t: number): number {
      return 1 - Math.sqrt(1 - t * t);
    };
  }

  public static outCirc(): Function {
    return function(t: number): number {
      return Math.sqrt(1 - --t * t);
    };
  }

  public static inOutCirc(): Function {
    return function(t: number): number {
      t *= 2;
      if (t < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
      return 0.5 * (Math.sqrt(1 - (t - 2) * (t - 2)) + 1);
    };
  }

  public static inElastic(a = 0.1, p = 0.4): Function {
    return function(t: number): number {
      let s;
      if (t === 0) return 0;
      if (t === 1) return 1;
      if (!a || a < 1) {
        a = 1;
        s = p / 4;
      } else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
      return -(
        a *
        Math.pow(2, 10 * (t - 1)) *
        Math.sin(((t - 1 - s) * (2 * Math.PI)) / p)
      );
    };
  }

  public static outElastic(a = 0.1, p = 0.4): Function {
    return function(t: number): number {
      let s;
      if (t === 0) return 0;
      if (t === 1) return 1;
      if (!a || a < 1) {
        a = 1;
        s = p / 4;
      } else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
      return (
        a * Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1
      );
    };
  }

  public static inOutElastic(a = 0.1, p = 0.4): Function {
    return function(t: number): number {
      let s;
      if (t === 0) return 0;
      if (t === 1) return 1;
      if (!a || a < 1) {
        a = 1;
        s = p / 4;
      } else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
      t *= 2;
      if (t < 1)
        return (
          -0.5 *
          (a *
            Math.pow(2, 10 * (t - 1)) *
            Math.sin(((t - 1 - s) * (2 * Math.PI)) / p))
        );
      return (
        a *
          Math.pow(2, -10 * (t - 1)) *
          Math.sin(((t - 1 - s) * (2 * Math.PI)) / p) *
          0.5 +
        1
      );
    };
  }

  public static inBack(v?: number): Function {
    return function(t: number): number {
      let s = v || 1.70158;
      return t * t * ((s + 1) * t - s);
    };
  }

  public static outBack(v?: number): Function {
    return function(t: number): number {
      let s = v || 1.70158;
      return --t * t * ((s + 1) * t + s) + 1;
    };
  }

  public static inOutBack(v?: number): Function {
    return function(t: number): number {
      let s = (v || 1.70158) * 1.525;
      t *= 2;
      if (t < 1) return 0.5 * (t * t * ((s + 1) * t - s));
      return 0.5 * ((t - 2) * (t - 2) * ((s + 1) * (t - 2) + s) + 2);
    };
  }

  public static inBounce(): Function {
    return function(t: number): number {
      return 1 - Easing.outBounce()(1 - t);
    };
  }

  public static outBounce(): Function {
    return function(t: number): number {
      if (t < 1 / 2.75) {
        return 7.5625 * t * t;
      } else if (t < 2 / 2.75) {
        t = t - 1.5 / 2.75;
        return 7.5625 * t * t + 0.75;
      } else if (t < 2.5 / 2.75) {
        t = t - 2.25 / 2.75;
        return 7.5625 * t * t + 0.9375;
      } else {
        t -= 2.625 / 2.75;
        return 7.5625 * t * t + 0.984375;
      }
    };
  }

  public static inOutBounce(): Function {
    return function(t: number): number {
      if (t < 0.5) return Easing.inBounce()(t * 2) * 0.5;
      return Easing.outBounce()(t * 2 - 1) * 0.5 + 0.5;
    };
  }
}
