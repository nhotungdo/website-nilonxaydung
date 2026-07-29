"use client";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
      <Link href="/" className="flex items-center hover:text-[#2b6cb0] transition-colors">
        <Home className="w-4 h-4 mr-1" />
        <span>Trang chủ</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[#2b6cb0] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
