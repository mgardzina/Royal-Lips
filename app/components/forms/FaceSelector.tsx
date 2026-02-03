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
      { id: "czolo", label: "Czoło", icon: "〰️" },
      { id: "lwia-zmarszczka", label: "Lwia zmarszczka", icon: "║" },
      { id: "brwi", label: "Okolice brwi", icon: "⌒" },
    ],
  },
  {
    category: "Okolice oczu",
    color: "#8b5cf6", // Purple
    zones: [
      { id: "kurze-lapki-l", label: "Kurze łapki (L)", icon: "⟨" },
      { id: "kurze-lapki-p", label: "Kurze łapki (P)", icon: "⟩" },
      { id: "dolina-lez-l", label: "Dolina łez (L)", icon: "◡" },
      { id: "dolina-lez-p", label: "Dolina łez (P)", icon: "◡" },
      { id: "powieki", label: "Powieki", icon: "👁" },
    ],
  },
  {
    category: "Środkowa część twarzy",
    color: "#eab308", // Yellow
    zones: [
      { id: "nos", label: "Nos", icon: "△" },
      { id: "policzek-l", label: "Policzek lewy", icon: "◐" },
      { id: "policzek-p", label: "Policzek prawy", icon: "◑" },
      { id: "bruzda-l", label: "Bruzda nosowo-wargowa (L)", icon: "(" },
      { id: "bruzda-p", label: "Bruzda nosowo-wargowa (P)", icon: ")" },
    ],
  },
  {
    category: "Usta i okolice",
    color: "#ec4899", // Pink
    zones: [
      { id: "usta", label: "Usta", icon: "💋" },
      { id: "kontur-ust", label: "Kontur ust", icon: "◯" },
      { id: "marionetka-l", label: "Linia marionetki (L)", icon: "╲" },
      { id: "marionetka-p", label: "Linia marionetki (P)", icon: "╱" },
      { id: "kod-kreskowy", label: "Zmarszczki nad ustami", icon: "|||" },
    ],
  },
  {
    category: "Dolna część twarzy",
    color: "#ef4444", // Red
    zones: [
      { id: "zuchwa-l", label: "Żuchwa (L)", icon: "⌊" },
      { id: "zuchwa-p", label: "Żuchwa (P)", icon: "⌋" },
      { id: "broda", label: "Broda", icon: "⌄" },
      { id: "podbrodek", label: "Podbródek", icon: "◡" },
      { id: "szyja", label: "Szyja", icon: "▭" },
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
            <p
              className="text-xs font-semibold mb-2 px-1"
              style={{ color: category.color }}
            >
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
                          ? "text-white shadow-md"
                          : "bg-white text-[#4a4540] border-[#e8e0d5] hover:border-[#d4cec4]"
                      }
                    `}
                    style={{
                      backgroundColor: selected ? category.color : undefined,
                      borderColor: selected ? category.color : undefined,
                    }}
                  >
                    <span className="text-base">{zone.icon}</span>
                    <span>{zone.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Podsumowanie wybranych */}
      {selectedZones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl"
        >
          <p className="text-xs text-green-700 font-medium mb-2">
            Wybrane obszary ({selectedZones.length}):
          </p>
          <p className="text-sm text-green-800">
            {selectedZones.join(", ")}
          </p>
        </motion.div>
      )}
    </div>
  );
};
