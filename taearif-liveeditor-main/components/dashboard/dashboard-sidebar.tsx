"use client";

import React, { useState } from "react";
import { NewSidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Settings,
  ExternalLink,
  FileText,
  Package,
  BarChart,
  Users,
  Percent,
  Activity,
  Database,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function DashboardNav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="h-screen ">
      <NewSidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 h-full">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Preview Button */}
            <div className=" ">
              <button
                onClick={() =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_API_URL}/tenant/${user?.username}`,
                    "_blank",
                  )
                }
                className="flex items-center justify-start gap-2 w-full h-10 px-3 rounded-md bg-primary/5 hover:bg-primary/10 border border-dashed border-primary/50 text-primary transition-all duration-200"
              >
                <ExternalLink
                  className={`h-4 w-4 flex-shrink-0 transition-all duration-300 ${open ? "" : "-ml-[6px]"} `}
                />
                <motion.span
                  animate={{
                    display: open ? "inline-block" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="whitespace-nowrap"
                >
                  Preview
                </motion.span>
              </button>
            </div>

            {/* Live Editor Button */}
            <div className="mt-2 ">
              <button
                onClick={() =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_API_URL}/tenant/${user?.username}/live-editor`,
                    "_blank",
                  )
                }
                className="flex items-center justify-start gap-2 w-full h-10 px-3 rounded-md bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white shadow-lg hover:from-yellow-500 hover:via-yellow-700 hover:to-yellow-800 transition-all duration-500 hover:scale-95"
              >
                <LayoutDashboard
                  className={`h-4 w-4 flex-shrink-0 transition-all duration-300 ${open ? "" : "-ml-[6px]"} `}
                />
                <motion.span
                  animate={{
                    display: open ? "inline-block" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="whitespace-nowrap"
                >
                  Live Editor
                </motion.span>
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </NewSidebar>
    </div>
  );
}

export const Logo = () => {
  return (
    <div className="font-normal flex items-center text-lg font-semibold text-black dark:text-white py-1 relative z-20">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre"
      >
        Admin Dashboard
      </motion.span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="font-normal flex items-center text-lg font-semibold text-black dark:text-white py-1 relative z-20">
      <motion.span
        animate={{
          opacity: 0,
        }}
        className="whitespace-pre"
      >
        Admin Dashboard
      </motion.span>
    </div>
  );
};
