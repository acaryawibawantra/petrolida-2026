import BreadcrumbGroup from "@/components/breadcrumb";
import Typography from "@/components/typography";

import CardInfoOprec from "./_components/card-info";
import DataTableOprec from "./_components/table";

const BREADCRUMBS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Registrant Staff", href: "/admin/oprec-staff" },
];

export default function OprecStaffDashboard() {
  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start max-lg:justify-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          Registrant Staff
        </Typography>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>
      <CardInfoOprec />
      <DataTableOprec />
    </div>
  );
}
