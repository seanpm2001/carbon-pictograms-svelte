/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface TradeoffAnalyticsProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap["svg"]> {
  /**
   * Set a tabindex value
   */
  tabindex?: string;

  /**
   * Set a custom SVG fill color
   * @default "currentColor"
   */
  fill?: string;
}

export default class TradeoffAnalytics extends SvelteComponentTyped<
  TradeoffAnalyticsProps,
  {},
  {}
> {}
