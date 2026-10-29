import BreadcrumbGroup from "@/components/breadcrumb";
import Typography from "@/components/typography";
import CardInfoLovol from "./_components/card-info";
import DataTableLOVOL from "./_components/table";

const BREADCRUMBS = [
  { name: "Dashboard", href: "/admin" },
  { name: "LOVOL Registrant", href: "/admin/lovol" },
];

export default function LOVOLDashboard() {
  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start max-lg:justify-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          Registrant LOVOL
        </Typography>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>
      <CardInfoLovol />
      <div className="max-w-[90dvw]">
        <DataTableLOVOL />
      </div>
    </div>
  );
}
