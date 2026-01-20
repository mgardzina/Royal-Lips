"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Clock,
  Calendar,
} from "lucide-react";

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-bg-main">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-main/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-serif font-light text-text-light tracking-widest">
                ROYAL LIPS
              </h1>
            </Link>
            <Link
              href="/"
              className="flex items-center space-x-2 text-text-light hover:text-accent-warm transition-colors font-light text-sm tracking-wider uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Powrót</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="pt-40 pb-20 px-4 border-b border-text-light/20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-light text-text-light mb-8 tracking-widest">
            KONTAKT
          </h1>
          <p className="text-sm text-text-light/80 max-w-2xl mx-auto font-light tracking-wider">
            Masz pytania? Skontaktuj się z nami. Chętnie odpowiemy na wszystkie
            Twoje wątpliwości.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-24 px-4 bg-bg-light border-b border-text-light/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <a
              href="tel:+48792377737"
              className="group bg-bg-main p-10 text-center hover:bg-primary-taupe transition-all duration-500 border border-text-light/10"
            >
              <div className="w-16 h-16 border border-text-light/30 group-hover:border-text-light flex items-center justify-center mx-auto mb-6">
                <Phone className="w-6 h-6 text-text-light" />
              </div>
              <h3 className="font-light text-text-light mb-3 tracking-wider text-sm uppercase">
                Telefon
              </h3>
              <p className="text-text-light/80 font-light text-md">
                +48 792 377 737
              </p>
            </a>

            {/* Email */}
            <a
              href="mailto:kontakt@royallips.pl"
              className="group bg-bg-main p-10 text-center hover:bg-primary-taupe transition-all duration-500 border border-text-light/10"
            >
              <div className="w-16 h-16 border border-text-light/30 group-hover:border-text-light flex items-center justify-center mx-auto mb-6">
                <Mail className="w-6 h-6 text-text-light" />
              </div>
              <h3 className="font-light text-text-light mb-3 tracking-wider text-sm uppercase">
                Email
              </h3>
              <p className="text-text-light/80 font-light text-md">
                kontakt@royallips.pl
              </p>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/makijazpermanentnykrosno/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-bg-main p-10 text-center hover:bg-primary-taupe transition-all duration-500 border border-text-light/10"
            >
              <div className="w-16 h-16 border border-text-light/30 group-hover:border-text-light flex items-center justify-center mx-auto mb-6">
                <Instagram className="w-6 h-6 text-text-light" />
              </div>
              <h3 className="font-light text-text-light mb-3 tracking-wider text-sm uppercase">
                Instagram
              </h3>
              <p className="text-text-light/80 font-light text-md break-all">
                @makijazpermanentnykrosno
              </p>
            </a>

            {/* Location */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Pużaka+37,+Krosno,+Poland"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-bg-main p-10 text-center hover:bg-primary-taupe transition-all duration-500 border border-text-light/10"
            >
              <div className="w-16 h-16 border border-text-light/30 group-hover:border-text-light flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-6 h-6 text-text-light" />
              </div>
              <h3 className="font-light text-text-light mb-3 tracking-wider text-sm uppercase">
                Lokalizacja
              </h3>
              <p className="text-text-light/80 font-light text-md">
                Pużaka 37, Krosno, Poland
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="py-24 px-4 bg-bg-main border-b border-text-light/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 border border-text-light/30 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-6 h-6 text-text-light" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-text-light mb-4 tracking-wider">
              GODZINY OTWARCIA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-text-light/10 max-w-2xl mx-auto">
            <div className="bg-bg-main p-8 text-center">
              <h3 className="text-text-light font-light mb-2 tracking-wider uppercase text-sm">
                Poniedziałek - Piątek
              </h3>
              <p className="text-text-light/80 font-light text-xl">
                9:00 - 18:00
              </p>
            </div>
            <div className="bg-bg-main p-8 text-center">
              <h3 className="text-text-light font-light mb-2 tracking-wider uppercase text-sm">
                Sobota
              </h3>
              <p className="text-text-light/80 font-light text-xl">
                9:00 - 14:00
              </p>
            </div>
          </div>

          <p className="text-center text-text-light/60 font-light text-sm mt-8 tracking-wider">
            Wizyty tylko po wcześniejszej rezerwacji
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-bg-light border-b border-text-light/20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-text-dark mb-6 tracking-wider">
            UMÓW SIĘ NA WIZYTĘ
          </h2>
          <p className="text-text-dark/70 mb-12 font-light tracking-wide">
            Zarezerwuj termin online lub zadzwoń, a wspólnie dobierzemy
            najlepszy zabieg dla Ciebie.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/rezerwacja"
              className="inline-flex items-center justify-center space-x-3 bg-primary-taupe text-text-light px-12 py-4 font-light text-sm tracking-widest hover:bg-accent-warm transition-all duration-300 uppercase"
            >
              <Calendar className="w-4 h-4" />
              <span>Rezerwacja online</span>
            </Link>
            <a
              href="tel:+48792377737"
              className="inline-flex items-center justify-center space-x-3 bg-transparent border-2 border-text-dark text-text-dark px-12 py-4 font-light text-sm tracking-widest hover:bg-text-dark hover:text-text-light transition-all duration-300 uppercase"
            >
              <Phone className="w-4 h-4" />
              <span>Zadzwoń</span>
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
