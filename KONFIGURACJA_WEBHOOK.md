# 📋 Konfiguracja systemu potwierdzania wizyt

## Jak to działa?

### 1️⃣ Nowa rezerwacja
- Klient wypełnia formularz rezerwacji
- System zapisuje do Google Sheets ze statusem **"Oczekiwanie na potwierdzenie"**
- Kalendarz **BLOKUJE** ten termin od razu ✅ (czerwona obwódka)
- Ty otrzymujesz email z powiadomieniem o nowej rezerwacji

### 2️⃣ Potwierdzenie wizyty
- Otwierasz Google Sheets i znajdujesz rezerwację
- Zmieniasz status z "Oczekiwanie na potwierdzenie" na **"Potwierdzona"**
- System **automatycznie** wysyła email potwierdzający do klienta ✅
- Termin **pozostaje zablokowany** (czerwona obwódka)

### 3️⃣ Anulowanie wizyty
- Zmieniasz status na **"Anulowana"**
- Termin zostaje **odblokowany** w kalendarzu (ktoś inny może go zarezerwować)

---

## 🔧 Konfiguracja w SheetDB

### Krok 1: Zaloguj się do SheetDB
Przejdź do: https://sheetdb.io/
Zaloguj się na swoje konto

### Krok 2: Znajdź swój arkusz
Twój arkusz ID: `gmhy5mfhbnppt`
URL do zarządzania: https://sheetdb.io/dashboard/gmhy5mfhbnppt

### Krok 3: Skonfiguruj Webhook
1. W panelu SheetDB kliknij na swój arkusz
2. Przejdź do zakładki **"Webhooks"**
3. Kliknij **"Add Webhook"**

### Krok 4: Ustawienia Webhooka
Wprowadź następujące dane:

**Webhook URL:**
```
https://twoja-domena.vercel.app/api/booking-webhook
```
(zamień `twoja-domena.vercel.app` na swoją rzeczywistą domenę)

**Trigger Event:**
- Wybierz: **"On Update"** (przy aktualizacji wiersza)

**Optional Filters (opcjonalne):**
- Column: `Status`
- Condition: `equals`
- Value: `Potwierdzona`

To sprawi, że webhook będzie wywoływany tylko gdy status zmieni się na "Potwierdzona"

### Krok 5: Zapisz webhook
Kliknij **"Save"** lub **"Create Webhook"**

---

## 📊 Statusy w Google Sheets

### Dopuszczalne wartości w kolumnie "Status":

| Status | Co się dzieje | Blokuje termin? |
|--------|---------------|-----------------|
| **Oczekiwanie na potwierdzenie** | Nowa rezerwacja, czeka na akcję | ✅ TAK |
| **Potwierdzona** | Wysyła email do klienta, blokuje termin | ✅ TAK |
| **Anulowana** | Odblokuje termin w kalendarzu | ❌ NIE |
| **Zakończona** | Wizyta się odbyła | ✅ TAK |

**WAŻNE:** Wielkość liter nie ma znaczenia - "Potwierdzona", "potwierdzona", "POTWIERDZONA" działają tak samo.

---

## 🧪 Testowanie systemu

### Test 1: Sprawdź webhook endpoint
Otwórz w przeglądarce:
```
https://twoja-domena.vercel.app/api/booking-webhook
```

Powinieneś zobaczyć:
```json
{
  "message": "Webhook endpoint działa",
  "url": "/api/booking-webhook"
}
```

### Test 2: Ręczne testowanie (opcjonalne)
Możesz przetestować webhook ręcznie używając curl lub Postman:

```bash
curl -X POST https://twoja-domena.vercel.app/api/booking-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "Status": "Potwierdzona",
    "Email": "test@example.com",
    "Imię": "Jan",
    "Nazwisko": "Kowalski",
    "Usługa": "Pigmentacja brwi",
    "Data wizyty": "2024-02-20",
    "Godzina": "10:00"
  }'
```

### Test 3: Prawdziwy test
1. Wypełnij formularz rezerwacji na stronie
2. Sprawdź czy pojawił się w Google Sheets ze statusem "Oczekiwanie na potwierdzenie"
3. Zmień status na "Potwierdzona"
4. Sprawdź czy klient otrzymał email potwierdzający
5. Odśwież stronę rezerwacji i sprawdź czy termin jest zablokowany (czerwona obwódka)

---

## 🔐 Zmienne środowiskowe

Upewnij się, że masz skonfigurowane w Vercel:

```env
RESEND_API_KEY=re_xxxxxxxxx
OWNER_EMAIL=twoj-email@example.com
NEXT_PUBLIC_URL=https://twoja-domena.vercel.app
```

**NEXT_PUBLIC_URL** jest potrzebny, aby webhook mógł wywołać endpoint wysyłki emaili.

---

## ⚠️ Troubleshooting

### Email nie został wysłany po zmianie statusu?

**1. Sprawdź logi w Vercel:**
- Przejdź do: https://vercel.com/dashboard
- Wybierz swój projekt
- Kliknij "Logs" / "Runtime Logs"
- Szukaj błędów związanych z `/api/booking-webhook`

**2. Sprawdź czy webhook jest skonfigurowany:**
- Zaloguj się do SheetDB
- Sprawdź czy webhook jest aktywny
- Sprawdź URL webhooka

**3. Sprawdź format daty w Google Sheets:**
- Data powinna być w formacie: `YYYY-MM-DD` (np. `2024-02-20`)
- Nie używaj formatów: `20/02/2024` lub `20.02.2024`

**4. Sprawdź kolumnę Email:**
- Upewnij się, że klient ma poprawny adres email w arkuszu

### Termin nie blokuje się w kalendarzu?

**1. Sprawdź status w Google Sheets:**
- Status MUSI być dokładnie: `Potwierdzona` (lub `confirmed`)
- Wielkość liter nie ma znaczenia

**2. Sprawdź format daty i godziny:**
- Data: `YYYY-MM-DD`
- Godzina: `HH:MM` (np. `10:00`, nie `10:00:00`)

**3. Odśwież stronę rezerwacji:**
- Dane z Google Sheets ładują się przy otwarciu strony
- Ctrl+F5 (Windows) lub Cmd+Shift+R (Mac) wymusza pełne odświeżenie

---

## 📧 Dostosowanie emaili

Chcesz zmienić treść emaila potwierdzającego?

Edytuj plik: `app/api/send-confirmation/route.ts`

Znajdź sekcję `confirmationEmailHtml` i dostosuj:
- Treść wiadomości
- Adres gabinetu
- Instrukcje przed wizytą
- Dane kontaktowe

---

## ✅ Checklist uruchomienia

- [ ] Webhook skonfigurowany w SheetDB
- [ ] URL webhooka prowadzi do twojej domeny
- [ ] Zmienne środowiskowe ustawione w Vercel
- [ ] Test endpoint działa (GET /api/booking-webhook)
- [ ] Przeprowadzony test z prawdziwą rezerwacją
- [ ] Email potwierdzający wysłany poprawnie
- [ ] Termin blokuje się w kalendarzu
- [ ] Dostosowana treść emaili (adres, telefon, itp.)

---

## 🎯 Podsumowanie workflow

```
1. Klient → Wypełnia formularz
   ↓
2. System → Zapisuje do Google Sheets (Status: "Oczekiwanie na potwierdzenie")
   ↓
3. Ty → Otwierasz arkusz, sprawdzasz rezerwację
   ↓
4. Ty → Zmieniasz status na "Potwierdzona"
   ↓
5. Webhook → Wykrywa zmianę statusu
   ↓
6. System → Wysyła email potwierdzający do klienta
   ↓
7. Kalendarz → Blokuje termin (czerwona obwódka)
   ↓
8. ✅ Gotowe!
```

---

Masz pytania? Sprawdź logi w konsoli przeglądarki lub w Vercel Dashboard!
