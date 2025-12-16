"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";
import { FiMenu, FiX } from "react-icons/fi"; // استيراد صحيح
const Swal = dynamic(() => import("sweetalert2"), { ssr: false });
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";

const Nav = () => {
  const [isHovered, setIsHovered] = useState(null);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [ISadmin, setISadmin] = useState(false);
  const [UserIslogged, setUserIslogged] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const router = useRouter();

  const links = [
    { name: "الرئيسية", path: "/" },
    { name: "المشاريع", path: "/projects" },
    { name: "الأفراد", path: "/individuals" },
    { name: "البيع على الخارطة", path: "/map-sales" },
    { name: "عن باهية العقارية", path: "/about-us" },
    { name: "تواصل معنا", path: "/contact-us" },
  ];

  // إغلاق القائمة عند تغيير الرابط
  useEffect(() => {
    setIsMenuOpen(false); // إغلاق القائمة عندما يتغير الرابط
  }, [pathname]);

  // تغيير الاتجاه بناءً على اللغة
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  async function getData() {
    try {
      const userInfoResponse = await fetch("/api/user/getUserInfo");
      if (!userInfoResponse.ok) return [];

      const userData = await userInfoResponse.json();
      const email = userData.email;

      const [userResponse] = await Promise.all([
        fetch(`/api/user/getData?email=${email}`),
      ]);

      if (userResponse.ok) {
        const currentUserData = await userResponse.json();
        setUserIslogged(true);
        setISadmin(currentUserData.IsAdmin);
      }
    } catch (error) {}
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setLastScrollPos(currentScrollPos);
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPos]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to Logout");
      }
      setUserIslogged(false);
      setISadmin(false);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Done! Logged Out`,
        showConfirmButton: false,
        timer: 8000,
      });
      const data = await res.json();
      setSessionMessage(data.message);
    } catch (error) {}
  };

  const getButtonClass = (link, index) => {
    const isActive =
      link.path == pathname ||
      (pathname.startsWith(link.path) && link.path != "/");

    return `
      relative text-lg font-semibold transition-all           text-gray-100
            before:content-[''] 
            before:absolute 
            before:left-[-5px] 
            before:top-[60%] 
            before:h-[4px] 
            before:bg-yellow-500
            before:transform 
            before:-translate-y-1/2 
            before:w-[calc(100%+10px)] 
            before:z-[-1]
            before:scale-x-0
            before:origin-${i18n.language === "ar" ? "right" : "left"}
            before:transition-all
            before:duration-300
            before:ease-in-out
    `;
  };

  const handleChangeLanguage = useCallback(() => {
    const newLang = lang === "ar" ? "en" : "ar";

    i18n
      .changeLanguage(newLang)
      .then(() => {
        const newPath = pathname.replace(/^\/[^\/]+/, `/${newLang}`);
        router.push(newPath);

        setLang(newLang);
        localStorage.setItem("lang", newLang);
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = newLang;
      })
      .catch((err) => {
        console.error("Failed to change language:", err);
      });
  }, [lang, pathname, router]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 bg-[#8b5f46]`}
    >
      <div
        className={`container mx-auto max-w-screen
         flex items-center justify-around px-7 transition-all duration-500`}
      >
        {/* الشعار */}
        <Link href="/" className={`cursor-pointer`}>
          <motion.div
            className={`relative h-20 w-24 transition-all duration-1000`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            <Image
              src="/images/main/logo.png"
              alt="rules"
              layout="fill"
              objectFit="contain"
            />
          </motion.div>
        </Link>
        {/* قائمة الروابط مع التأثير التدريجي */}
        <div className="hidden lg:flex gap-8">
          {links.map((link, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.4 * index,
                }}
              >
                <Link
                  href={link.path}
                  className={getButtonClass(link, index)}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* الأزرار */}
        <div className="flex items-center gap-4">
          {UserIslogged && (
            <motion.button
              className={`rounded-all px-3 py-2 font-bold hover:bg-red-800 hover:text-white text-red-600 hidden lg:flex`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 1.7 }}
              onClick={handleLogout}
            >
              Logout
            </motion.button>
          )}

          <motion.button
            className={`rounded-all font-semibold hover:text-black text-white hidden lg:flex`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 2.7 }}
            onClick={handleChangeLanguage}
          >
            {i18n.language === "en" ? "عربي" : "EN"}
          </motion.button>
        </div>

        {/* زر القائمة المنبثقة */}
        {!pathname.startsWith("/dashboard") ? (
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`fixed lg:hidden text-3xl ${i18n.language === "en" ? "right-[3rem]" : "left-[3rem]"}  `}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            {isMenuOpen ? (
              <FiX
                className={`text-gray-200`}
              />
            ) : (
              <FiMenu
                className={`text-gray-200`}
              />
            )}
          </motion.button>
        ) : null}

        {/* القائمة الجانبية */}
        {isMenuOpen && (
          <div
            className={`fixed top-0 ${
              i18n.language === "ar" ? "right-0" : "left-0"
            } bottom-0 h-screen w-64 bg-white shadow-lg lg:hidden transition-transform transform translate-x-0 z-40`}
          >
            <div className="p-4 flex flex-col gap-6">
              {links.map((link, index) => {
                return (
                  <Link
                    href={link.path}
                    key={index}
                    className={`capitalize font-medium text-lg ${
                      link.path === pathname
                        ? "border-b-2 border-purple-500 text-gray-900"
                        : "text-gray-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {UserIslogged && (
                <button
                  className={` rounded-all px-3 py-2 font-bold bg-red-800 text-white`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
              <button
                className={`rounded-all px-3 py-2 font-semibold text-white`}
                style={{
                  background: "linear-gradient(to bottom, #8B5CF6, #150d26)",
                }}
                onClick={handleChangeLanguage}
              >
                {i18n.language === "en" ? "عربي" : "EN"}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
