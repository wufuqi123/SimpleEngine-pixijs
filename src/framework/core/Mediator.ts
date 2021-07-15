import * as PIXI from "pixi.js";

export abstract class Mediator<T = any> {
  view: T;
  abstract initialize?(): void;
  abstract destroy?(): void;
}

export function mediate(mediatorClass: any): ClassDecorator {
  return function(target: any) {
    // console.log(mediatorClass, target)
    // save a reference to the original constructor
    let original = target;

    // a utility function to generate instances of a class
    function construct(constructor:any, args:any) {
      let c: any = function() {
        return constructor.apply(this, args);
      };
      c.prototype = constructor.prototype;

      let instance = new c();

      // create and assign the mediator to the instance
      let mediator: Mediator = new mediatorClass();
      mediator.view = instance;

      //
      // TODO: REFACTOR THIS
      // YOU PROBABLY WON'T, RIGHT?!
      // LET'S MAKE THIS COMMENT REALLY BIG THEN
      // YOU CAN REMEMBER
      // BYE
      //
      if (instance instanceof PIXI.DisplayObject) {
        instance.on("added", () => {
          if (mediator.initialize) {
            mediator.initialize();
          }
        });
        instance.on("removed", () => {
          if (mediator.destroy) {
            mediator.destroy();
          }
        });
      } else if (mediator.initialize) {
        mediator.initialize();
      }

      Object.defineProperty(instance, "$mediator", {
        value: mediator,
        enumerable: false,
        configurable: true,
        writable: true
      });

      return instance;
    }

    // the new constructor behaviour
    let f: any = function(...args) {
      // console.log("New: " + original.name);
      return construct(original, args);
    };

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;

    // return new constructor (will override original)
    return f;
  };
}

export function action(name: string): MethodDecorator {
  return function(target, key, descriptor) {
    // save a reference to the original method this way we keep the values currently in the
    // descriptor and don't overwrite what another decorator might have done to the descriptor.
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(target, key);
    }

    var originalMethod = descriptor.value as any;

    //editing the descriptor/value parameter
    (<any>descriptor).value = function() {
      var result = originalMethod.apply(this, arguments);

      // call mediator method
      if (this.$mediator && this.$mediator[name]) {
        this.$mediator[name].apply(this.$mediator, arguments);
      }

      return result;
    };

    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
  };
}
