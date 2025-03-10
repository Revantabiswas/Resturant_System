"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Template({ children }) {
  const pathname = usePathname();
  const isSplashPath = pathname === "/splash";
  
  if (isSplashPath) {
    // For splash page, don't include navbar or footer
    return <>{children}</>;
  }

  // For all other pages, include the navbar and footer
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      {/* <Footer /> */}
    </>
  );
}
