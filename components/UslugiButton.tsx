"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface UslugiButtonProps {
  className?: string;
}

export default function UslugiButton({ className = "" }: UslugiButtonProps) {
  return (
    <Link
      href="/uslugi"
      className={`inline-flex items-center justify-center space-x-3 bg-text-light text-text-dark px-10 py-4 rounded-md border-2 border-text-light font-light text-sm tracking-widest hover:bg-accent-warm hover:text-text-light hover:border-accent-warm transition-all duration-300 uppercase group ${className}`}
    >
      <span>Zobacz wszystkie usługi</span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
