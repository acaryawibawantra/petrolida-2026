import BreadcrumbGroup from "@/components/breadcrumb";
import Typography from "@/components/typography";

import { DataTableShortLink } from "./_components/table";

export default function ShortLinkAdminPage() {
  const BREADCRUMBS = [
    { name: "Dashboard", href: "/admin" },
    { name: "Short link", href: "/admin/shortlink" },
  ];
  return (
    <div className="flex flex-col">
      <div className="flex w-full flex-col-reverse items-start justify-start lg:flex-row lg:items-center lg:justify-between">
        <Typography variant="h1" weight="bold">
          Shorten Link
        </Typography>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>
      {/* <CardInfoOprec /> */}
      <DataTableShortLink />
    </div>
  );
}
