import { Pager } from "../../components/Pager";

export interface PagerPlugInterface {
  init(pager: Pager): void;
  destroy(): void;
}
