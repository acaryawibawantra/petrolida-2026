import BreadcrumbGroup from "@/components/breadcrumb";
import Typography from "@/components/typography";
import CardInfoPetrovis from "./_components/card-info";
import DataTablePetrovis from "./_components/table";

const BREADCRUMBS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Petrovis Registrant", href: "/admin/oprec-petrovis" },
];

export default function PetrovisDashboard() {
  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start max-lg:justify-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          Registrant Petrovis
        </Typography>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>
      <CardInfoPetrovis />
      <div className="max-w-[90dvw]">
        <DataTablePetrovis />
      </div>
    </div>
  );
}
