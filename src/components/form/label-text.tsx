import { ReactNode } from "react";

import Typography from "@/components/typography";
import clsxm from "@/lib/clsxm";

export default function LabelText({
  children,
  labelTextClassname,
  required,
}: {
  children: ReactNode;
  labelTextClassname?: string;
  required?: boolean;
}) {
  return (
    <label>
      <Typography
        as="p"
        variant="p"
        weight="bold"
        className={clsxm("text-xs text-gray-900", labelTextClassname)}
      >
        {children} {required && <span className="text-red-500">*</span>}
      </Typography>
    </label>
  );
}
