"use client";

import React from "react";
import { motion } from "framer-motion";

interface FaceSelectorProps {
  selectedZones: string[];
  onChange: (zones: string[]) => void;
}

// Kategorie stref zabiegowych
const ZONE_CATEGORIES = [
  {
    category: "Górna część twarzy",
    color: "#3b82f6", // Blue
    zones: [
      { id: "czolo", label: "Czoło" },
      { id: "lwia-zmarszczka", label: "Lwia zmarszczka" },
      { id: "brwi", label: "Okolice brwi" },
    ],
  },
  {
    category: "Okolice oczu",
    color: "#8b5cf6", // Purple
    zones: [
      { id: "kurze-lapki-l", label: "Kurze łapki (L)" },
      { id: "kurze-lapki-p", label: "Kurze łapki (P)" },
      { id: "dolina-lez-l", label: "Dolina łez (L)" },
      { id: "dolina-lez-p", label: "Dolina łez (P)" },
      { id: "powieki", label: "Powieki" },
    ],
  },
  {
    category: "Środkowa część twarzy",
    color: "#eab308", // Yellow
    zones: [
      { id: "nos", label: "Nos" },
      { id: "policzek-l", label: "Policzek lewy" },
      { id: "policzek-p", label: "Policzek prawy" },
      { id: "bruzda-l", label: "Bruzda nosowo-wargowa (L)" },
      { id: "bruzda-p", label: "Bruzda nosowo-wargowa (P)" },
    ],
  },
  {
    category: "Usta i okolice",
    color: "#ec4899", // Pink
    zones: [
      { id: "usta", label: "Usta" },
      { id: "kontur-ust", label: "Kontur ust" },
      { id: "marionetka-l", label: "Linia marionetki (L)" },
      { id: "marionetka-p", label: "Linia marionetki (P)" },
      { id: "kod-kreskowy", label: "Zmarszczki nad ustami" },
    ],
  },
  {
    category: "Dolna część twarzy",
    color: "#ef4444", // Red
    zones: [
      { id: "zuchwa-l", label: "Żuchwa (L)" },
      { id: "zuchwa-p", label: "Żuchwa (P)" },
      { id: "broda", label: "Broda" },
      { id: "podbrodek", label: "Podbródek" },
      { id: "szyja", label: "Szyja" },
    ],
  },
];

export const FaceSelector: React.FC<FaceSelectorProps> = ({
  selectedZones,
  onChange,
}) => {
  const toggleZone = (label: string) => {
    if (selectedZones.includes(label)) {
      onChange(selectedZones.filter((z) => z !== label));
    } else {
      onChange([...selectedZones, label]);
    }
  };

  const isSelected = (label: string) => selectedZones.includes(label);

  return (
    <div className="w-full">
      <p className="text-sm text-[#4a4540] mb-4 font-medium text-center">
        Wybierz obszary zabiegowe
      </p>

      <div className="space-y-4">
        {ZONE_CATEGORIES.map((category) => (
          <div key={category.category} className="bg-white/50 rounded-xl p-3">
            <p className="text-xs font-semibold mb-2 px-1 text-[#8b7355]">
              {category.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {category.zones.map((zone) => {
                const selected = isSelected(zone.label);
                return (
                  <motion.button
                    key={zone.id}
                    type="button"
                    onClick={() => toggleZone(zone.label)}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      border-2 flex items-center gap-2
                      ${
                        selected
                          ? "bg-[#8b7355] border-[#8b7355] text-white shadow-md"
                          : "bg-white text-[#4a4540] border-[#e8e0d5] hover:border-[#d4cec4]"
                      }
                    `}
                  >
                    <span>{zone.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
