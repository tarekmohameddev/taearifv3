"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function MainNav() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  return (
    <div className="mr-4 flex mt-2">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        {/* <img src="/Si_LOGO2.png" alt="Logo" className="h-6 w-6" /> */}
        <span className="hidden font-bold sm:inline-block">
          Taearif Platform
        </span>
      </Link>
      <nav className="flex items-center space-x-10 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Home
        </Link>
        <Link
          href="/#services"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/services")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Services
        </Link>
        <Link
          href="/#about"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/about-us")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          About
        </Link>
        <Link
          href="/#portfolio"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/portfolio")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Portfolio
        </Link>
        <Link
          href="/#contact"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/contact-us")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Contact
        </Link>
        {user?.username ? (
          <div className="space-x-0">
            <Button
              variant="ghost"
              className="mx-2"
              onClick={async () => {
                await logout();
              }}
            >
              logout
            </Button>
            <Link href="/dashboard">
              <Button className="mx-2">Dashboard</Button>
            </Link>
          </div>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost" className="mx-2">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="mx-2">Sign Up</Button>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
