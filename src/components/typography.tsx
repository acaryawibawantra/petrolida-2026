import { cn } from "@/lib/utils";
import * as React from "react";

export enum TypographyVariant {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  t,
  p,
  bt,
  l,
}

export type FontVariant = "Helvetica" | "Melodrame";

export type FontWeight =
  | "thin"
  | "extralight"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black"
  | "crammed"
  | "condensed"
  | "heavy-compressed";

type TypographyProps<T extends React.ElementType> = {
  as?: T;
  id?: string;
  className?: string;
  weight?: FontWeight;
  font?: FontVariant;
  variant?: keyof typeof TypographyVariant;
  children: React.ReactNode;
};

export default function Typography<T extends React.ElementType>({
  as,
  id,
  children,
  weight = "regular",
  className,
  font = "Helvetica",
  variant = "bt",
  ...props
}: TypographyProps<T> &
  Omit<React.ComponentProps<T>, keyof TypographyProps<T>>) {
  const Component = as || "div";
  return (
    <Component
      id={id}
      className={cn(
        "text-black",
        // *=============== Font Type ==================
        {
          Melodrame: "font-melodrame",
          Helvetica: "font-helvetica font-[500]",
        }[font],
        {
          thin: "font-thin",
          extralight: "font-extralight",
          light: "font-light",
          regular: "font-normal",
          medium: "font-medium",
          semibold: "font-semibold",
          bold: "font-bold",
          extrabold: "font-extrabold",
          black: "font-black",
          crammed: "font-[500]",
          condensed: "font-[600]",
          "heavy-compressed": "font-[700]",
        }[weight],
        // *=============== Font Variants ==================
        {
          h1: "text-[35px] md:text-[60px] md:leading-[60px]",
          h2: "text-[28px] md:text-[35px] md:leading-[40px]",
          h3: "text-[24px] md:text-[28px] md:leading-[36px]",
          h4: "md:text-[32px]",
          h5: "md:text-[24px]",
          h6: "md:text-[20px]",
          t: "md:text-[16px]",
          bt: "md:text-[14px]",
          l: "md:text-[12px]",
          p: "md:text-[14px]",
        }[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
