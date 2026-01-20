# Royal Lips - System Rezerwacji Online

Profesjonalny system rezerwacji dla studia makijażu permanentnego Royal Lips, prowadzonego przez Joannę Wielgos.

## 🌟 Funkcje

### System Rezerwacji
- **Interaktywny kalendarz** - Booksy-style z widokiem dziennym i mini kalendarzem
- **Zarządzanie dostępnością** - Automatyczne wykrywanie zajętych terminów
- **Walidacja formularzy** - Weryfikacja danych z komunikatami błędów
- **Wieloetapowy formularz** - 4 kroki: dane osobowe, wybór terminu, wywiad zdrowotny, potwierdzenie

### Automatyzacja
- **Webhook Google Sheets** - Automatyczne powiadomienia przy zmianie statusu na "Potwierdzona"
- **Integracja email** - Wysyłka potwierdzenia do klienta i powiadomienia do właścicielki
- **Synchronizacja z SheetDB** - Przechowywanie rezerwacji w Google Sheets

### Interfejs
- **Responsywny design** - Dostosowany do mobile, tablet i desktop
- **Elegancka kolorystyka** - Beże, taupe i ciepłe akcenty
- **Animacje i przejścia** - Płynne interakcje użytkownika
- **Dostępność** - Semantyczny HTML i nawigacja klawiaturą

## 🛠️ Technologie

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Hosting**: Google Cloud Run
- **CI/CD**: Google Cloud Build
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **TypeScript**: Pełne typowanie

## 📦 Instalacja

```bash
# Klonowanie repozytorium
git clone git@github.com:mgardzina/Royal-Lips.git
cd Royal-Lips

# Instalacja zależności
npm install

# Konfiguracja zmiennych środowiskowych
cp .env.example .env
# Uzupełnij .env swoimi kluczami API

# Uruchomienie serwera deweloperskiego
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## 🔑 Zmienne Środowiskowe

Utwórz plik `.env` w głównym katalogu:

```env
SUPABASE_PASS="your_password"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
RESEND_API_KEY="your_resend_key"
OWNER_EMAIL="your@email.com"
NEXT_PUBLIC_SHEETDB_URL="https://sheetdb.io/api/v1/your_sheet"
NEXT_PUBLIC_URL="https://your-domain.com"
```

## 🚀 Deploy na Google Cloud Run

```bash
# Build i deploy przez Cloud Build
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=COMMIT_SHA=$(git rev-parse HEAD)

# Lub ręczny deploy
docker build -t gcr.io/PROJECT_ID/royal-lips .
docker push gcr.io/PROJECT_ID/royal-lips
gcloud run deploy royal-lips \
  --image gcr.io/PROJECT_ID/royal-lips \
  --region europe-west1 \
  --platform managed
```

## 📁 Struktura Projektu

```
royal-lips/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── booking-webhook/  # Webhook dla Google Sheets
│   │   ├── get-bookings/     # Pobieranie rezerwacji
│   │   ├── send-confirmation/# Wysyłka potwierdzenia
│   │   └── send-email/       # Ogólna wysyłka emaili
│   ├── rezerwacja/           # Strona rezerwacji
│   ├── o-nas/                # O nas
│   ├── uslugi/               # Usługi
│   ├── realizacje/           # Portfolio
│   ├── kontakt/              # Kontakt
│   └── layout.tsx            # Root layout
├── components/               # Komponenty React
│   ├── CalendarPicker.tsx    # Interaktywny kalendarz
│   ├── FormButton.tsx        # Przyciski formularzy
│   └── FormInput.tsx         # Pola formularzy
├── lib/                      # Utilities
├── public/                   # Statyczne pliki
├── supabase/                 # Schemat bazy danych
├── types/                    # TypeScript types
├── Dockerfile                # Docker container
├── cloudbuild.yaml           # Google Cloud Build config
└── tailwind.config.ts        # Tailwind configuration
```

## 🎨 Kolorystyka

```css
--primary-beige: #C4B5A0;
--primary-taupe: #A89885;
--bg-light: #E8E3DC;
--bg-main: #D4CEC4;
--text-dark: #4A4540;
--text-light: #FFFFFF;
--accent-warm: #B8A894;
```

## 📱 Responsywność

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔒 Bezpieczeństwo

- Walidacja wszystkich danych wejściowych
- Sanityzacja emaili i inputów użytkownika
- Environment variables dla kluczy API
- HTTPS wymuszony na produkcji
- CORS skonfigurowany dla API

## 📧 Email Templates

System używa HTML email templates z:
- Responsywnym designem
- Inline CSS dla kompatybilności
- Personalizacją (imię, data, usługa)
- Co-branding (Royal Lips)

## 🐛 Debug

```bash
# Logi lokalne
npm run dev

# Logi Cloud Run
gcloud run logs read royal-lips --region europe-west1

# Testy
npm run build  # Sprawdza błędy TypeScript i builduje
```

## 📄 Licencja

MIT License - zobacz plik [LICENSE](LICENSE)

## 👤 Autor

**Mateusz Gardzina**

## 🙏 Podziękowania

- Joanna Wielgos - Właścicielka Royal Lips
- Claude Sonnet 4.5 - Wsparcie rozwoju

---

**Royal Lips** © 2026 - Profesjonalny makijaż permanentny
