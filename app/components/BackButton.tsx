import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

export default function BackButton({
  onClick,
  className = "",
  label = "Powrót",
}: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-2 bg-[#C4B5A0]/20 hover:bg-[#C4B5A0] border border-[#C4B5A0] text-[#4a4540] hover:text-white px-6 py-2.5 rounded-xl transition-all duration-300 font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#4a4540]/5 hover:shadow-[#C4B5A0]/20 ${className}`}
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      {label}
    </button>
  );
}
