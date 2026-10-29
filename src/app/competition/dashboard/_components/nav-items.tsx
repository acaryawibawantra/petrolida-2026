"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface NavItems {
  href: string;
  name: string;
  icon: ReactNode;
  onClick?: () => void;
}

export default function NavItemCompetition({
  href,
  name,
  icon,
  onClick,
}: NavItems) {
  const path = usePathname();

  const isActive = (currentPath: string, navHref: string) => {
    if (navHref === "/competition/dashboard/user") {
      return currentPath === "/competition/dashboard/user";
    }
    return currentPath === navHref || currentPath.startsWith(navHref + "/");
  };

  return (
    <Link href={href} onClick={onClick}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg px-4 py-2 text-lg font-medium",
          isActive(path, href)
            ? "bg-primary-500 text-[#ECF2F7] "
            : "text-[#7A7A7A]",
        )}
      >
        <div className="text-xl">{icon}</div>
        {name}
      </div>
    </Link>
  );
}
