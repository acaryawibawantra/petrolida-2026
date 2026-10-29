import BreadcrumbGroup from "@/components/breadcrumb";
import Typography from "@/components/typography";
import CardInfoMerchOrders from "./_components/card-info";
import DataTableMerchOrders from "./_components/table";

const BREADCRUMBS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Merch Orders", href: "/admin/merch/orders" },
];

export default function MerchOrdersPage() {
  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start max-lg:justify-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          Merchandise Orders
        </Typography>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>
      <CardInfoMerchOrders />
      <div className="max-w-[90dvw]">
        <DataTableMerchOrders />
      </div>
    </div>
  );
}
