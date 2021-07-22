/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface SoftlayerEnablementProps
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

export default class SoftlayerEnablement extends SvelteComponentTyped<
  SoftlayerEnablementProps,
  {},
  {}
> {}
