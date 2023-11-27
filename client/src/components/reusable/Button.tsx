import React, {
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";

export type As<Props = any> = React.ElementType<Props>;

/**
 * Extract the props of a React element or component
 */
export type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T> & {
  as?: As;
};

export type ReactRef<T> =
  | React.RefObject<T>
  | React.MutableRefObject<T>
  | React.Ref<T>;

export type HTMLNextUIProps<
  T extends As = "div",
  OmitKeys extends keyof any = never
> = Omit<
  PropsOf<T>,
  | "ref"
  | "color"
  | "slot"
  | "size"
  | "defaultChecked"
  | "defaultValue"
  | OmitKeys
> & {
  as?: As;
};

interface Props extends HTMLNextUIProps<"button"> {
  /**
   * Ref to the DOM node.
   */
  ref?: ReactRef<HTMLButtonElement | null>;
  /**
   * Whether the button should display a ripple effect on press.
   * @default false
   */
  disableRipple?: boolean;
  /**
   * The button start content.
   */
  startContent?: ReactNode;
  /**
   * The button end content.
   */
  endContent?: ReactNode;
  /**
   * Spinner to display when loading.
   * @see https://nextui.org/components/spinner
   */
  spinner?: ReactNode;
  /**
   * The spinner placement.
   * @default "start"
   */
  spinnerPlacement?: "start" | "end";
  /**
   * Whether the button should display a loading spinner.
   * @default false
   */
  isLoading?: boolean;
  /**
   * The native button click event handler.
   * use `onPress` instead.
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button = ({ children, ...rest }: Props) => {
  return <button>Button</button>;
};

export default Button;
