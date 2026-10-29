import * as React from "react";

import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

type TOptionProps = {
  children: React.ReactNode;
  placeholder?: string;
  value: string | number | readonly string[] | undefined;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  leftIcon?: React.ComponentType<LucideProps>;
  leftIconClassName?: string;
};

export default function Option({
  children,
  placeholder,
  onChange,
  value,
  leftIcon,
  leftIconClassName,
}: TOptionProps) {
  const Icon = leftIcon || "";

  return (
    <div
      className={cn(
        "flex items-center justify-start",
        "hover:border-primary-400 w-full cursor-pointer hover:ring-0 md:w-auto",
      )}
    >
      <div className="shadow-custom-white relative w-full cursor-pointer rounded-md border bg-neutral-main pr-2">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon className={leftIconClassName} />
          </div>
        )}
        <select
          className={cn(
            "w-full rounded-md py-2.5 pr-20 text-base text-gray-600 md:w-auto",
            "focus:border-typo-icon outline-none focus:outline-none focus:ring-0",
            "hover:border-white-100 transition duration-100",
            "active:border-info-outline cursor-pointer px-3 disabled:bg-red-100 disabled:brightness-95",
            leftIcon && "pl-10",
          )}
          value={value}
          onChange={onChange}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>
      </div>
    </div>
  );
}
