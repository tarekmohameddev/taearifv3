/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const DashboardSidebarButton = ({ isMenuOpen, setIsMenuOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLgScreen, setIsLgScreen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setLastScrollPos(currentScrollPos);
      setIsScrolled(window.scrollY > 10);
    };

    const checkScreenSize = () => {
      setIsLgScreen(window.innerWidth >= 1024); // lg screen size (1024px or higher)
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScreenSize);

    checkScreenSize(); // Initial check on page load

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [lastScrollPos]);

  const isDashboardPage = pathname?.startsWith("/dashboard");
  if (!isDashboardPage) {
    return null;
  }
  return (
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className={`fixed lg:hidden ${isMenuOpen ? "top-[2.5vh]" : "top-[10vh]"} left-9 z-[52]`}
    >
      {isMenuOpen ? (
        <IoIosArrowBack className="text-gray-900 text-3xl" />
      ) : (
        <IoIosArrowForward className="text-gray-100 text-3xl" />
      )}
    </button>
  );
};

export default DashboardSidebarButton;
