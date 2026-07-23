"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", ico: "⌂", label: "Home" },
  { href: "/crops", ico: "🌱", label: "Crop Selection" },
  { href: "/disease", ico: "🔍", label: "Disease Check" },
  { href: "/soil", ico: "🧪", label: "Soil Health" },
];

function Items() {
  const path = usePathname();
  return (
    <>
      {ITEMS.map((it) => (
        <Link key={it.href} href={it.href}
          className={`nav-item${path === it.href ? " active" : ""}`}>
          <span className="ico">{it.ico}</span>
          <span>{it.label}</span>
        </Link>
      ))}
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="GreenChain logo" />
        </div>
        <div>
          <div className="brand-name">Green<em>Chain</em></div>
          <div className="brand-sub">AI farm advisor · Bhutan</div>
        </div>
      </div>
      <Items />
      <div className="sidebar-foot">
        Prototype — AI-generated advice. Confirm serious findings with NPPC Semtokha
        or your dzongkhag extension office.
      </div>
    </aside>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <Items />
    </nav>
  );
}
