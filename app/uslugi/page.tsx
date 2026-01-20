"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { SERVICES, CATEGORIES } from "../../data/services";

export default function UslugiPage() {
  return (
    <div className="min-h-screen bg-bg-main">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-main/95 backdrop-blur-sm border-b border-text-light/20">
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
            USŁUGI
          </h1>
          <p className="text-sm text-text-light/80 max-w-2xl mx-auto mb-12 font-light tracking-wider">
            Profesjonalne zabiegi PMU, kwasu hialuronowego i mezoterapii
            wykonane z najwyższą starannością.
          </p>
        </div>
      </section>

      {/* Services by Category */}
      {CATEGORIES.map((category, catIndex) => (
        <section
          key={category}
          className={`py-24 px-4 ${catIndex % 2 === 0 ? "bg-bg-main" : "bg-bg-light"} border-b border-text-light/20`}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-text-light mb-16 tracking-widest text-center">
              {category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.filter((service) => service.id !== "inne")
                .filter((service) => service.category === category)
                .map((service, index) => (
                  <div
                    key={service.id}
                    className="bg-bg-light/50 border-2 border-text-light/20 p-8 hover:border-text-light/40 hover:bg-primary-taupe/20 transition-all duration-500 group flex flex-col"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-serif font-light text-text-light mb-3 tracking-wider uppercase">
                        {service.name}
                      </h3>
                      <div className="flex items-center text-text-light/60 text-sm font-light">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{service.duration}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-text-light/70 text-sm font-light leading-relaxed mb-6 flex-grow">
                      {service.description}
                    </p>

                    {/* CTA */}
                    <Link
                      href="/rezerwacja"
                      className="inline-flex items-center justify-center space-x-2 w-full text-center bg-text-light/10 border border-text-light/30 text-text-light px-6 py-3 rounded-md font-light text-xs tracking-widest hover:bg-text-light hover:text-text-dark transition-all duration-300 uppercase"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Umów wizytę</span>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-24 bg-bg-light border-b border-text-light/20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-text-dark mb-6 tracking-wider">
            NIE WIESZ KTÓRĄ USŁUGĘ WYBRAĆ?
          </h2>
          <p className="text-text-dark/70 mb-12 font-light tracking-wide">
            Skontaktuj się z nami, a pomożemy Ci wybrać najlepszy zabieg
            dopasowany do Twoich potrzeb.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/rezerwacja"
              className="inline-block bg-primary-taupe text-text-light px-12 py-4 rounded-md border-2 border-primary-taupe font-light text-sm tracking-widest hover:bg-accent-warm hover:border-accent-warm transition-all duration-300 uppercase"
            >
              Umów konsultację
            </Link>
            <a
              href="tel:+48123456789"
              className="inline-block bg-transparent border-2 border-text-dark text-text-dark px-12 py-4 rounded-md font-light text-sm tracking-widest hover:bg-text-dark hover:text-text-light transition-all duration-300 uppercase"
            >
              Zadzwoń
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
                PMU • Kwas Hialuronowy • Mezoterapia
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
