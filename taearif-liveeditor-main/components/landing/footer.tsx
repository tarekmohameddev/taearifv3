import Link from "next/link";
import { Icons } from "@/components/icons";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background justify-center">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0  mx-auto">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo className="h-6 w-6" />
          <p className="text-center text-sm leading-loose md:text-left">
            &copy; {new Date().getFullYear()} Taearif Platform. All rights
            reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="#"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Terms
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Privacy
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
