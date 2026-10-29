import * as React from "react";

import UnstyledLink, {
  UnstyledLinkProps,
} from "@/components/links/unstyled-link";
import clsxm from "@/lib/clsxm";
import { LucideProps } from "lucide-react";

const ButtonLinkVariant = [
  "primary",
  "green",
  "yellow",
  "danger",
  "outline",
  "ghost",
] as const;
const ButtonLinkSize = ["sm", "base", "lg"] as const;
type LucideIconType = React.ComponentType<LucideProps>;

type ButtonLinkProps = {
  variant?: (typeof ButtonLinkVariant)[number];
  size?: (typeof ButtonLinkSize)[number];
  leftIcon?: LucideIconType;
  rightIcon?: LucideIconType;
  leftIconClassName?: string;
  rightIconClassName?: string;
} & UnstyledLinkProps;

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "base",
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      leftIconClassName,
      rightIconClassName,
      ...rest
    },
    ref,
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        type="button"
        className={clsxm(
          "inline-flex items-center justify-center rounded-lg font-medium",
          "focus:outline-none focus-visible:ring",
          "shadow-sm",
          "transition-colors duration-75",
          //#region  //*=========== Size ===========
          [
            size === "lg" && [
              "min-h-[2.75rem] px-3.5 md:min-h-[3rem]",
              "text-base",
            ],
            size === "base" && [
              "min-h-[2.25rem] px-3 md:min-h-[2.5rem]",
              "text-sm md:text-base",
            ],
            size === "sm" && [
              "min-h-[1.75rem] px-2 md:min-h-[2rem]",
              "text-xs md:text-sm",
            ],
          ],
          //#endregion  //*======== Size ===========
          //#region  //*=========== Variants ===========
          [
            variant === "primary" && [
              "bg-primary-500 text-white",
              "border border-primary-600",
              "hover:bg-primary-600 hover:text-white",
              "active:bg-primary-700",
              "disabled:bg-primary-700",
              "focus-visible:ring-primary-400",
            ],
            variant === "green" && [
              "bg-green-500 text-white",
              "border border-green-600",
              "hover:bg-green-600 hover:text-white",
              "active:bg-green-700",
              "disabled:bg-green-700",
              "focus-visible:ring-green-400",
            ],
            variant === "danger" && [
              "bg-danger-700 text-white",
              "border border-danger-900",
              "hover:bg-danger-800 hover:text-white",
              "active:bg-danger-700",
              "disabled:bg-danger-700",
              "focus-visible:ring-danger-400",
            ],
            variant === "yellow" && [
              "bg-yellow-500 text-white",
              "border border-yellow-500",
              "hover:bg-yellow-600 hover:text-white",
              "active:bg-yellow-700",
              "disabled:bg-yellow-700",
              "focus-visible:ring-yellow-400",
            ],
            variant === "outline" && [
              "text-black",
              "border border-gray-300",
              "hover:bg-slate-200 focus-visible:ring-gray-400 active:bg-slate-500 disabled:bg-slate-500",
            ],
            variant === "ghost" && [
              "text-neutral-500",
              "shadow-none",
              "hover:bg-neutral-50 focus-visible:ring-neutral-400 active:bg-neutral-100 disabled:bg-neutral-100",
            ],
          ],
          //#endregion  //*======== Variants ===========
          "disabled:cursor-not-allowed",
          className,
        )}
        {...rest}
      >
        {LeftIcon && (
          <div
            className={clsxm([
              size === "lg" && "mr-3",
              size === "base" && "mr-2",
              size === "sm" && "mr-1",
            ])}
          >
            <LeftIcon
              size="1em"
              className={clsxm("text-base", leftIconClassName)}
            />
          </div>
        )}
        {children}
        {RightIcon && (
          <div
            className={clsxm([
              size === "lg" && "ml-3",
              size === "base" && "ml-2",
              size === "sm" && "ml-1",
            ])}
          >
            <RightIcon
              size="1em"
              className={clsxm("text-base", rightIconClassName)}
            />
          </div>
        )}
      </UnstyledLink>
    );
  },
);

export default ButtonLink;
