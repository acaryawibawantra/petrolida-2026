"use client";
import IconButton from "@/components/buttons/icon-button";
import ButtonLink from "@/components/links/button-link";
import UnstyledLink from "@/components/links/unstyled-link";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import {
  NAV_COMPETITIONS,
  NAV_LINKS,
  NAV_MERCH,
  NAV_NON_COMPETITIONS,
} from "@/constants/navbar";
import { cn } from "@/lib/utils";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ChevronDown,
  LogOut,
  LucideMenu,
  User2,
  UserCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import { useGetMe } from "@/hooks/use-auth";
import { getToken } from "@/lib/cookies";
import useAuthStore from "@/stores/use-auth-store";
import { useQueryClient } from "@tanstack/react-query";

import MobileNavbar from "./MobileNavbar";

export default function Navbar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Real authentication state from store (instant, no API call)
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const login = useAuthStore((state) => state.login);

  // Check token only on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    const token = getToken();
    setHasToken(!!token);
  }, []);

  // Fetch user data from /me endpoint only if there's a token
  const { data: meData, isLoading: isLoadingMe, isError } = useGetMe();

  // Sync user data from /me endpoint to store
  useEffect(() => {
    // Only process if there's a token
    if (!hasToken) {
      return;
    }

    // Don't process if still loading
    if (isLoadingMe) {
      return;
    }

    if (meData?.data && !isError) {
      // Get token from localStorage and combine with user data
      const token = getToken();
      login({ ...meData.data, token }, true); // true = persistent
    } else if (isError) {
      // If /me fails with a token present, token is invalid
      logout();
    }
  }, [meData, isError, isLoadingMe, login, logout, hasToken]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    // Clear all React Query cache
    queryClient.clear();

    // Logout from auth store (also clears localStorage and sessionStorage)
    logout();

    // Redirect to home
    router.push("/");
  };
  const isDisabled = false;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const showNav = () => {
    setIsOpen(!isOpen);
  };

  const path = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen, path]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-[9999] w-full duration-300 ease-in-out",
          "p-4 lg:pt-4 lg:px-14",
        )}
      >
        <div
          className={cn(
            "flex flex-row items-center justify-between",
            "px-4 py-2 lg:px-6",
            "border border-white rounded-xl bg-transparent backdrop-blur-sm",
          )}
        >
          <UnstyledLink href="/">
            <NextImage
              src="/logo-only.png"
              alt="logo"
              width={36}
              height={36}
              className="w-[28px] md:w-[36px]"
            />
          </UnstyledLink>

          <IconButton
            icon={() => (
              <LucideMenu className="text-neutral-100 w-8 h-8 md:w-10 md:h-10" />
            )}
            className="lg:hidden bg-transparent border-none hover:bg-transparent shadow-none focus:bg-transparent active:bg-transparent"
            iconClassName="text-neutral-100 w-6 h-6 md:w-10 md:h-10"
            onClick={showNav}
          />

          <div className="hidden lg:flex items-center justify-center gap-10">
            <nav
              className={cn(
                "hidden lg:flex",
                isDisabled && "pointer-events-none opacity-50",
              )}
            >
              <ul className="flex flex-row lg:gap-8">
                {NAV_LINKS.map((link) => (
                  <li key={link.name} className="group relative">
                    <UnstyledLink
                      href={link.href}
                      className={cn(
                        link?.disabled &&
                          "pointer-events-none cursor-not-allowed opacity-50",
                      )}
                    >
                      <Typography
                        variant="h6"
                        font="Helvetica"
                        weight="medium"
                        className="text-neutral-100"
                      >
                        {link.name}
                      </Typography>
                    </UnstyledLink>
                    {!link.disabled && (
                      <span className="absolute bottom-0 left-0 w-0 h-[3px] rounded-full bg-neutral-80 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                    )}
                  </li>
                ))}

                <li className="group relative">
                  <Menu className="relative" as="div">
                    <MenuButton>
                      {({ open }: { open: boolean }) => (
                        <Typography
                          variant="h6"
                          font="Helvetica"
                          weight="medium"
                          className="text-neutral-100 flex flex-row gap-1.5 items-center"
                        >
                          Merch
                          <ChevronDown
                            className={cn(
                              "text-base text-neutral-100 transition ease-in-out duration-200",
                              open && "rotate-180",
                            )}
                          />
                        </Typography>
                      )}
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        className={cn(
                          "absolute w-[240px] shadow-lg bg-white origin-top mt-2",
                          "flex flex-col p-2 rounded-md",
                          " focus:outline-none",
                        )}
                      >
                        {NAV_MERCH.map(({ name, href, disabled }) => (
                          <MenuItem
                            key={name}
                            as="button"
                            disabled={disabled}
                            className={cn(
                              "flex hover:bg-gray-100 rounded-md",
                              disabled &&
                                "pointer-events-none opacity-50 cursor-not-allowed hover:bg-transparent",
                            )}
                          >
                            <UnstyledLink
                              href={href}
                              className={cn(
                                "px-[22px] py-2 text-start text-sm w-full rounded-xl font-medium",
                                disabled && "pointer-events-none",
                              )}
                            >
                              <Typography variant="h6" className="text-black">
                                {name}
                              </Typography>
                            </UnstyledLink>
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Transition>
                  </Menu>
                  <span className="absolute bottom-0 left-0 w-0 h-[3px] rounded-full bg-neutral-80 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </li>

                <li className="group relative">
                  <Menu className="relative" as="div">
                    <MenuButton>
                      {({ open }: { open: boolean }) => (
                        <Typography
                          variant="h6"
                          font="Helvetica"
                          weight="medium"
                          className="text-neutral-100 flex flex-row gap-1.5 items-center"
                        >
                          Competition
                          <ChevronDown
                            className={cn(
                              "text-base text-neutral-100 transition ease-in-out duration-200",
                              open && "rotate-180",
                            )}
                          />
                        </Typography>
                      )}
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        className={cn(
                          "absolute w-[240px] shadow-lg bg-white origin-top mt-2",
                          "flex flex-col p-2 rounded-md",
                          " focus:outline-none",
                        )}
                      >
                        {NAV_COMPETITIONS.map(({ name, href, disabled }) => (
                          <MenuItem
                            key={name}
                            as="button"
                            disabled={disabled}
                            className={cn(
                              "flex hover:bg-gray-100 rounded-md",
                              disabled &&
                                "pointer-events-none opacity-50 cursor-not-allowed hover:bg-transparent",
                            )}
                          >
                            <UnstyledLink
                              href={href}
                              className={cn(
                                "px-[22px] py-2 text-start text-sm w-full rounded-xl font-medium",
                                disabled && "pointer-events-none",
                              )}
                            >
                              <Typography variant="h6" className="text-black">
                                {name}
                              </Typography>
                            </UnstyledLink>
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Transition>
                  </Menu>
                  <span className="absolute bottom-0 left-0 w-0 h-[3px] rounded-full bg-neutral-80 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </li>

                <li className="group relative">
                  <Menu className="relative" as="div">
                    <MenuButton>
                      {({ open }: { open: boolean }) => (
                        <Typography
                          variant="h6"
                          font="Helvetica"
                          weight="medium"
                          className="text-neutral-100 flex flex-row gap-1.5 items-center"
                        >
                          Non Competition
                          <ChevronDown
                            className={cn(
                              "text-base text-neutral-100 transition ease-in-out duration-200",
                              open && "rotate-180",
                            )}
                          />
                        </Typography>
                      )}
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        className={cn(
                          "absolute w-[240px] shadow-lg bg-white origin-top mt-2",
                          "flex flex-col p-2 rounded-md",
                          " focus:outline-none",
                        )}
                      >
                        {NAV_NON_COMPETITIONS.map(
                          ({ name, href, disabled }) => (
                            <MenuItem
                              key={name}
                              as="button"
                              disabled={disabled}
                              className={cn(
                                "flex hover:bg-gray-100 rounded-md",
                                disabled &&
                                  "pointer-events-none opacity-50 cursor-not-allowed hover:bg-transparent",
                              )}
                            >
                              <UnstyledLink
                                href={href}
                                className={cn(
                                  "px-[22px] py-2 text-start text-sm w-full rounded-xl font-medium",
                                  disabled && "pointer-events-none",
                                )}
                              >
                                <Typography variant="h6" className="text-black">
                                  {name}
                                </Typography>
                              </UnstyledLink>
                            </MenuItem>
                          ),
                        )}
                      </MenuItems>
                    </Transition>
                  </Menu>
                  <span className="absolute bottom-0 left-0 w-0 h-[3px] rounded-full bg-neutral-80 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </li>
              </ul>
            </nav>
          </div>

          {/* User Menu - Desktop Only */}
          {!isClient ? (
            // Show nothing during SSR to avoid hydration mismatch
            <div className="hidden lg:block w-8 h-8" />
          ) : isLoadingMe && !user ? (
            // Skeleton only if loading AND no user in store yet
            <div className="hidden lg:block w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
          ) : isAuthenticated ? (
            <Menu className="relative hidden lg:block" as="div">
              <MenuButton className="flex items-center justify-center focus:outline-none">
                <div className="lg:w-9 lg:h-9 w-7 h-7 bg-primary-600 hover:bg-primary-700 transition-colors rounded-full flex items-center justify-center ring-2 ring-white/20">
                  <User2 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
              </MenuButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems
                  className={cn(
                    "absolute right-0 mt-3 w-56 origin-top-right",
                    "bg-white rounded-lg shadow-lg border border-gray-200",
                    "focus:outline-none overflow-hidden",
                  )}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <Typography
                      variant="p"
                      weight="semibold"
                      className="text-gray-900 text-sm truncate"
                    >
                      {user?.name || "User"}
                    </Typography>
                    <Typography
                      variant="p"
                      className="text-gray-500 text-xs truncate mt-0.5"
                    >
                      {user?.email || "user@petrolida.com"}
                    </Typography>
                  </div>
                  <div className="py-1">
                    <MenuItem>
                      {({ active }) => (
                        <UnstyledLink
                          href={
                            user?.role === "ADMIN"
                              ? "/admin"
                              : "/competition/dashboard/user"
                          }
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                            active
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-700",
                          )}
                        >
                          <UserCircle className="w-4 h-4" />
                          <span>
                            {user?.role === "ADMIN"
                              ? "Dashboard"
                              : "My Dashboard"}
                          </span>
                        </UnstyledLink>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-colors",
                            active
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-700",
                          )}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          ) : (
            <div className="flex-row lg:gap-4 hidden lg:flex">
              <ButtonLink
                href="/login"
                variant="primary"
                size="base"
                onClick={handleLogin}
                className="rounded-lg w-24 py-1.5 bg-white"
              >
                <Typography
                  variant="p"
                  font="Helvetica"
                  weight="medium"
                  className="text-[#357182] hover:text-white"
                >
                  Log In
                </Typography>
              </ButtonLink>

              <ButtonLink
                href="/register"
                variant="outline"
                size="base"
                className="w-24 rounded-lg py-1.5"
              >
                <Typography
                  variant="p"
                  weight="medium"
                  font="Helvetica"
                  className="text-white hover:text-black"
                >
                  Sign Up
                </Typography>
              </ButtonLink>
            </div>
          )}

          {/* Mobile Navbar Component */}
          <MobileNavbar
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            isLoggedIn={isAuthenticated}
            user={user}
            merch={NAV_MERCH}
            competitions={NAV_COMPETITIONS}
            nonCompetitions={NAV_NON_COMPETITIONS}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            isDisabled={isDisabled}
          />
        </div>
      </header>
    </>
  );
}
