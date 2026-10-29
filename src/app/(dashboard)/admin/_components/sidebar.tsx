import { AvatarFallback } from "@radix-ui/react-avatar";
import {
  ChevronDown,
  File,
  FileImage,
  FileQuestion,
  FileText,
  Fuel,
  HardHat,
  House,
  Link,
  LogOut,
  Microscope,
  Package,
  Ticket,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import useAuthStore from "@/stores/use-auth-store";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import NavItemAdmin, { NavItems } from "./nav-items";

export default function SidebarAdmin({
  setIsNavbarOpen,
}: {
  setIsNavbarOpen: (value: boolean) => void;
}) {
  const [comp, setComp] = useState(true);
  const [merch, setMerch] = useState(true);
  const [organize, setOrganize] = useState(true);
  const queryClient = useQueryClient();

  const user = useAuthStore().user;

  const NAVITEMS: NavItems[] = [
    {
      href: "/admin",
      name: "Dashboard",
      icon: <House />,
    },
    {
      href: "/admin/oprec-staff",
      name: "Oprec Staff",
      icon: <Users />,
    },
    {
      href: "/admin/lovol",
      name: "Oprec Lovol",
      icon: <User />,
    },
    {
      href: "/admin/oprec-petrovis",
      name: "Oprec Petrovis",
      icon: <Users />,
    },
    {
      href: "/admin/pbm",
      name: "PBM",
      icon: <File />,
    },
    {
      href: "/admin/petrovis",
      name: "Petrovis Event",
      icon: <Users />,
    },
    {
      href: "/admin/gala-dinner-rsvp",
      name: "Gala Dinner RSVP",
      icon: <FileText />,
    },
    {
      href: "/admin/city-tour",
      name: "City Tour",
      icon: <Trophy />,
    },
  ];

  const NAVORGAIZE: NavItems[] = [
    {
      href: "/admin/shortlink",
      name: "Short Link",
      icon: <Link />,
    },
    {
      href: "/admin/voucher",
      name: "Voucher",
      icon: <Ticket />,
    },
    // {
    //   href: "/admin/create-announcement",
    //   name: "Announcement",
    //   icon: <Bell />,
    // },
  ];

  const NAVMERCH: NavItems[] = [
    {
      href: "/admin/merch-items",
      name: "Merch Items",
      icon: <Package />,
    },
    {
      href: "/admin/merch/orders",
      name: "Orders",
      icon: <Package />,
    },
  ];

  // const NONCOMP: NavItems[] = [
  //   {
  //     href: "/admin/pbm",
  //     name: "PBM",
  //     icon: <FileChartLine />,
  //   },
  //   {
  //     href: "/admin/petrovis",
  //     name: "Petrovis",
  //     icon: <FileChartLine />,
  //   },
  //   {
  //     href: "/admin/city-tour",
  //     name: "City Tour",
  //     icon: <Building2 />,
  //   },
  // ];

  const COMP: NavItems[] = [
    {
      href: "/admin/competition/final",
      name: "Final Dashboard",
      icon: <Trophy />,
    },
    {
      href: "/admin/competition/paper-and-poster",
      name: "Paper and Poster",
      icon: <FileImage />,
    },
    {
      href: "/admin/competition/case-study",
      name: "Case Study",
      icon: <FileQuestion />,
    },
    {
      href: "/admin/competition/fracturing-fluid-design",
      name: "Fracturing Fluid Design",
      icon: <Fuel />,
    },
    {
      href: "/admin/competition/oil-rig-design",
      name: "Oil Rig Design",
      icon: <HardHat />,
    },
    {
      href: "/admin/competition/petrosmart",
      name: "Petrosmart",
      icon: <Microscope />,
    },
    {
      href: "/admin/competition/business-case",
      name: "Business Case",
      icon: <FileText />,
    },
    {
      href: "/admin/competition/plan-of-development",
      name: "Plan of Development",
      icon: <Trophy />,
    },
    {
      href: "/admin/competition/geothermal-case",
      name: "Geothermal Case",
      icon: <Fuel />,
    },
  ];

  const logout = useAuthStore().logout;
  const handleLogout = () => {
    // Clear all React Query cache
    queryClient.clear();

    // Logout from auth store (also clears localStorage and sessionStorage)
    logout();
  };

  return (
    <div className="flex flex-col">
      <NextImage
        src={"/logo-new.png"}
        width={84}
        height={162}
        alt="Logo"
        className="self-center"
      />
      <div className="mt-10 flex items-center gap-2 rounded-2xl border-[0.5px] border-[#DDD] bg-white p-3">
        <Avatar className="h-auto w-[15%]">
          <AvatarImage
            src="https://github.com/petrolida2026.png"
            alt="@admin"
          />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <div className="flex w-[80%] flex-col">
          <Typography variant="p" weight="semibold" className="break-words">
            {user?.name}
          </Typography>
          <Typography
            variant="p"
            className="break-words text-sm text-[#9D9D9D]"
          >
            {user?.email}
          </Typography>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        {NAVITEMS.map((e, index) => (
          <NavItemAdmin
            key={index}
            href={e.href}
            name={e.name}
            icon={e.icon}
            onClick={() => setIsNavbarOpen(false)}
          />
        ))}
        <Separator />

        <Collapsible
          className="space-y-4"
          open={organize}
          onOpenChange={setOrganize}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <Typography variant="p" weight="bold">
              Organize
            </Typography>
            <ChevronDown
              className={cn(
                "transition-all duration-200",
                !organize && "rotate-180",
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {NAVORGAIZE.map((e, index) => (
              <NavItemAdmin
                key={index}
                href={e.href}
                name={e.name}
                icon={e.icon}
                onClick={() => setIsNavbarOpen(false)}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible className="space-y-4" open={merch} onOpenChange={setMerch}>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <Typography variant="p" weight="bold">
              Merchandise
            </Typography>
            <ChevronDown
              className={cn(
                "transition-all duration-200",
                !merch && "rotate-180",
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {NAVMERCH.map((e, index) => (
              <NavItemAdmin
                key={index}
                href={e.href}
                name={e.name}
                icon={e.icon}
                onClick={() => setIsNavbarOpen(false)}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible className="space-y-4" open={comp} onOpenChange={setComp}>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <Typography variant="p" weight="bold">
              Competition
            </Typography>
            <ChevronDown
              className={cn(
                "transition-all duration-200",
                !comp && "rotate-180",
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {COMP.map((e, index) => (
              <NavItemAdmin
                key={index}
                href={e.href}
                name={e.name}
                icon={e.icon}
                onClick={() => setIsNavbarOpen(false)}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Button
          variant="danger"
          size="md"
          leftIcon={LogOut}
          leftIconClassName="mr-2"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
