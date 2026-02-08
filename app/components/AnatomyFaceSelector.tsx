"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ZONES } from "@/types/face-zones";

interface FaceChartProps {
  onSelect?: (selectedIds: string[]) => void;
  initialSelected?: string[];
  allowedZones?: string[]; // Prop for filtering global ZONES
  customZones?: typeof ZONES; // New prop for completely custom zones
}

export default function FaceChart({
  onSelect,
  initialSelected = [],
  allowedZones,
  customZones,
}: FaceChartProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  // Synchronize internal state with props when initialSelected changes
  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

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
    // 1. BAZOWY (Widoczny od razu): Delikatny brązowy
    base: {
      fill: "rgba(139, 115, 85, 0.15)", // brązowy z dużą przezroczystością
      stroke: "rgba(139, 115, 85, 0.3)", // brązowy obrys
      strokeWidth: 1,
    },
    // 2. HOVER (Po najechaniu): Brązowy
    hover: {
      fill: "rgba(139, 115, 85, 0.35)", // brązowy (#8b7355) z przezroczystością
      stroke: "#8b7355", // Pełny kolor obrysu
      strokeWidth: 2,
    },
    // 3. SELECTED (Wybrany): Mocny Brązowy
    selected: {
      fill: "rgba(139, 115, 85, 0.5)", // brązowy (#8b7355) z większą przezroczystością
      stroke: "#8b7355", // mocny brązowy
      strokeWidth: 3,
    },
  };

  // Determine which zones to use
  const baseZones = customZones || ZONES;

  // Filter base zones if allowedZones is provided
  const visibleZones = allowedZones
    ? baseZones.filter((z) => allowedZones.includes(z.id))
    : baseZones;

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
    const allIds = visibleZones.map((z) => z.id);
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
    baseZones.find((z) => z.id === id)?.name || id;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Nagłówek z nazwą strefy po najechaniu (szybki podgląd) */}
      <div className="mb-2 flex items-center justify-between w-full">
        <div className="h-8 flex items-center justify-center flex-1 bg-[#f8f6f3] rounded-xl border border-[#d4cec4] mr-2">
          {hovered ? (
            <span className="text-[#8b7355] font-semibold text-sm transition-all">
              {getZoneName(hovered)}
            </span>
          ) : (
            <span className="text-[#8b8580] text-[10px] uppercase tracking-[0.2em]">
              Wybierz obszar zabiegu
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={selectAll}
          className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider text-[#8b7355] bg-[#f8f6f3] rounded-xl border border-[#d4cec4] hover:bg-[#8b7355] hover:text-white hover:border-[#8b7355] transition-all whitespace-nowrap"
        >
          {selected.length === visibleZones.length
            ? "Odznacz wszystko"
            : "Zaznacz wszystko"}
        </button>
      </div>

      {/* Kontener na SVG */}
      <div
        className="relative w-full aspect-square shadow-lg rounded-2xl overflow-hidden border border-[#d4cec4] cursor-crosshair"
        style={{
          backgroundImage: "url('/women-face-chart.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onMouseMove={handleMouseMove}
      >
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-full">
          {/* WARSTWA 2: INTERAKTYWNE STREFY */}
          {visibleZones.map((zone) => {
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
                onMouseEnter={(e) => {
                  setHovered(zone.id);
                  setMousePos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHovered(null)}
                onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
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
            className="px-3 py-1 bg-[#8b7355]/10 text-[#8b7355] text-[10px] font-bold rounded-full border border-[#8b7355]/20 hover:bg-[#8b7355]/20 hover:border-[#8b7355]/40 transition-colors flex items-center gap-1 group uppercase tracking-wider"
          >
            {getZoneName(id)}
            <span className="text-[#8b7355]/60 group-hover:text-[#8b7355] font-normal ml-1">
              ×
            </span>
          </button>
        ))}
      </div>

      {/* Cursor Tooltip - rendered via Portal to avoid backdrop-blur containing block issues */}
      {hovered && mousePos.x > 0 && typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed pointer-events-none z-[9999] bg-[#4a4540] text-white px-3 py-1.5 rounded-lg shadow-xl border border-[#8b7355]/30 text-xs font-medium uppercase tracking-wide"
            style={{
              left: mousePos.x,
              top: mousePos.y - 40,
              transform: "translateX(-50%)",
            }}
          >
            {getZoneName(hovered)}
            {/* Add a small arrow pointing down */}
            <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#4a4540]" />
          </div>,
          document.body
        )}
    </div>
  );
}
