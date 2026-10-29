import BreadcrumbGroup from "@/components/breadcrumb";
import Typography from "@/components/typography";

import DataTableVoucher from "./_components/table";

const BREADCRUMBS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Voucher Management", href: "/admin/voucher" },
];

export default function VoucherDashboard() {
  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start max-lg:justify-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          Voucher Management
        </Typography>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>
      <div className="max-w-[90dvw]">
        <DataTableVoucher />
      </div>
    </div>
  );
}
