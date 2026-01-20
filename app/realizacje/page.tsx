"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export default function RealizacjePage() {
  const [expandedImage, setExpandedImage] = useState<number | null>(null);

  const galleryItems = [
    {
      id: 1,
      title: "Makijaż permanentny brwi",
      category: "Brwi",
      image: "/realizacje/1.jpeg",
    },
    {
      id: 2,
      title: "Makijaż permanentny ust",
      category: "Usta",
      image: "/realizacje/2.jpeg",
    },
    {
      id: 3,
      title: "Makijaż permanentny oczu",
      category: "Oczy",
      image: "/realizacje/3.jpeg",
    },
    {
      id: 4,
      title: "Makijaż permanentny brwi - efekt naturalny",
      category: "Brwi",
      image: "/realizacje/4.jpeg",
    },
    {
      id: 5,
      title: "Usta - nude",
      category: "Usta",
      image: "/realizacje/5.jpeg",
    },
    {
      id: 6,
      title: "Makijaż permanentny brwi",
      category: "Brwi",
      image: "/realizacje/6.jpg",
    },
  ];

  const navigateToNextImage = () => {
    if (expandedImage === null) return;
    const currentIndex = galleryItems.findIndex(
      (item) => item.id === expandedImage,
    );
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setExpandedImage(galleryItems[nextIndex].id);
  };

  const navigateToPreviousImage = () => {
    if (expandedImage === null) return;
    const currentIndex = galleryItems.findIndex(
      (item) => item.id === expandedImage,
    );
    const previousIndex =
      (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setExpandedImage(galleryItems[previousIndex].id);
  };

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
            REALIZACJE
          </h1>
          <p className="text-sm text-text-light/80 max-w-2xl mx-auto mb-12 font-light tracking-wider">
            Zobacz efekty naszej pracy. Każdy zabieg wykonany z pasją i
            precyzją.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="pb-32 px-4 border-b border-text-light/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative bg-bg-light overflow-hidden cursor-pointer aspect-square"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setExpandedImage(item.id)}
              >
                {/* Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary-taupe/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-xs text-text-light/70 font-light tracking-widest mb-2 block uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-text-light font-light text-sm tracking-wider px-4">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-bg-light border-b border-text-light/20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-text-dark mb-6 tracking-wider">
            CHCESZ WYGLĄDAĆ TAK SAMO PIĘKNIE?
          </h2>
          <p className="text-text-dark/70 mb-12 font-light tracking-wide">
            Umów się na konsultację i zobacz, jak makijaż permanentny może
            zmienić Twój wygląd.
          </p>
          <Link
            href="/rezerwacja"
            className="inline-block bg-primary-taupe text-text-light px-12 py-4 font-light text-sm tracking-widest hover:bg-accent-warm transition-all duration-300 uppercase"
          >
            Zarezerwuj wizytę
          </Link>
        </div>
      </section>

      {/* Image Modal/Lightbox */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setExpandedImage(null)}
        >
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-8 right-8 text-white hover:text-accent-warm transition-colors p-2"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous Image Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateToPreviousImage();
            }}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-white hover:text-accent-warm transition-colors p-3 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          {/* Next Image Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateToNextImage();
            }}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-white hover:text-accent-warm transition-colors p-3 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {galleryItems
              .filter((item) => item.id === expandedImage)
              .map((item) => (
                <div
                  key={item.id}
                  className="relative w-full h-full flex flex-col items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative w-full h-[80vh] max-w-5xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </div>
                  <div className="mt-8 text-center">
                    <span className="text-xs text-white/70 font-light tracking-widest mb-2 block uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-white font-light text-lg tracking-wider">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
