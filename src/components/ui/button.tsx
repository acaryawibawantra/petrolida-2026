import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { LoaderCircle, LucideProps } from "lucide-react";
import * as React from "react";
import Typography from "../typography";

const buttonVariants = cva(
  "text-white cursor-pointer flex items-center justify-center rounded-lg font-medium focus:outline-none focus-visible:ring transition-colors duration-100 font-Notos_Sans disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        orange:
          "text-white bg-orange-20 hover:bg-orange-30 active:bg-orange-20 focus-visible:ring-orange-20 disabled:bg-orange-10",
        plum: "text-white bg-plum-20 hover:bg-plum-30 active:bg-plum-20 focus-visible:ring-plum-20 disabled:bg-plum-10",
        EggPlant:
          "text-white bg-EggPlant-20 hover:bg-EggPlant-30 active:bg-EggPlant-20 focus-visible:ring-EggPlant-20 disabled:bg-EggPlant-10",
        yellow:
          "text-white bg-yellow-20 hover:bg-yellow-30 active:bg-yellow-20 focus-visible:ring-yellow-20 disabled:bg-yellow-10",
        magenta:
          "text-white bg-magenta-20 hover:bg-magenta-30 active:bg-magenta-20 focus-visible:ring-magenta-20 disabled:bg-magenta-10",
        midnightBlu:
          "text-white bg-midnight-blue-20 hover:bg-midnight-blue-30 active:bg-midnight-blue-20 focus-visible:ring-midnight-blue-20 disabled:bg-midnight-blue-10",
        cream:
          "text-white bg-cream-20 hover:bg-cream-30 active:bg-cream-20 focus-visible:ring-cream-20 disabled:bg-cream-10",
        coral:
          "text-white bg-coral-20 hover:bg-coral-30 active:bg-coral-20 focus-visible:ring-coral-20 disabled:bg-coral-10",
        lemon:
          "text-white bg-lemon-20 hover:bg-lemon-30 active:bg-lemon-20 focus-visible:ring-lemon-20 disabled:bg-lemon-10",
        purple:
          "text-white bg-purple-20 hover:bg-purple-30 active:bg-purple-20 focus-visible:ring-purple-20 disabled:bg-purple-10",
        violet:
          "text-white bg-violet-20 hover:bg-violet-30 active:bg-violet-20 focus-visible:ring-violet-20 disabled:bg-violet-10",
      },
      size: {
        default: "py-4 px-6",
        sm: "py-1 px-4",
        base: "py-3 px-6",
        lg: "py-3 px-6",
      },
    },
  },
);

type LucideIconType = React.ComponentType<LucideProps>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: LucideIconType;
  rightIcon?: LucideIconType;
  leftIconClassName?: string;
  rightIconClassName?: string;
  textClassName?: string;
  size?: "sm" | "base" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant,
      size,
      isLoading,
      disabled: buttonDisabled,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      leftIconClassName,
      rightIconClassName,
      textClassName,
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
        className={cn(buttonVariants({ variant, size }), className, {
          "relative text-transparent transition-none hover:text-transparent disabled:cursor-wait":
            isLoading,
        })}
        {...rest}
      >
        {isLoading && (
          <div
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              {
                "text-white-50": ["red", "black"].includes(variant || ""),
                "text-red-500": ["outlined", "white", "ghost"].includes(
                  variant || "",
                ),
              },
            )}
          >
            <LoaderCircle size={18} className="animate-spin" />
          </div>
        )}
        {LeftIcon && (
          <div
            className={cn({
              "mr-3": size === "lg",
              "mr-2": size === "base",
              "mr-1": size === "sm",
            })}
          >
            <LeftIcon
              size="1em"
              className={cn("text-base", leftIconClassName)}
            />
          </div>
        )}
        <Typography
          variant={size === "lg" ? "h6" : "l"}
          font="Helvetica"
          weight="regular"
          className={cn("text-white", textClassName)}
        >
          {children}
        </Typography>
        {RightIcon && (
          <div
            className={cn({
              "ml-3": size === "lg",
              "ml-2": size === "base",
              "ml-1": size === "sm",
            })}
          >
            <RightIcon
              size="1em"
              className={cn("text-base", rightIconClassName)}
            />
          </div>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
