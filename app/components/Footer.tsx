import { SALON_CONFIG } from "@/app/config/salon";
import { Instagram, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#4a4540] text-white border-t border-[#8b7355]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl tracking-widest text-[#C4B5A0]">
              {SALON_CONFIG.name.toUpperCase()}
            </h2>
            <p className="text-[#d4cec4] text-sm leading-relaxed max-w-xs">
              Profesjonalne zabiegi medycyny estetycznej i kosmetologii w
              Krośnie. Twoje piękno w rękach ekspertów.
            </p>
            <div className="flex gap-4">
              <a
                href={SALON_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#C4B5A0]/10 flex items-center justify-center text-[#C4B5A0] hover:bg-[#C4B5A0] hover:text-[#4a4540] transition-all duration-300 group ring-1 ring-[#C4B5A0]/20"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg tracking-wider text-[#e8e0d5] border-b border-[#8b7355]/30 pb-2 inline-block">
              KONTAKT
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${SALON_CONFIG.phone.replace(/\s/g, "")}`}
                  className="flex items-start gap-3 group"
                >
                  <Phone className="w-5 h-5 text-[#C4B5A0] mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-[#d4cec4] group-hover:text-[#C4B5A0] transition-colors">
                    +48 {SALON_CONFIG.phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SALON_CONFIG.email}`}
                  className="flex items-start gap-3 group"
                >
                  <Mail className="w-5 h-5 text-[#C4B5A0] mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-[#d4cec4] group-hover:text-[#C4B5A0] transition-colors">
                    {SALON_CONFIG.email}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Address Column */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg tracking-wider text-[#e8e0d5] border-b border-[#8b7355]/30 pb-2 inline-block">
              ADRES
            </h3>
            <div className="flex items-start gap-3 text-[#d4cec4]">
              <MapPin className="w-5 h-5 text-[#C4B5A0] mt-0.5 shrink-0" />
              <address className="not-italic leading-relaxed">
                {SALON_CONFIG.fullName}
                <br />
                {SALON_CONFIG.address}
                <br />
                {SALON_CONFIG.zipCode} {SALON_CONFIG.city}
              </address>
            </div>
          </div>

          {/* Links Column */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg tracking-wider text-[#e8e0d5] border-b border-[#8b7355]/30 pb-2 inline-block">
              INFORMACJE
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/polityka-prywatnosci"
                  className="text-[#d4cec4] hover:text-[#C4B5A0] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-[#C4B5A0] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Polityka Prywatności
                </a>
              </li>
              <li>
                <a
                  href="/regulamin"
                  className="text-[#d4cec4] hover:text-[#C4B5A0] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-[#C4B5A0] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Regulamin
                </a>
              </li>
            </ul>
            <div className="pt-4 text-xs text-[#d4cec4]/60 space-y-1">
              <p>NIP: {SALON_CONFIG.nip}</p>
              <p>REGON: {SALON_CONFIG.regon}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-[#d4cec4]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#d4cec4]/40">
          <p>
            &copy; {currentYear} {SALON_CONFIG.fullName}. Wszelkie prawa
            zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
