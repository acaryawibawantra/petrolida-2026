import BreadcrumbGroup from "@/components/breadcrumb";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CreateMerchForm from "./_components/create-form";

const BREADCRUMBS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Merch Items", href: "/admin/merch-items" },
  { name: "New Item", href: "/admin/merch-items/create" },
];

export default function CreateMerchItemPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <Link
          href="/admin/merch-items"
          className="hidden md:flex p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>
      <div className="w-full">
        <CreateMerchForm />
      </div>
    </div>
  );
}
