import { AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronDown, House, LogOut, Trophy, User } from "lucide-react";
import { usePathname } from "next/navigation";
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

import {
  useGetCompetitionNameById,
  useGetMyTeam,
} from "@/hooks/use-competition";
import { getCompetitionSlugFromName } from "@/lib/competition-identity";
import { getCompetitionSlug } from "@/lib/competition-utils";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import NavItemCompetition, { NavItems } from "./nav-items";

export default function SidebarCompetition({
  setIsNavbarOpen,
}: {
  setIsNavbarOpen: (value: boolean) => void;
}) {
  const [comp, setComp] = useState(true);
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const user = useAuthStore().user;
  const { data: myTeamData, isLoading } = useGetMyTeam();

  // Get user's competition from API
  const myTeam = myTeamData?.data;

  // Fetch competition name by event_id
  const { data: competitionNameData, isLoading: isLoadingCompetitionName } =
    useGetCompetitionNameById(myTeam?.event_id || "");

  const NAVITEMS: NavItems[] = [
    {
      href: "/competition/dashboard/user",
      name: "Home",
      icon: <House />,
    },
    {
      href: "/competition/dashboard/profile",
      name: "My Profile",
      icon: <User />,
    },
  ];

  // Determine the correct slug and display name
  let competitionSlug = "";
  let competitionName = "";

  if (myTeam && competitionNameData?.data) {
    // Always use name from competition name API (fetched by event_id)
    competitionName = competitionNameData.data.name;
    // Always generate slug from fetched name - no fallback to URL slug
    competitionSlug =
      getCompetitionSlugFromName(competitionNameData.data.name) ||
      getCompetitionSlug(competitionNameData.data.name);
  }

  const COMP: NavItems[] =
    myTeam && competitionSlug
      ? [
          {
            href: `/competition/dashboard/${competitionSlug}`,
            name: competitionName,
            icon: <Trophy />,
          },
        ]
      : [];

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
          <AvatarImage src="https://github.com/petrolida2026.png" alt="@user" />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
        <div className="flex w-[80%] flex-col">
          <Typography variant="p" weight="semibold" className="break-words">
            {user?.name || "User"}
          </Typography>
          <Typography
            variant="p"
            className="break-words text-sm text-[#9D9D9D]"
          >
            {user?.email || "user@example.com"}
          </Typography>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        {NAVITEMS.map((e, index) => (
          <NavItemCompetition
            key={index}
            href={e.href}
            name={e.name}
            icon={e.icon}
            onClick={() => setIsNavbarOpen(false)}
          />
        ))}
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
            {isLoading || isLoadingCompetitionName ? (
              <div className="px-4 py-2">
                <Typography variant="p" className="text-sm text-gray-500">
                  Loading...
                </Typography>
              </div>
            ) : COMP.length > 0 ? (
              COMP.map((e, index) => (
                <NavItemCompetition
                  key={index}
                  href={e.href}
                  name={e.name}
                  icon={e.icon}
                  onClick={() => setIsNavbarOpen(false)}
                />
              ))
            ) : (
              <div className="px-4 py-2">
                <Typography variant="p" className="text-sm text-gray-500">
                  No competition registered
                </Typography>
              </div>
            )}
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
