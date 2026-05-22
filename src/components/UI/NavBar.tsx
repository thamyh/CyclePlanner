// src/components/UI/NavBar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/calendar", label: "Calendar" },
  { href: "/settings", label: "Settings" },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="bg-gray-800/70 backdrop-blur-md border-b border-gray-700">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <div className="text-xl font-semibold text-gray-100">Cycle Planner</div>
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
