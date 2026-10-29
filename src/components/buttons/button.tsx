import clsxm from "@/lib/clsxm";
import { LoaderCircle, LucideProps } from "lucide-react";
import * as React from "react";

const ButtonVariant = [
  "primary",
  "secondary",
  "warning",
  "danger",
  "success",
  "outline",
  "disabled",
  "ghost",
] as const;
const ButtonSize = ["sm", "base", "lg", "md", "icon"] as const;

type LucideIconType = React.ComponentType<LucideProps>;

type ButtonProps = {
  isLoading?: boolean;
  variant?: (typeof ButtonVariant)[number];
  size?: (typeof ButtonSize)[number];
  leftIcon?: LucideIconType;
  rightIcon?: LucideIconType;
  leftIconClassName?: string;
  rightIconClassName?: string;
} & React.ComponentPropsWithRef<"button">;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
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
    const disabled = isLoading || buttonDisabled;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
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
            size === "md" && [
              "min-h-[2.50rem] px-3 md:min-h-[2.75rem]",
              "text-sm md:text-base",
            ],
            size === "base" && [
              "min-h-[2.25rem] px-3 md:min-h-[2.5rem]",
              "text-sm md:text-base",
            ],
            size === "sm" && [
              "min-h-[1.75rem] px-2 md:min-h-[2rem]",
              "text-xs md:text-sm",
            ],
            size === "icon" && ["h-10 w-10", "p-0"],
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
            variant === "secondary" && [
              "bg-secondary-500 text-white",
              "border secondary-green-600",
              "hover:bg-secondary-600 hover:text-white",
              "active:bg-secondary-700",
              "disabled:bg-secondary-700",
              "focus-visible:ring-secondary-400",
            ],
            variant === "danger" && [
              "bg-danger-700 text-white",
              "border border-danger-900",
              "hover:bg-danger-800 hover:text-white",
              "active:bg-danger-700",
              "disabled:bg-danger-700",
              "focus-visible:ring-danger-400",
            ],
            variant === "warning" && [
              "bg-warning-500 text-white",
              "border border-warning-500",
              "hover:bg-warning-600 hover:text-white",
              "active:bg-warning-700",
              "disabled:bg-warning-700",
              "focus-visible:ring-warning-400",
            ],
            variant === "success" && [
              "bg-success-500 text-white",
              "border border-success-500",
              "hover:bg-success-600 hover:text-white",
              "active:bg-success-700",
              "disabled:bg-success-700",
              "focus-visible:ring-success-400",
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
            variant === "disabled" && [
              "bg-default-600 text-default-50",
              "shadow-none",
            ],
          ],
          //#endregion  //*======== Variants ===========
          "disabled:cursor-not-allowed",
          isLoading &&
            "relative text-transparent transition-none hover:text-transparent disabled:cursor-wait",
          className,
        )}
        {...rest}
      >
        {isLoading && (
          <div
            className={clsxm(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              {
                "text-white": ["blue", "green", "red", "yellow"].includes(
                  variant,
                ),
                "text-blue-500": ["outline", "ghost"].includes(variant),
              },
            )}
          >
            <LoaderCircle size={18} className="animate-spin" />
          </div>
        )}
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
      </button>
    );
  },
);

export default Button;
