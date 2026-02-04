import { Syringe, PenTool, Zap, Sparkles, Heart } from "lucide-react";
import { FormType } from "@/types/booking";

const LipsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 511.999 511.999" fill="currentColor" className={className}>
    <path d="M420.792,140.277c-22.891-24.035-53.77-37.81-86.947-38.787c-28.264-0.833-55.419,7.711-77.845,24.265c-22.425-16.555-49.587-25.091-77.844-24.265c-33.177,0.977-64.056,14.752-86.947,38.787L0,236.046l14.127,27.312c24.1,46.595,60.127,84.768,104.187,110.397c41.398,24.08,89.009,36.809,137.685,36.809c48.673,0,96.289-12.73,137.685-36.809c44.06-25.629,80.087-63.803,104.187-110.397l14.127-27.312L420.792,140.277z M115.053,162.986c16.868-17.712,39.622-27.863,64.072-28.583c24.462-0.717,47.761,8.075,65.641,24.764l11.234,10.484l11.234-10.484c17.881-16.689,41.193-25.482,65.641-24.764c24.448,0.72,47.203,10.871,64.072,28.583l56.18,58.988h-65.413c-29.757,0-43.653-5.558-59.742-11.994c-16.814-6.725-35.872-14.349-71.971-14.349c-36.099,0-55.157,7.623-71.971,14.349c-16.09,6.435-29.984,11.994-59.742,11.994H58.873L115.053,162.986z M334.301,247.404c-17.641,13.328-40.295,27.255-78.3,27.255c-38.005,0-60.659-13.926-78.3-27.255c6.837-2.163,12.829-4.558,18.558-6.85c16.09-6.435,29.984-11.994,59.742-11.994c29.757,0,43.653,5.558,59.742,11.994C321.472,242.845,327.464,245.241,334.301,247.404z M377.128,345.292c-36.377,21.16-78.263,32.343-121.129,32.343s-84.752-11.185-121.129-32.344c-36.521-21.243-66.783-52.398-87.909-90.39h82.813c4.004,0,12.198,6.418,20.121,12.625c20.366,15.953,51.144,40.06,106.104,40.06s85.737-24.108,106.104-40.06c7.924-6.207,16.117-12.625,20.121-12.625h82.813C443.912,292.895,413.65,324.048,377.128,345.292z" />
  </svg>
);

const SyringeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 490.588 490.588" fill="currentColor" className={className}>
    <g>
      <path
        d="M263.641,66.98c-4.267-4.053-10.987-3.947-15.04,0.213c-3.947,4.16-3.947,10.667,0,14.827l23.36,23.36L59.694,317.754
				c-8.96,8.96-6.08,18.667-3.947,25.707c0.427,1.28,0.853,2.667,1.173,4.267l14.72,56.213L3.268,472.314
				c-4.267,4.053-4.373,10.88-0.213,15.04c4.16,4.16,10.88,4.373,15.04,0.213c0.107-0.107,0.213-0.213,0.213-0.213l68.053-67.947
				l56.96,14.72c1.6,0.32,3.2,0.853,4.587,1.173c3.52,1.173,7.147,1.813,10.88,1.92c5.333,0.107,10.453-2.133,14.187-5.973
				l212.267-212.373l23.253,23.253c4.267,4.053,10.987,3.947,15.04-0.213c3.947-4.16,3.947-10.667,0-14.827L263.641,66.98z
				 M158.681,415.887c-0.427-0.107-3.2-0.64-4.907-1.173c-1.707-0.533-3.733-1.067-5.44-1.387l-54.187-13.973
				c-0.32-0.64-0.64-1.173-1.067-1.707c-0.32-0.32-0.747-0.533-1.173-0.747l-14.4-54.4c-0.427-1.813-0.96-3.413-1.387-4.907
				c-0.533-1.92-1.28-4.48-1.387-4.693l20.267-20.373l36.267,36.267c4.267,4.053,10.987,3.947,15.04-0.213
				c3.947-4.16,3.947-10.667,0-14.827l-36.267-36.267l29.013-29.12c0.32,2.133,1.28,4.16,2.773,5.76l21.333,21.333
				c4.267,4.053,10.987,3.947,15.04-0.213c3.947-4.16,3.947-10.667,0-14.827l-21.333-21.333c-1.6-1.493-3.52-2.453-5.76-2.773
				l30.507-30.507c0.32,2.133,1.28,4.16,2.773,5.76l32,32c4.267,4.053,10.987,3.947,15.04-0.213c3.947-4.16,3.947-10.667,0-14.827
				l-32-32c-1.6-1.493-3.627-2.453-5.76-2.773l23.68-23.787l20.267,20.267c4.267,4.053,10.987,3.947,15.04-0.213
				c3.947-4.16,3.947-10.667,0-14.827l-20.267-20.267l22.293-22.293l25.6,25.6c4.267,4.053,10.987,3.947,15.04-0.213
				c3.947-4.16,3.947-10.667,0-14.827l-25.6-25.6l16.96-16.96l83.2,83.2L158.681,415.887z"
      />
      <path
        d="M487.641,109.647L380.975,2.98c-4.267-4.053-10.987-3.947-15.04,0.213c-3.947,4.16-3.947,10.667,0,14.827l24.427,24.533
				L333.934,98.98c-4.267,4.053-4.373,10.88-0.213,15.04c4.053,4.267,10.88,4.373,15.04,0.213c0.107-0.107,0.213-0.213,0.213-0.213
				l56.427-56.427l27.627,27.627l-56.427,56.427c-4.267,4.053-4.373,10.88-0.213,15.04c4.053,4.267,10.88,4.373,15.04,0.213
				c0.107-0.107,0.213-0.213,0.213-0.213l56.427-56.427l24.427,24.427c4.267,4.053,10.987,3.947,15.04-0.213
				C491.588,120.314,491.588,113.807,487.641,109.647z"
      />
    </g>
  </svg>
);

interface SelectionScreenProps {
  onSelect: (type: FormType) => void;
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kwas Hialuronowy */}
          <button
            onClick={() => onSelect("FACIAL_VOLUMETRY")}
            className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#d4cec4] hover:border-[#8b7355] hover:bg-white/80 transition-all duration-300 flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 bg-[#efe9e1] rounded-full flex items-center justify-center group-hover:bg-[#8b7355]/10 transition-colors">
              <SyringeIcon className="w-10 h-10 text-[#8b7355] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-serif text-[#4a4540] mb-2 font-medium">
                Wolumetria Twarzy
              </h3>
              <p className="text-sm text-[#8b8580]">Modelowanie twarzy</p>
            </div>
          </button>

          {/* Modelowanie Ust */}
          <button
            onClick={() => onSelect("LIP_AUGMENTATION")}
            className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#d4cec4] hover:border-[#8b7355] hover:bg-white/80 transition-all duration-300 flex flex-col items-center gap-6 lg:col-start-2"
          >
            <div className="w-20 h-20 bg-[#efe9e1] rounded-full flex items-center justify-center group-hover:bg-[#8b7355]/10 transition-colors">
              <LipsIcon className="w-12 h-12 text-[#8b7355] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-serif text-[#4a4540] mb-2 font-medium">
                Modelowanie / Powiększanie Ust
              </h3>
              <p className="text-sm text-[#8b8580]">Kwas hialuronowy</p>
            </div>
          </button>
          {/* Niwelowanie Zmarszczek */}
          <button
            onClick={() => onSelect("WRINKLE_REDUCTION")}
            className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#d4cec4] hover:border-[#8b7355] hover:bg-white/80 transition-all duration-300 flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 bg-[#efe9e1] rounded-full flex items-center justify-center group-hover:bg-[#8b7355]/10 transition-colors">
              <Sparkles className="w-10 h-10 text-[#8b7355] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-serif text-[#4a4540] mb-2 font-medium">
                Niwelowanie Zmarszczek
              </h3>
              <p className="text-sm text-[#8b8580]">Botoks / Kwas</p>
            </div>
          </button>

          {/* Depilacja Laserowa */}
          <button
            onClick={() => onSelect("LASER_HAIR_REMOVAL")}
            className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#d4cec4] hover:border-[#8b7355] hover:bg-white/80 transition-all duration-300 flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 bg-[#efe9e1] rounded-full flex items-center justify-center group-hover:bg-[#8b7355]/10 transition-colors">
              <Zap className="w-10 h-10 text-[#8b7355] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-serif text-[#4a4540] mb-2 font-medium">
                Depilacja Laserowa
              </h3>
              <p className="text-sm text-[#8b8580]">Laser diodowy</p>
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
