export default function Footer() {
  return (
    <footer className="py-8 text-center text-[#8b8580] text-sm bg-[#f8f6f3]/50 backdrop-blur-sm border-t border-[#d4cec4]/30">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <p className="font-serif text-[#4a4540] text-lg">
            Royal Lips - Joanna Wielgos
          </p>
          <p>ul. Pużaka 37, 38-400 Krosno</p>
          <p>NIP: 6842237473 | REGON: 180685260</p>
          <p>
            <a
              href="tel:+48792377737"
              className="hover:text-[#4a4540] transition-colors"
            >
              +48 792 377 737
            </a>{" "}
            |{" "}
            <a
              href="mailto:kontakt@royallips.pl"
              className="hover:text-[#4a4540] transition-colors"
            >
              kontakt@royallips.pl
            </a>
          </p>
        </div>
        <div className="flex gap-6 justify-center mt-2">
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
        <p className="text-xs text-[#8b8580]/60 mt-2">
          &copy; {new Date().getFullYear()} Royal Lips. Wszelkie prawa
          zastrzeżone.
        </p>
      </div>
    </footer>
  );
}
