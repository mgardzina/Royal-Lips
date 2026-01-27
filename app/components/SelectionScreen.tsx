import { Syringe, PenTool, Zap, Sparkles } from "lucide-react";

interface SelectionScreenProps {
  onSelect: (type: "HYALURONIC" | "PMU" | "LASER") => void;
}

export default function SelectionScreen({ onSelect }: SelectionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#4a4540] mb-4 tracking-wide">
            ROYAL LIPS
          </h1>
          <p className="text-xl text-[#8b7355] font-light">
            Wybierz rodzaj zabiegu, aby uzupełnić zgodę
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Kwas Hialuronowy */}
          <button
            onClick={() => onSelect("HYALURONIC")}
            className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#d4cec4] hover:border-[#8b7355] hover:bg-white/80 transition-all duration-300 flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 bg-[#efe9e1] rounded-full flex items-center justify-center group-hover:bg-[#8b7355]/10 transition-colors">
              <Syringe className="w-10 h-10 text-[#8b7355] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-serif text-[#4a4540] mb-2 font-medium">
                Powiększanie Ust
              </h3>
              <p className="text-sm text-[#8b8580]">
                Kwas hialuronowy, wolumetria
              </p>
            </div>
          </button>

          {/* Makijaż Permanentny */}
          <button
            onClick={() => onSelect("PMU")}
            className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#d4cec4] hover:border-[#8b7355] hover:bg-white/80 transition-all duration-300 flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 bg-[#efe9e1] rounded-full flex items-center justify-center group-hover:bg-[#8b7355]/10 transition-colors">
              <PenTool className="w-10 h-10 text-[#8b7355] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-serif text-[#4a4540] mb-2 font-medium">
                Makijaż Permanentny
              </h3>
              <p className="text-sm text-[#8b8580]">Brwi, usta, kreski</p>
            </div>
          </button>

          {/* Laser Q-Switch */}
          <button
            onClick={() => onSelect("LASER")}
            className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#d4cec4] hover:border-[#8b7355] hover:bg-white/80 transition-all duration-300 flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 bg-[#efe9e1] rounded-full flex items-center justify-center group-hover:bg-[#8b7355]/10 transition-colors">
              <Zap className="w-10 h-10 text-[#8b7355] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-serif text-[#4a4540] mb-2 font-medium">
                Laser Q-Switch
              </h3>
              <p className="text-sm text-[#8b8580]">
                Usuwanie makijażu / tatuażu
              </p>
            </div>
          </button>
        </div>
        <div className="mt-12 text-center text-[#8b8580] text-sm flex gap-6 justify-center">
          <a
            href="/polityka-prywatnosci"
            className="hover:text-[#4a4540] transition-colors"
          >
            Polityka Prywatności
          </a>
          <span>|</span>
          <a
            href="/regulamin"
            className="hover:text-[#4a4540] transition-colors"
          >
            Regulamin
          </a>
        </div>
      </div>
    </div>
  );
}
