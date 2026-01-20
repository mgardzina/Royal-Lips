# 🎯 System Rezerwacji - Royal Lips

## Jak działa system?

### 📅 Kalendarz z blokowaniem zajętych terminów

1. **Klient wchodzi na stronę rezerwacji**
   - Widzi kalendarz z dostępnymi terminami
   - System automatycznie pobiera zajęte terminy z Google Sheets

2. **Zajęte godziny są oznaczone**
   - Czerwona obwódka wokół godziny
   - Tekst "Zajęte"
   - Niemożliwe do kliknięcia

3. **Wolne godziny**
   - Normalne wyświetlanie
   - Można je zarezerwować

---

## ✉️ System potwierdzania wizyt

### Workflow:

```
📝 Nowa rezerwacja
   ↓ (zapisuje do Google Sheets)
   ↓ Status: "Oczekiwanie na potwierdzenie"
   ↓
🔒 Termin NATYCHMIAST zablokowany w kalendarzu (czerwona obwódka)
   ↓
👀 Ty sprawdzasz rezerwację
   ↓
✅ Zmieniasz status na "Potwierdzona"
   ↓
🔄 Webhook automatycznie wykrywa zmianę
   ↓
📧 System wysyła email potwierdzający do klienta
   ↓
🔒 Termin pozostaje zablokowany
```

---

## 🎨 Statusy rezerwacji

| Status | Email do klienta | Blokuje termin | Kiedy używać |
|--------|------------------|----------------|--------------|
| **Oczekiwanie na potwierdzenie** | ❌ Nie | ✅ TAK | Nowa rezerwacja (czeka na Twoją akcję) |
| **Potwierdzona** | ✅ TAK (automatycznie) | ✅ TAK | Potwierdzasz wizytę |
| **Anulowana** | ❌ Nie | ❌ NIE | Klient odwołał (odblokuje termin) |
| **Zakończona** | ❌ Nie | ✅ TAK | Wizyta się odbyła |

---

## 🚀 Uruchomienie

### 1. Instalacja
```bash
npm install
```

### 2. Konfiguracja zmiennych środowiskowych
Upewnij się, że masz w `.env`:
```env
RESEND_API_KEY=twoj_klucz_resend
OWNER_EMAIL=twoj-email@example.com
NEXT_PUBLIC_SHEETDB_URL=https://sheetdb.io/api/v1/gmhy5mfhbnppt
NEXT_PUBLIC_URL=http://localhost:3000
```

### 3. Uruchom serwer deweloperski
```bash
npm run dev
```

Otwórz: http://localhost:3000/rezerwacja

---

## 🔧 Konfiguracja Webhooka w SheetDB

**Szczegółowa instrukcja:** Zobacz [KONFIGURACJA_WEBHOOK.md](./KONFIGURACJA_WEBHOOK.md)

**Szybki start:**
1. Wejdź na https://sheetdb.io/
2. Znajdź swój arkusz
3. Dodaj Webhook:
   - URL: `https://twoja-domena.vercel.app/api/booking-webhook`
   - Trigger: "On Update"
   - Filter: Status = "Potwierdzona"

---

## 📂 Struktura API

### Endpointy:

#### `GET /api/get-bookings`
Pobiera wszystkie **potwierdzone** rezerwacje z Google Sheets.
- Zwraca: Lista zajętych terminów (data + godzina)
- Używane przez: Kalendarz rezerwacji

#### `POST /api/send-confirmation`
Wysyła email potwierdzający wizytę do klienta.
- Parametry: firstName, lastName, email, serviceName, preferredDate, preferredTime
- Używane przez: Webhook

#### `POST /api/booking-webhook`
Webhook wywoływany przez SheetDB przy zmianie statusu.
- Automatycznie: Wysyła email gdy status zmieni się na "Potwierdzona"
- Test: `GET /api/booking-webhook` zwraca status endpoint

#### `POST /api/send-email`
Wysyła powiadomienie o nowej rezerwacji (dla Ciebie i klienta).
- Używane przez: Formularz rezerwacji

---

## 🎨 Komponenty

### `CalendarPicker`
- Lokalizacja: `components/CalendarPicker.tsx`
- Funkcje:
  - Wyświetla kalendarz z dostępnymi dniami
  - Blokuje niedziele
  - Pokazuje dostępne godziny
  - **Blokuje zajęte godziny** (czerwona obwódka)
  - Różne godziny dla sobót (9:00-14:00)

### Strona rezerwacji
- Lokalizacja: `app/rezerwacja/page.tsx`
- 4 kroki:
  1. Dane personalne
  2. Wybór usługi i terminu
  3. Wywiad zdrowotny
  4. Zgody i potwierdzenie

---

## 🧪 Testowanie

### Test 1: Nowa rezerwacja
1. Wypełnij formularz na `/rezerwacja`
2. Sprawdź Google Sheets - powinna pojawić się z statusem "Oczekiwanie na potwierdzenie"
3. Sprawdź czy otrzymałaś email z powiadomieniem

### Test 2: Potwierdzenie wizyty
1. Zmień status na "Potwierdzona" w Google Sheets
2. Sprawdź czy klient otrzymał email potwierdzający
3. Odśwież stronę `/rezerwacja`
4. Ten termin powinien być teraz zablokowany (czerwona obwódka)

### Test 3: Blokowanie terminów
1. Wejdź na `/rezerwacja`
2. Wybierz datę z potwierdzoną rezerwacją
3. Zajęte godziny powinny mieć czerwoną obwódkę i napis "Zajęte"

---

## 📧 Dostosowanie emaili

### Email potwierdzający (do klienta)
Edytuj: `app/api/send-confirmation/route.ts`

Znajdź `confirmationEmailHtml` i zmień:
- Adres gabinetu
- Numer telefonu
- Email kontaktowy
- Instrukcje przed wizytą

### Email z nową rezerwacją (do Ciebie)
Edytuj: `app/api/send-email/route.ts`

Znajdź `ownerEmailHtml` i dostosuj treść.

---

## 🔒 Bezpieczeństwo

- Wszystkie API endpointy są zabezpieczone walidacją
- Dane przechowywane w Google Sheets przez SheetDB
- Emaile wysyłane przez Resend (zweryfikowany dostawca)
- Webhookie mogą być dodatkowo zabezpieczone tokenem (opcjonalnie)

---

## 🐛 Debugging

### Logi w konsoli przeglądarki
Otwórz DevTools (F12) → Console
Szukaj komunikatów:
- "Błąd pobierania zajętych terminów"
- "Ładowanie dostępnych terminów..."

### Logi w Vercel (produkcja)
1. Wejdź na vercel.com/dashboard
2. Wybierz projekt
3. Kliknij "Logs" → "Runtime Logs"
4. Szukaj błędów w `/api/*` endpoints

### Test webhook lokalnie
```bash
curl -X POST http://localhost:3000/api/booking-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "Status": "Potwierdzona",
    "Email": "test@example.com",
    "Imię": "Test",
    "Data wizyty": "2024-02-20",
    "Godzina": "10:00"
  }'
```

---

## 📦 Zależności

- **Next.js 16** - Framework React
- **Resend** - Wysyłka emaili
- **SheetDB** - Integracja z Google Sheets
- **Tailwind CSS** - Stylowanie
- **Lucide React** - Ikony
- **date-fns** - Operacje na datach

---

## 🚀 Deploy na Vercel

1. Push kodu do GitHub
2. Import projektu w Vercel
3. Dodaj zmienne środowiskowe:
   - `RESEND_API_KEY`
   - `OWNER_EMAIL`
   - `NEXT_PUBLIC_SHEETDB_URL`
   - `NEXT_PUBLIC_URL` (URL twojej aplikacji na Vercel)
4. Deploy!
5. Skonfiguruj webhook w SheetDB z URL produkcyjnym

---

## ✅ Checklist przed wdrożeniem

- [ ] Wszystkie zmienne środowiskowe ustawione
- [ ] Email OWNER_EMAIL poprawny
- [ ] RESEND_API_KEY działa
- [ ] Webhook skonfigurowany w SheetDB
- [ ] Przetestowane: nowa rezerwacja → Google Sheets
- [ ] Przetestowane: potwierdzenie → email do klienta
- [ ] Przetestowane: blokowanie zajętych terminów
- [ ] Dostosowane emaile (adres, telefon)
- [ ] Sprawdzone na urządzeniach mobilnych

---

**Pytania?** Sprawdź szczegółową dokumentację w [KONFIGURACJA_WEBHOOK.md](./KONFIGURACJA_WEBHOOK.md)
