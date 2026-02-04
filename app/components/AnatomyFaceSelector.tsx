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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    // Relatywna pozycja względem viewportu (dla fixed tooltipa)
    setMousePos({ x: e.clientX, y: e.clientY });
  };

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
    // 2. HOVER (Po najechaniu): Ciemniejszy
    hover: {
      fill: "rgba(139, 115, 85, 0.4)", // Ciemniejszy odcień złota/brązu
      stroke: "#8b7355", // Pełny kolor obrysu
      strokeWidth: 2,
    },
    // 3. SELECTED (Wybrany): Gold/Brown
    selected: {
      fill: "rgba(139, 115, 85, 0.5)", // #8b7355 z przezroczystością
      stroke: "#8b7355", // mocny brąz/złoto
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

  const selectAll = () => {
    const allIds = ZONES.map((z) => z.id);
    if (selected.length === allIds.length) {
      // Deselect all if all are selected
      setSelected([]);
      if (onSelect) onSelect([]);
    } else {
      // Select all
      setSelected(allIds);
      if (onSelect) onSelect(allIds);
    }
  };

  const getZoneName = (id: string) =>
    ZONES.find((z) => z.id === id)?.name || id;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Nagłówek z nazwą strefy po najechaniu (szybki podgląd) */}
      <div className="mb-2 flex items-center justify-between w-full">
        <div className="h-8 flex items-center justify-center flex-1 bg-gray-50 rounded-md border border-gray-100 mr-2">
          {hovered ? (
            <span className="text-[#8b7355] font-semibold text-sm animate-pulse transition-all">
              {getZoneName(hovered)}
            </span>
          ) : (
            <span className="text-gray-400 text-xs uppercase tracking-wider">
              Wybierz obszar zabiegu
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={selectAll}
          className="h-8 px-3 text-xs font-medium text-[#8b7355] bg-[#8b7355]/10 rounded-md hover:bg-[#8b7355]/20 transition-colors whitespace-nowrap"
        >
          {selected.length === ZONES.length
            ? "Odznacz wszystko"
            : "Zaznacz wszystko"}
        </button>
      </div>

      {/* Kontener na SVG */}
      <div
        className="relative w-full aspect-square shadow-xl rounded-xl overflow-hidden border border-gray-200 bg-white cursor-crosshair"
        onMouseMove={handleMouseMove}
      >
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
            className="px-3 py-1 bg-[#8b7355]/10 text-[#8b7355] text-xs font-bold rounded-full border border-[#8b7355]/20 hover:bg-[#8b7355]/20 hover:border-[#8b7355]/40 transition-colors flex items-center gap-1 group"
          >
            {getZoneName(id)}
            <span className="text-[#8b7355]/60 group-hover:text-[#8b7355] font-normal ml-1">
              ×
            </span>
          </button>
        ))}
      </div>

      {/* Cursor Tooltip */}
      {hovered && (
        <div
          className="fixed pointer-events-none z-[9999] bg-[#4a4540] text-white px-4 py-2 rounded-lg shadow-2xl border border-[#8b7355]/50 text-sm font-medium transform -translate-x-1/2 -translate-y-[120%]"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transition: "opacity 0.15s ease-out",
          }}
        >
          {getZoneName(hovered)}
          {/* Add a small arrow pointing down */}
          <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#4a4540]" />
        </div>
      )}
    </div>
  );
}
