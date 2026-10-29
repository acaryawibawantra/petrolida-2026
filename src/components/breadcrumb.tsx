import { Slash } from "lucide-react";
import React from "react";

import Typography from "@/components/typography";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface BreadCrumb {
  name: string;
  href: string;
}

interface props {
  items: BreadCrumb[];
  textColor?: string;
  activeColor?: string;
  separatorColor?: string;
}

export default function BreadcrumbGroup({
  items,
  textColor = "text-[#7A7A7A]",
  activeColor = "text-[#4580B2]",
  separatorColor = "text-black",
}: props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((e, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink href={e.href}>
                <Typography
                  className={cn(
                    index + 1 == items.length ? activeColor : textColor,
                    "max-lg:!text-sm",
                  )}
                  variant="bt"
                  weight="bold"
                >
                  {e.name}
                </Typography>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index + 1 != items.length && (
              <BreadcrumbSeparator>
                <Slash className={separatorColor} />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
