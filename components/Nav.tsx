"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Leaf, ScanLine, Sprout } from "lucide-react";

const ITEMS = [
  { href: "/", Icon: Home, label: "Home", short: "Home" },
  { href: "/crops", Icon: Sprout, label: "Crop planner", short: "Crops" },
  { href: "/disease", Icon: ScanLine, label: "Plant doctor", short: "Doctor" },
  { href: "/soil", Icon: Leaf, label: "Soil health", short: "Soil" },
];

function NavItems({ compact = false }: { compact?: boolean }) {
  const path = usePathname();
  return ITEMS.map(({ href, Icon, label, short }) => {
    const active = path === href;
    return (
      <Link
        key={href}
        href={href}
        className={`nav-item${active ? " active" : ""}`}
        aria-current={active ? "page" : undefined}
        aria-label={label}
      >
        <Icon size={22} strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" />
        <span>{compact ? short : label}</span>
      </Link>
    );
  });
}

export function Sidebar() {
  return (
    <aside className="sidebar">
      <Link href="/" className="brand" aria-label="GreenChain AI home">
        <Image src="/logo.svg" alt="" width={48} height={48} priority />
        <div>
          <div className="brand-name">Green<span>Chain</span></div>
          <div className="brand-sub">Farm intelligence · Bhutan</div>
        </div>
      </Link>
      <nav className="sidebar-nav" aria-label="Main navigation"><NavItems /></nav>
      <div className="sidebar-foot">
        <span className="status-dot" /> AI decision support
        <small>Confirm urgent plant-health findings with NPPC or your extension officer.</small>
      </div>
    </aside>
  );
}

export function BottomNav() {
  return <nav className="bottom-nav" aria-label="Mobile navigation"><NavItems compact /></nav>;
}
