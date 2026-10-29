import BreadcrumbGroup from "@/components/breadcrumb";
import Typography from "@/components/typography";
import CardInfoMerchItems from "./_components/card-info";
import DataTableMerchItems from "./_components/table";

const BREADCRUMBS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Merch Items", href: "/admin/merch-items" },
];

export default function MerchItemsDashboard() {
  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start max-lg:justify-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          Merchandise Items
        </Typography>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>
      <CardInfoMerchItems />
      <div className="max-w-[90dvw]">
        <DataTableMerchItems />
      </div>
    </div>
  );
}
