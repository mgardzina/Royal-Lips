export default function Footer() {
  return (
    <footer className="bg-[#4a4540] text-white py-8 border-t border-[#8b7355]/30">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
        {/* Lewa strona - Dane firmy */}
        <div className="text-center md:text-left space-y-2">
          <p className="font-serif text-lg tracking-wide">
            Royal Lips - Joanna Wielgos
          </p>
          <div className="text-sm text-white/80 space-y-1">
            <p>ul. Pużaka 37, 38-400 Krosno</p>
            <p>NIP: 6842237473 | REGON: 180685260</p>
            <p>
              <a
                href="tel:+48792377737"
                className="hover:text-white transition-colors"
              >
                +48 792 377 737
              </a>{" "}
              |{" "}
              <a
                href="mailto:kontakt@royallips.pl"
                className="hover:text-white transition-colors"
              >
                kontakt@royallips.pl
              </a>
            </p>
          </div>
          <p className="text-xs text-white/40 mt-4">
            &copy; {new Date().getFullYear()} Royal Lips. Wszelkie prawa
            zastrzeżone.
          </p>
        </div>

        {/* Prawa strona - Linki */}
        <div className="flex gap-6 text-sm text-white/80">
          <a
            href="/polityka-prywatnosci"
            className="hover:text-white transition-colors"
          >
            Polityka Prywatności
          </a>
          <span>|</span>
          <a href="/regulamin" className="hover:text-white transition-colors">
            Regulamin
          </a>
        </div>
      </div>
    </footer>
  );
}
