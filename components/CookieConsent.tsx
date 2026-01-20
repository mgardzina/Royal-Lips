"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user already accepted cookies
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Small delay before showing banner
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-bg-light border-t border-text-dark/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 pr-4">
            <p className="text-text-dark font-light text-sm leading-relaxed">
              Ta strona używa plików cookies w celu zapewnienia najlepszej
              jakości usług. Korzystając ze strony, zgadzasz się na ich użycie.{" "}
              <Link
                href="/polityka-prywatnosci"
                className="text-primary-taupe underline hover:text-accent-warm transition-colors"
              >
                Dowiedz się więcej
              </Link>
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={declineCookies}
              className="px-6 py-2 border border-text-dark/20 text-text-dark font-light text-xs tracking-wider hover:bg-bg-main/50 transition-all uppercase"
            >
              Odrzuć
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 bg-primary-taupe text-text-light font-light text-xs tracking-wider hover:bg-accent-warm transition-all uppercase"
            >
              Akceptuję
            </button>
          </div>

          <button
            onClick={declineCookies}
            className="absolute top-2 right-2 md:hidden p-2 text-text-dark/50 hover:text-text-dark transition-colors"
            aria-label="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
