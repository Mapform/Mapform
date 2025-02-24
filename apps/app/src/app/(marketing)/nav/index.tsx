"use client";

import Link from "next/link";
import Image from "next/image";
import mapform from "public/static/images/mapform.svg";
import { SignIn } from "./sign-in";
import { useEffect, useState } from "react";

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky inset-x-0 top-0 z-50 transition-all duration-200 ${
        isScrolled ? "bg-white bg-opacity-80 backdrop-blur-sm" : ""
      }`}
    >
      <nav
        aria-label="Global"
        className={`flex items-center justify-between transition-all duration-200 ${
          isScrolled ? "px-4 py-2 lg:px-6" : "p-6 lg:px-8"
        }`}
      >
        <div className="flex lg:flex-1">
          <Link className="-m-1.5 p-1.5" href="/">
            <span className="sr-only">Your Company</span>
            <Image
              alt="Logo"
              className={`inline transition-all duration-200 ${
                isScrolled ? "h-6 w-6" : "h-8 w-8"
              }`}
              src={mapform}
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-4">
          <SignIn />
        </div>
      </nav>
    </header>
  );
}
