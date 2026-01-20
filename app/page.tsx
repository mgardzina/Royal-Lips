"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Calendar, Phone, Mail } from "lucide-react";
import { SERVICES } from "../types/booking";
import UslugiButton from "../components/UslugiButton";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-main">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-main/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-serif font-light text-text-light tracking-widest">
                ROYAL LIPS
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/uslugi"
                className="text-text-light font-light text-sm tracking-wider hover:text-accent-warm transition-colors"
              >
                USŁUGI
              </Link>
              <Link
                href="/realizacje"
                className="text-text-light font-light text-sm tracking-wider hover:text-accent-warm transition-colors"
              >
                REALIZACJE
              </Link>
              <Link
                href="/o-nas"
                className="text-text-light font-light text-sm tracking-wider hover:text-accent-warm transition-colors"
              >
                O NAS
              </Link>
              <Link
                href="/kontakt"
                className="text-text-light font-light text-sm tracking-wider hover:text-accent-warm transition-colors"
              >
                KONTAKT
              </Link>
              <Link
                href="/rezerwacja"
                className="bg-text-light text-text-dark px-6 py-2 rounded-md border-2 border-text-light font-light text-sm tracking-wider hover:bg-accent-warm hover:text-text-light hover:border-accent-warm transition-all duration-300 uppercase"
              >
                Umów wizytę
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 border-b border-text-light/20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light text-text-light mb-12 leading-tight tracking-widest">
              ROYAL
              <br />
              LIPS
            </h1>

            <p className="text-sm md:text-base text-text-light font-light tracking-wider mb-4 uppercase">
              Makijaż Permanentny & PMU
            </p>

            <p className="text-lg md:text-xl text-text-light/80 font-light mb-16 max-w-md mx-auto">
              Joanna Wielgos
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link
                href="/rezerwacja"
                className="group bg-text-light text-text-dark px-10 py-4 rounded-md border-2 border-text-light font-light text-sm tracking-wider hover:bg-accent-warm hover:text-text-light hover:border-accent-warm transition-all duration-300 flex items-center space-x-3 uppercase shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>Umów wizytę</span>
              </Link>

              <a
                href="https://www.instagram.com/makijazpermanentnykrosno/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-transparent border-2 border-text-light text-text-light px-10 py-4 rounded-md font-light text-sm tracking-wider hover:bg-text-light hover:text-text-dark transition-all duration-300 flex items-center space-x-3 uppercase"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="uslugi"
        className="py-32 bg-bg-light border-b border-text-light/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-text-dark mb-4 tracking-wider">
              USŁUGI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {SERVICES.filter((s) => s.id !== "inne").map((service, index) => (
              <div
                key={service.id}
                className="group bg-bg-main/50 p-10 text-center border-2 border-text-light/20 hover:bg-primary-taupe hover:border-text-light/40 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-serif font-light text-text-dark group-hover:text-text-light mb-4 tracking-wider uppercase">
                  {service.name}
                </h3>

                <p className="text-text-dark/70 group-hover:text-text-light/80 mb-6 leading-relaxed font-light text-sm">
                  {service.description}
                </p>

                <div className="flex flex-col items-center space-y-3">
                  <span className="text-xs text-text-dark/50 group-hover:text-text-light/70 font-light tracking-wider">
                    ~{service.duration} MIN
                  </span>
                  <Link
                    href="/rezerwacja"
                    className="text-text-dark group-hover:text-text-light font-light text-xs tracking-widest transition-colors uppercase border-b border-text-dark/20 group-hover:border-text-light/40 pb-1"
                  >
                    Rezerwuj
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Button to see all services */}
          <div className="text-center mt-16">
            <UslugiButton />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="o-nas"
        className="py-32 bg-bg-main border-b border-text-light/20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-serif font-light text-text-light mb-12 tracking-wider">
                O NAS
              </h2>

              <div className="space-y-6 text-text-light/80 leading-relaxed font-light">
                <p>
                  Profesjonalne studio makijażu permanentnego w Krośnie. Każdy
                  zabieg wykonuję z najwyższą starannością, dbając o naturalne
                  efekty i Twoje bezpieczeństwo.
                </p>
                <p>
                  Wykorzystuję najnowocześniejszy sprzęt i certyfikowane
                  pigmenty, które gwarantują trwałość koloru i bezpieczeństwo
                  zabiegu.
                </p>
                <p>
                  Przed każdym zabiegiem przeprowadzam szczegółową konsultację,
                  aby wspólnie dobrać kształt i kolor idealnie dopasowany do
                  Twojej urody.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="text-center border border-text-light/20 p-8">
                  <div className="text-4xl font-serif font-light text-text-light mb-2 tracking-wider">
                    500+
                  </div>
                  <div className="text-xs text-text-light/70 font-light tracking-wider uppercase">
                    Klientek
                  </div>
                </div>
                <div className="text-center border border-text-light/20 p-8">
                  <div className="text-4xl font-serif font-light text-text-light mb-2 tracking-wider">
                    100%
                  </div>
                  <div className="text-xs text-text-light/70 font-light tracking-wider uppercase">
                    Bezpieczeństwo
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-square">
              <div className="w-full h-full bg-primary-taupe/30 overflow-hidden">
                <Image
                  src="/self_photo.jpg"
                  alt="Joanna Wielgos - Royal Lips"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="kontakt"
        className="py-32 bg-bg-light border-b border-text-light/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-text-dark mb-4 tracking-wider">
              KONTAKT
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <a
              href="tel:+48792377737"
              className="group bg-bg-main/50 p-12 text-center hover:bg-primary-taupe transition-all duration-500"
            >
              <div className="w-12 h-12 border border-text-dark/20 group-hover:border-text-light flex items-center justify-center mx-auto mb-6">
                <Phone className="w-5 h-5 text-text-dark group-hover:text-text-light" />
              </div>
              <h3 className="font-light text-text-dark group-hover:text-text-light mb-3 tracking-wider text-xs uppercase">
                Telefon
              </h3>
              <p className="text-text-dark/70 group-hover:text-text-light/90 font-light text-sm">
                +48 792 377 737
              </p>
            </a>

            <a
              href="mailto:kontakt@example.com"
              className="group bg-bg-main/50 p-12 text-center hover:bg-primary-taupe transition-all duration-500"
            >
              <div className="w-12 h-12 border border-text-dark/20 group-hover:border-text-light flex items-center justify-center mx-auto mb-6">
                <Mail className="w-5 h-5 text-text-dark group-hover:text-text-light" />
              </div>
              <h3 className="font-light text-text-dark group-hover:text-text-light mb-3 tracking-wider text-xs uppercase">
                Email
              </h3>
              <p className="text-text-dark/70 group-hover:text-text-light/90 font-light text-sm">
                kontakt@example.com
              </p>
            </a>

            <a
              href="https://www.instagram.com/makijazpermanentnykrosno/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-bg-main/50 p-12 text-center hover:bg-primary-taupe transition-all duration-500"
            >
              <div className="w-12 h-12 border border-text-dark/20 group-hover:border-text-light flex items-center justify-center mx-auto mb-6">
                <Instagram className="w-5 h-5 text-text-dark group-hover:text-text-light" />
              </div>
              <h3 className="font-light text-text-dark group-hover:text-text-light mb-3 tracking-wider text-xs uppercase">
                Instagram
              </h3>
              <p className="text-text-dark/70 group-hover:text-text-light/90 font-light text-sm">
                @makijazpermanentnykrosno
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-taupe text-text-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <span className="text-xl font-serif font-light tracking-widest">
                ROYAL LIPS
              </span>
              <p className="text-xs text-text-light/70 mt-3 font-light tracking-wider">
                Profesjonalny makijaż permanentny
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-xs text-text-light/70 font-light tracking-wider">
                © 2025 Royal Lips. Wszystkie prawa zastrzeżone.
              </p>
              <div className="flex space-x-6 mt-3 justify-center md:justify-end">
                <Link
                  href="/polityka-prywatnosci"
                  className="text-text-light/70 hover:text-text-light transition-colors text-xs tracking-wider"
                >
                  Polityka prywatności
                </Link>
                <Link
                  href="/regulamin"
                  className="text-text-light/70 hover:text-text-light transition-colors text-xs tracking-wider"
                >
                  Regulamin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
