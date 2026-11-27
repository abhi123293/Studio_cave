
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY + 3) {
        setVisible(false);
        setMenuOpen(false);
      } else if (currentScrollY < lastScrollY - 3) {
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] w-full transition-transform duration-500 ease-in-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-6 md:px-12 lg:px-20">
        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="text-2xl font-semibold tracking-tight text-[#171815]"
        >
          STUDIO CAVE
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-8 text-sm text-[#171815] md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-opacity hover:opacity-60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP BUTTON */}
        <Link
          href="#contact"
          className="hidden items-center gap-2 rounded-full bg-[#171815] px-5 py-3 text-sm text-white transition hover:bg-[#45483d] md:flex"
        >
          Sign in
          <ArrowUpRight size={16} />
        </Link>

        {/* MOBILE HAMBURGER */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex items-center justify-center text-[#171815] md:hidden"
        >
          {menuOpen ? <X size={27} /> : <Menu size={27} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`absolute left-0 right-0 top-full overflow-hidden bg-[#e9e8e3]/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          menuOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-6 pb-6 pt-2">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="border-b border-[#171815]/10 py-4 text-base font-medium text-[#171815]"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="#contact"
            onClick={closeMenu}
            className="mt-5 flex w-fit items-center gap-2 rounded-full bg-[#171815] px-5 py-3 text-sm text-white"
          >
            Sign in
            <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
