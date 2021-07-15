import { Pager } from "../../components/Pager";
// import { Log } from "../../../../framework";
import { Component } from "@/framework/core/Component";
import { AdapterContainer } from "../../components/AdapterContainer";
import { PagerPlugInterface } from "./PagerPlugInterface";

export class ScalePagerPlug implements PagerPlugInterface {
  pager!: Pager;
  pagerItemWidth: number = 0;
  currPage: number = 0;
  scrollerX: number = 0;
  lastPage: number = 0;
  limitX: number = 0;
  startTouchX: number = 0;
  moveOffset: number = 0;

  minScale: number = 1;
  maxScale: number = 1.2;
  size: number = 0;
  init(pager: Pager) {
    if (pager == this.pager) {
      return;
    }
    if (this.pager) {
      this.pager.plug = undefined;
      this.pager.off("chage");
      this.pager.off("scroll");
      // this.pager.off("endTouch");
      // this.pager.off("moveTouch");
      // this.pager.off("endTouch");
    }
    this.pager = pager;
    this.currPage = this.pager.page;
    this.lastPage = this.currPage;
    this.size = this.pager.size;
    if (this.pager.currContainerChildren.length != 0) {
      this.pagerItemWidth = this.pager.currContainerChildren[0].width;
    } else {
      this.pagerItemWidth = 0;
    }
    this.limitX = this.pagerItemWidth + this.pager.gap;
    this.scrollerX = 0;
    pager.on("chage", this.onChage.bind(this));
    pager.on("scroll", this.scroll.bind(this));
    // pager.on("startTouch", this.startTouch.bind(this));
    // pager.on("moveTouch", this.moveTouch.bind(this));
    // pager.on("endTouch", this.endTouch.bind(this));
  }
  findPagerByItem(pager: number): AdapterContainer | undefined {
    let children = this.pager.currContainerChildren;
    let currView = undefined;
    children.forEach((view) => {
      let v = <AdapterContainer>view;
      if (pager == v._CurrIndex) {
        currView = view;
      }
    });
    return currView;
  }
  onChage(pager: number) {
    this.currPage = pager;
    this.lastPage = pager;
    this.size = this.pager.size;
    if (this.pager.currContainerChildren.length != 0) {
      this.pagerItemWidth = this.pager.currContainerChildren[0].width;
    } else {
      this.pagerItemWidth = 0;
    }
    this.limitX = this.pagerItemWidth + this.pager.gap;
    if (pager == 0) {
      this.scrollerX = this.limitX;
    } else {
      this.scrollerX = 0;
    }
    this.pager.currContainerChildren.forEach((view: Component) => {
      view.scale.set(this.minScale);
    });
    let view = this.findPagerByItem(pager);
    view && view.scale.set(this.maxScale);
    //Log.info(pager, "pager chage");
  }
  scroll(offsetX: number, offsetY: number) {
    if (this.pager.orientation == Pager.ORIENTATION.HORIZONTAL)
      this.HScroll(offsetX);
    else if (this.pager.orientation == Pager.ORIENTATION.VERTICLE)
      this.VScroll(offsetY);
  }
  VScroll(offsetY: number) {
    this.moveOffset = offsetY;
    this.scrollerX += offsetY;
    if (Math.abs(this.scrollerX) > this.limitX) {
      this.scrollerX = this.scrollerX > 0 ? this.limitX : -this.limitX;
    }
    let pager = this.pager.findCurrPage();

    if (pager != this.currPage) {
      //Log.info("pager 改变", pager, this.currPage);
      this.currPage = pager;
      this.scrollerX = 0;
    }
    let nextView = undefined;
    let currView = undefined;
    let cs = 1;
    let ns = 1;
    let normal = offsetY < 0;
    if (this.scrollerX < 0) {
      currView = this.findPagerByItem(pager);
      nextView = this.findPagerByItem(pager + 1);
      if (pager == this.size - 1) {
        this.scrollerX = 0;
        return;
      }
      cs =
        (this.scrollerX / this.limitX) * (this.maxScale - this.minScale) +
        this.maxScale;
      ns =
        Math.abs(this.scrollerX / this.limitX) *
          (this.maxScale - this.minScale) +
        this.minScale;
      if (normal) {
      }
      //Log.info("pager 呵呵哒", "右", normal, cs, ns);
    } else {
      if (pager == 0 && this.scrollerX >= this.limitX) {
        this.scrollerX = this.limitX;
        return;
      }
      normal = offsetY > 0;
      currView = this.findPagerByItem(pager + 1);
      nextView = this.findPagerByItem(pager);
      cs =
        -(this.scrollerX / this.limitX) * (this.maxScale - this.minScale) +
        this.maxScale;
      ns =
        Math.abs(this.scrollerX / this.limitX) *
          (this.maxScale - this.minScale) +
        this.minScale;
      //Log.info("pager 呵呵哒", "左", normal, cs, ns);
    }
    //Log.info("pager ppppp", pager, this.scrollerX, this.limitX, cs, ns);

    if (this.scrollerX == 0) {
      return;
    }
    if (cs > this.maxScale) {
      cs = this.maxScale;
    } else if (cs < this.minScale) {
      cs = this.minScale;
    }
    if (ns > this.maxScale) {
      ns = this.maxScale;
    } else if (ns < this.minScale) {
      ns = this.minScale;
    }
    if (
      currView &&
      ((normal && currView.scale.x > cs) || (!normal && currView.scale.x < cs))
    ) {
      currView.scale.set(cs);
    }
    if (
      nextView &&
      ((normal && nextView.scale.x < ns) || (!normal && nextView.scale.x > ns))
    ) {
      nextView.scale.set(ns);
    }
    // currView && currView.scale.set(cs);
    // nextView && nextView.scale.set(ns);
    //Log.info(pager, this.scrollerX, "pager scroll");
  }
  HScroll(offsetX: number) {
    this.moveOffset = offsetX;
    this.scrollerX += offsetX;
    if (Math.abs(this.scrollerX) > this.limitX) {
      this.scrollerX = this.scrollerX > 0 ? this.limitX : -this.limitX;
    }
    let pager = this.pager.findCurrPage();

    if (pager != this.currPage) {
      //Log.info("pager 改变", pager, this.currPage);
      this.currPage = pager;
      this.scrollerX = 0;
    }
    let nextView = undefined;
    let currView = undefined;
    let cs = 1;
    let ns = 1;
    let normal = offsetX < 0;
    if (this.scrollerX < 0) {
      currView = this.findPagerByItem(pager);
      nextView = this.findPagerByItem(pager + 1);
      if (pager == this.size - 1) {
        this.scrollerX = 0;
        return;
      }
      cs =
        (this.scrollerX / this.limitX) * (this.maxScale - this.minScale) +
        this.maxScale;
      ns =
        Math.abs(this.scrollerX / this.limitX) *
          (this.maxScale - this.minScale) +
        this.minScale;
      if (normal) {
      }
      //Log.info("pager 呵呵哒", "右", normal, cs, ns);
    } else {
      if (pager == 0 && this.scrollerX >= this.limitX) {
        this.scrollerX = this.limitX;
        return;
      }
      normal = offsetX > 0;
      currView = this.findPagerByItem(pager + 1);
      nextView = this.findPagerByItem(pager);
      cs =
        -(this.scrollerX / this.limitX) * (this.maxScale - this.minScale) +
        this.maxScale;
      ns =
        Math.abs(this.scrollerX / this.limitX) *
          (this.maxScale - this.minScale) +
        this.minScale;
      //Log.info("pager 呵呵哒", "左", normal, cs, ns);
    }
    //Log.info("pager ppppp", pager, this.scrollerX, this.limitX, cs, ns);

    if (this.scrollerX == 0) {
      return;
    }
    if (cs > this.maxScale) {
      cs = this.maxScale;
    } else if (cs < this.minScale) {
      cs = this.minScale;
    }
    if (ns > this.maxScale) {
      ns = this.maxScale;
    } else if (ns < this.minScale) {
      ns = this.minScale;
    }
    if (
      currView &&
      ((normal && currView.scale.x > cs) || (!normal && currView.scale.x < cs))
    ) {
      currView.scale.set(cs);
    }
    if (
      nextView &&
      ((normal && nextView.scale.x < ns) || (!normal && nextView.scale.x > ns))
    ) {
      nextView.scale.set(ns);
    }
    // currView && currView.scale.set(cs);
    // nextView && nextView.scale.set(ns);
    //Log.info(pager, this.scrollerX, "pager scroll");
  }
  destroy() {
    if (this.pager) {
      this.pager.plug = undefined;
      this.pager.off("chage");
      this.pager.off("scroll");
      this.pager.off("endTouch");
      this.pager.off("moveTouch");
      this.pager.off("endTouch");
    }
  }
}
