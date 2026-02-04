"use client";

import { useState } from "react";
import { ZONES } from "@/types/face-zones";

interface FaceChartProps {
  onSelect?: (selectedIds: string[]) => void;
  initialSelected?: string[];
}

export default function FaceChart({
  onSelect,
  initialSelected = [],
}: FaceChartProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [hovered, setHovered] = useState<string | null>(null);

  // STAŁE WYMIARY (ustalone na podstawie Twojej ostatniej Figmy)
  const WIDTH = 980;
  const HEIGHT = 980;

  // KOLORYSTYKA STREF
  const colors = {
    // 1. BAZOWY (Widoczny od razu): Delikatny szary
    base: {
      fill: "rgba(107, 114, 128, 0.2)", // szary z dużą przezroczystością
      stroke: "rgba(107, 114, 128, 0.5)", // szary obrys
      strokeWidth: 1,
    },
    // 2. HOVER (Po najechaniu): Rozjaśnienie
    hover: {
      fill: "rgba(255, 255, 255, 0.3)", // biała mgiełka
      stroke: "rgba(255, 255, 255, 0.9)", // mocny biały obrys
      strokeWidth: 2,
    },
    // 3. SELECTED (Wybrany): Różowy
    selected: {
      fill: "rgba(236, 72, 153, 0.5)", // różowe wypełnienie
      stroke: "#be185d", // mocny różowy obrys (pink-700)
      strokeWidth: 3,
    },
  };

  const toggleZone = (id: string) => {
    let newSelected;
    if (selected.includes(id)) {
      newSelected = selected.filter((z) => z !== id);
    } else {
      newSelected = [...selected, id];
    }

    setSelected(newSelected);
    if (onSelect) onSelect(newSelected);
  };

  const getZoneName = (id: string) =>
    ZONES.find((z) => z.id === id)?.name || id;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Nagłówek z nazwą strefy po najechaniu (szybki podgląd) */}
      <div className="mb-2 h-8 flex items-center justify-center w-full bg-gray-50 rounded-md border border-gray-100">
        {hovered ? (
          <span className="text-pink-600 font-semibold text-sm animate-pulse transition-all">
            {getZoneName(hovered)}
          </span>
        ) : (
          <span className="text-gray-400 text-xs uppercase tracking-wider">
            Wybierz obszar zabiegu
          </span>
        )}
      </div>

      {/* Kontener na SVG */}
      <div className="relative w-full aspect-square shadow-xl rounded-xl overflow-hidden border border-gray-200 bg-white">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-full">
          {/* WARSTWA 1: ZDJĘCIE TŁA (musi być w folderze /public) */}
          <image
            href="/women-face-chart.jpg"
            width={WIDTH}
            height={HEIGHT}
            preserveAspectRatio="xMidYMid slice"
          />

          {/* WARSTWA 2: INTERAKTYWNE STREFY */}
          {ZONES.map((zone) => {
            const isSelected = selected.includes(zone.id);
            const isHovered = hovered === zone.id;

            // Ustalanie aktualnego stylu na podstawie stanu
            let currentStyle = colors.base;
            if (isSelected) {
              currentStyle = colors.selected;
            } else if (isHovered) {
              currentStyle = colors.hover;
            }

            return (
              <path
                key={zone.id}
                d={zone.d}
                onClick={() => toggleZone(zone.id)}
                onMouseEnter={() => setHovered(zone.id)}
                onMouseLeave={() => setHovered(null)}
                // Aplikowanie dynamicznych stylów
                fill={currentStyle.fill}
                stroke={currentStyle.stroke}
                strokeWidth={currentStyle.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer transition-all duration-300 ease-out"
                style={{
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {/* To dodaje systemowy tooltip po najechaniu myszką */}
                <title>{zone.name}</title>
              </path>
            );
          })}
        </svg>
      </div>

      {/* Lista wybranych tagów pod spodem */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 min-h-[40px]">
        {selected.map((id) => (
          <button
            key={id}
            onClick={() => toggleZone(id)}
            className="px-3 py-1 bg-pink-50 text-pink-700 text-xs font-bold rounded-full border border-pink-200 hover:bg-pink-100 hover:border-pink-300 transition-colors flex items-center gap-1 group"
          >
            {getZoneName(id)}
            <span className="text-pink-400 group-hover:text-pink-600 font-normal ml-1">
              ×
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
