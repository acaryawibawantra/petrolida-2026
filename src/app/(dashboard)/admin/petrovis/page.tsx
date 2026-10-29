import BreadcrumbGroup from "@/components/breadcrumb";
import Typography from "@/components/typography";
import PetrovisInsight from "./_components/insight";
import PetrovisDataTable from "./_components/table";

const BREADCRUMBS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Petrovis Registrations", href: "/admin/petrovis" },
];

export default function PetrovisDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start max-lg:justify-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          Petrovis Registrations
        </Typography>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>

      <PetrovisInsight />

      <div className="max-w-[90dvw]">
        <PetrovisDataTable />
      </div>
    </div>
  );
}
