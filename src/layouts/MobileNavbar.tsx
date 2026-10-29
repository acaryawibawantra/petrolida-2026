import Button from "@/components/buttons/button";
import UnstyledLink from "@/components/links/unstyled-link";
import NextImage from "@/components/next-image";
import { NAV_LINKS } from "@/constants/navbar";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface MobileNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  user?: { name?: string; email?: string; role?: string } | null;
  merch: { name: string; href: string; disabled?: boolean }[];
  competitions: { name: string; href: string; disabled?: boolean }[];
  nonCompetitions: { name: string; href: string; disabled?: boolean }[];
  handleLogin: () => void;
  handleLogout: () => void;
  isDisabled?: boolean;
}

const drawerVariants = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 24,
      mass: 1.2,
    },
  },
  exit: {
    y: "-100vh",
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 0.1 } },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 30, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.2, 0.65, 0.3, 0.9] as const,
    },
  },
};

const accordionVariants = {
  collapsed: { height: 0, opacity: 0, marginTop: 0 },
  expanded: {
    height: "auto",
    opacity: 1,
    marginTop: 4,
    transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] as const },
  },
};

export default function MobileNavbar({
  isOpen,
  onClose,
  isLoggedIn,
  user,
  merch,
  competitions,
  nonCompetitions,
  handleLogin,
  handleLogout,
}: MobileNavbarProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            className="fixed inset-0 z-[1004] bg-transparent lg:hidden h-[100dvh] w-screen"
            onClick={onClose}
          />

          {/* Floating Drawer Container - Centered Wrapper */}
          <aside className="fixed inset-0 z-[1005] flex items-center justify-center p-4 pointer-events-none">
            {/* Glass Panel - Animated Child */}
            <motion.div
              key="mobile-drawer"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
              className="w-full max-w-sm h-auto max-h-[calc(100dvh-2rem)] bg-white/85 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl flex flex-col overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/5 shrink-0">
                <UnstyledLink
                  href="/"
                  onClick={onClose}
                  className="flex items-center gap-3"
                >
                  <NextImage
                    src="/logo-only.png"
                    alt="Petrolida 2026"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </UnstyledLink>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-full hover:bg-black/5 transition-colors text-neutral-500 hover:text-black"
                >
                  <X className="w-6 h-6" strokeWidth={2} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex flex-col gap-1 overflow-y-auto px-6 py-2 no-scrollbar">
                {/* User Info - Only show when logged in */}
                {isLoggedIn && user && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-4 p-4 bg-primary-50 rounded-xl border border-primary-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email || "user@petrolida.com"}
                        </p>
                      </div>
                    </div>
                    <UnstyledLink
                      href={
                        user.role === "ADMIN"
                          ? "/admin"
                          : "/competition/dashboard/user"
                      }
                      onClick={onClose}
                      className="mt-3 flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium text-gray-700"
                    >
                      {user.role === "ADMIN" ? "Dashboard" : "My Dashboard"}
                    </UnstyledLink>
                  </motion.div>
                )}

                <motion.nav
                  className="flex flex-col gap-1"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {NAV_LINKS.map((link) => (
                    <motion.div key={link.name} variants={itemVariants}>
                      <UnstyledLink
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "py-3.5 text-lg text-neutral-700 hover:text-black font-medium transition-colors border-b border-black/5 flex items-center justify-between group",
                          link.disabled &&
                            "pointer-events-none opacity-50 cursor-not-allowed",
                        )}
                      >
                        {link.name}
                      </UnstyledLink>
                    </motion.div>
                  ))}

                  {/* Merch */}
                  <motion.div
                    variants={itemVariants}
                    className="border-b border-black/5"
                  >
                    <button
                      onClick={() => toggleSection("merch")}
                      className="flex w-full items-center justify-between py-3.5 group"
                    >
                      <span
                        className={cn(
                          "font-medium text-lg transition-colors",
                          openSection === "merch"
                            ? "text-primary-600"
                            : "text-neutral-700",
                        )}
                      >
                        Merch
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-neutral-400 transition-transform duration-300",
                          openSection === "merch" &&
                            "rotate-180 text-primary-600",
                        )}
                      />
                    </button>
                    <motion.div
                      initial="collapsed"
                      animate={
                        openSection === "merch" ? "expanded" : "collapsed"
                      }
                      variants={accordionVariants}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 pb-4 pl-0">
                        {merch.map((item) => (
                          <UnstyledLink
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                              "py-2 px-3 text-[15px] font-medium text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors block",
                              item.disabled &&
                                "pointer-events-none opacity-50 cursor-not-allowed",
                            )}
                          >
                            {item.name}
                          </UnstyledLink>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Competition */}
                  <motion.div
                    variants={itemVariants}
                    className="border-b border-black/5"
                  >
                    <button
                      onClick={() => toggleSection("competition")}
                      className="flex w-full items-center justify-between py-3.5 group"
                    >
                      <span
                        className={cn(
                          "font-medium text-lg transition-colors",
                          openSection === "competition"
                            ? "text-primary-600"
                            : "text-neutral-700",
                        )}
                      >
                        Competition
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-neutral-400 transition-transform duration-300",
                          openSection === "competition" &&
                            "rotate-180 text-primary-600",
                        )}
                      />
                    </button>
                    <motion.div
                      initial="collapsed"
                      animate={
                        openSection === "competition" ? "expanded" : "collapsed"
                      }
                      variants={accordionVariants}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 pb-4 pl-0">
                        {competitions.map((item) => (
                          <UnstyledLink
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                              "py-2 px-3 text-[15px] font-medium text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors block",
                              item.disabled &&
                                "pointer-events-none opacity-50 cursor-not-allowed",
                            )}
                          >
                            {item.name}
                          </UnstyledLink>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Non-Competition */}
                  <motion.div
                    variants={itemVariants}
                    className="border-b border-black/5"
                  >
                    <button
                      onClick={() => toggleSection("nonCompetition")}
                      className="flex w-full items-center justify-between py-3.5 group"
                    >
                      <span
                        className={cn(
                          "font-medium text-lg transition-colors",
                          openSection === "nonCompetition"
                            ? "text-primary-600"
                            : "text-neutral-700",
                        )}
                      >
                        Non-Competition
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-neutral-400 transition-transform duration-300",
                          openSection === "nonCompetition" &&
                            "rotate-180 text-primary-600",
                        )}
                      />
                    </button>
                    <motion.div
                      initial="collapsed"
                      animate={
                        openSection === "nonCompetition"
                          ? "expanded"
                          : "collapsed"
                      }
                      variants={accordionVariants}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 pb-4 pl-0">
                        {nonCompetitions.map((item) => (
                          <UnstyledLink
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                              "py-2 px-3 text-[15px] font-medium text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors block",
                              item.disabled &&
                                "pointer-events-none opacity-50 cursor-not-allowed",
                            )}
                          >
                            {item.name}
                          </UnstyledLink>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.nav>
              </div>

              {/* Footer */}
              <div className="p-5 bg-white/50 border-t border-white/50 shrink-0">
                {isLoggedIn ? (
                  <Button
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                    variant="outline"
                    className="w-full justify-center border-neutral-300 font-bold"
                  >
                    Log Out
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => {
                        handleLogin();
                        onClose();
                      }}
                      variant="primary"
                      className="w-full justify-center shadow-lg shadow-primary-500/20 font-bold"
                    >
                      Log In
                    </Button>
                    <UnstyledLink
                      href="/register"
                      onClick={onClose}
                      className="text-center text-sm font-bold text-neutral-500 hover:text-black transition-colors py-1"
                    >
                      Create an account
                    </UnstyledLink>
                  </div>
                )}
              </div>
            </motion.div>
          </aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
