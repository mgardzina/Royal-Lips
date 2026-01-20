"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Award,
  Shield,
  Heart,
  Sparkles,
  Calendar,
} from "lucide-react";

export default function ONasPage() {
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
            O NAS
          </h1>
          <p className="text-sm text-text-light/80 max-w-2xl mx-auto font-light tracking-wider">
            Poznaj historię Royal Lips i dowiedz się, dlaczego warto nam zaufać.
          </p>
        </div>
      </section>

      {/* About Section with Photo */}
      <section className="py-24 px-4 bg-bg-light border-b border-text-light/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Photo */}
            <div className="relative aspect-[4/5] order-2 lg:order-1">
              <div className="w-full h-full bg-primary-taupe/20 overflow-hidden">
                <Image
                  src="/self_photo.jpg"
                  alt="Joanna Wielgos - Royal Lips"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-serif font-light text-text-dark mb-8 tracking-wider">
                JOANNA WIELGOS
              </h2>
              <div className="space-y-6 text-text-dark/80 leading-relaxed font-light">
                <p>
                  Witaj! Jestem Joanna, certyfikowana stylistka makijażu
                  permanentnego z wieloletnim doświadczeniem. Moja pasja do
                  podkreślania naturalnego piękna zrodziła się wiele lat temu i
                  od tego czasu nieustannie rozwijam swoje umiejętności.
                </p>
                <p>
                  Każdą klientkę traktuję indywidualnie, poświęcając czas na
                  dokładną analizę rysów twarzy i oczekiwań. Wierzę, że dobry
                  makijaż permanentny powinien podkreślać Twoje naturalne
                  piękno, a nie go przytłaczać.
                </p>
                <p>
                  W swojej pracy wykorzystuję tylko najwyższej jakości pigmenty
                  i sprzęt, które gwarantują bezpieczeństwo i trwałość efektów.
                  Regularnie uczestniczę w szkoleniach i konferencjach, aby być
                  na bieżąco z najnowszymi trendami i technikami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 bg-bg-main border-b border-text-light/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-text-light mb-16 tracking-wider text-center">
            NASZE WARTOŚCI
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Certyfikaty */}
            <div className="text-center p-8 border border-text-light/20">
              <div className="w-16 h-16 border border-text-light/30 flex items-center justify-center mx-auto mb-6">
                <Award className="w-6 h-6 text-text-light" />
              </div>
              <h3 className="text-text-light font-light mb-3 tracking-wider uppercase text-sm">
                Certyfikaty
              </h3>
              <p className="text-text-light/70 font-light text-sm leading-relaxed">
                Regularnie poszerzam wiedzę na szkoleniach u najlepszych
                specjalistów w branży.
              </p>
            </div>

            {/* Bezpieczeństwo */}
            <div className="text-center p-8 border border-text-light/20">
              <div className="w-16 h-16 border border-text-light/30 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-6 h-6 text-text-light" />
              </div>
              <h3 className="text-text-light font-light mb-3 tracking-wider uppercase text-sm">
                Bezpieczeństwo
              </h3>
              <p className="text-text-light/70 font-light text-sm leading-relaxed">
                Stosuję jednorazowe igły i najwyższej jakości certyfikowane
                pigmenty.
              </p>
            </div>

            {/* Pasja */}
            <div className="text-center p-8 border border-text-light/20">
              <div className="w-16 h-16 border border-text-light/30 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-6 h-6 text-text-light" />
              </div>
              <h3 className="text-text-light font-light mb-3 tracking-wider uppercase text-sm">
                Pasja
              </h3>
              <p className="text-text-light/70 font-light text-sm leading-relaxed">
                Każdy zabieg wykonuję z miłością do detalu i pełnym
                zaangażowaniem.
              </p>
            </div>

            {/* Jakość */}
            <div className="text-center p-8 border border-text-light/20">
              <div className="w-16 h-16 border border-text-light/30 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-6 h-6 text-text-light" />
              </div>
              <h3 className="text-text-light font-light mb-3 tracking-wider uppercase text-sm">
                Jakość
              </h3>
              <p className="text-text-light/70 font-light text-sm leading-relaxed">
                Stawiam na naturalne efekty i precyzyjne wykonanie każdego
                zabiegu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-bg-light border-b border-text-light/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-serif font-light text-text-dark mb-2 tracking-wider">
                500+
              </div>
              <div className="text-xs text-text-dark/70 font-light tracking-wider uppercase">
                Zadowolonych klientek
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-light text-text-dark mb-2 tracking-wider">
                5+
              </div>
              <div className="text-xs text-text-dark/70 font-light tracking-wider uppercase">
                Lat doświadczenia
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-light text-text-dark mb-2 tracking-wider">
                10+
              </div>
              <div className="text-xs text-text-dark/70 font-light tracking-wider uppercase">
                Certyfikatów
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-light text-text-dark mb-2 tracking-wider">
                100%
              </div>
              <div className="text-xs text-text-dark/70 font-light tracking-wider uppercase">
                Satysfakcji
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-bg-main border-b border-text-light/20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-text-light mb-6 tracking-wider">
            PRZEKONAJ SIĘ OSOBIŚCIE
          </h2>
          <p className="text-text-light/70 mb-12 font-light tracking-wide">
            Umów się na bezpłatną konsultację i poznaj moje podejście do
            makijażu permanentnego.
          </p>
          <Link
            href="/rezerwacja"
            className="inline-flex items-center justify-center space-x-3 bg-text-light text-text-dark px-12 py-4 font-light text-sm tracking-widest hover:bg-accent-warm hover:text-text-light transition-all duration-300 uppercase"
          >
            <Calendar className="w-4 h-4" />
            <span>Umów wizytę</span>
          </Link>
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
