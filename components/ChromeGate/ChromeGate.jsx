"use client";

import { usePathname } from "next/navigation";

const HIDDEN = ["/login", "/signup"];

export default function ChromeGate({ children }) {
  const pathname = usePathname();
  if (HIDDEN.includes(pathname)) return null;
  return children;
}