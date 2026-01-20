# 🚀 Deployment na Google Cloud Run

Ten dokument opisuje jak wdrożyć aplikację Royal Lips na Google Cloud Run.

## 📋 Wymagania wstępne

1. Konto Google Cloud Platform
2. Zainstalowane narzędzie `gcloud` CLI
3. Włączone API w projekcie GCP:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API

## 🛠️ Krok 1: Instalacja Google Cloud SDK

### MacOS
```bash
brew install --cask google-cloud-sdk
```

### Linux
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### Windows
Pobierz instalator z: https://cloud.google.com/sdk/docs/install

## 🔐 Krok 2: Logowanie i konfiguracja projektu

```bash
# Zaloguj się do Google Cloud
gcloud auth login

# Utwórz nowy projekt (lub użyj istniejącego)
gcloud projects create royal-lips-prod --name="Royal Lips"

# Ustaw projekt jako domyślny
gcloud config set project royal-lips-prod

# Włącz wymagane API
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Ustaw domyślny region (Warszawa)
gcloud config set run/region europe-central2
```

## 🔑 Krok 3: Konfiguracja zmiennych środowiskowych

Utwórz plik `.env.production` (lokalnie, NIE commituj go do git):

```env
# Resend API Key (do wysyłki emaili)
RESEND_API_KEY=re_twoj_klucz_resend

# Email właściciela (do powiadomień)
OWNER_EMAIL=twoj-email@example.com

# URL aplikacji (zostanie ustawiony po pierwszym deploy)
NEXT_PUBLIC_URL=https://royal-lips-HASH-ey.a.run.app

# SheetDB API
SHEETDB_API_URL=https://sheetdb.io/api/v1/gmhy5mfhbnppt
```

## 📦 Krok 4: Pierwszy deployment

### Deployment przez Cloud Build (ZALECANE)

```bash
# Deploy przez Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Po zakończeniu build, Cloud Build automatycznie wdroży aplikację
```

### Deployment manualny (alternatywa)

```bash
# Zbuduj obraz Docker lokalnie
docker build -t gcr.io/royal-lips-prod/royal-lips:latest .

# Wypchnij obraz do Container Registry
docker push gcr.io/royal-lips-prod/royal-lips:latest

# Deploy na Cloud Run
gcloud run deploy royal-lips \
  --image gcr.io/royal-lips-prod/royal-lips:latest \
  --platform managed \
  --region europe-central2 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 8080
```

## 🔧 Krok 5: Ustawienie zmiennych środowiskowych

Po pierwszym deployment, ustaw zmienne środowiskowe:

```bash
# Pobierz URL aplikacji
gcloud run services describe royal-lips --region europe-central2 --format 'value(status.url)'

# Ustaw zmienne środowiskowe
gcloud run services update royal-lips \
  --region europe-central2 \
  --update-env-vars \
RESEND_API_KEY=re_twoj_klucz_resend,\
OWNER_EMAIL=twoj-email@example.com,\
NEXT_PUBLIC_URL=https://royal-lips-HASH-ey.a.run.app,\
SHEETDB_API_URL=https://sheetdb.io/api/v1/gmhy5mfhbnppt
```

**WAŻNE:** Zamień wartości na swoje rzeczywiste dane!

## 🌐 Krok 6: Konfiguracja domeny własnej (opcjonalne)

### Mapowanie domeny

```bash
# Dodaj domenę do Cloud Run
gcloud run domain-mappings create \
  --service royal-lips \
  --domain twoja-domena.pl \
  --region europe-central2
```

Po wykonaniu komendy, Google pokaże Ci rekordy DNS, które musisz dodać w swoim dostawcy domeny.

### Weryfikacja domeny

1. Przejdź do Google Search Console: https://search.google.com/search-console
2. Dodaj swoją domenę
3. Zweryfikuj własność domeny

## 🔄 Aktualizacja aplikacji

### Przez Cloud Build (ZALECANE)

```bash
# Wystarczy wykonać:
gcloud builds submit --config cloudbuild.yaml
```

### Manualnie

```bash
# Zbuduj nową wersję
docker build -t gcr.io/royal-lips-prod/royal-lips:latest .

# Wypchnij do rejestru
docker push gcr.io/royal-lips-prod/royal-lips:latest

# Cloud Run automatycznie wykryje nowy obraz i wdroży go
```

## 📊 Monitorowanie i logi

### Sprawdzanie logów

```bash
# Wyświetl ostatnie logi
gcloud run services logs read royal-lips --region europe-central2

# Podgląd logów na żywo
gcloud run services logs tail royal-lips --region europe-central2
```

### Cloud Console

Możesz również przeglądać logi w przeglądarce:
1. Przejdź do: https://console.cloud.google.com/run
2. Kliknij na usługę `royal-lips`
3. Zakładka "LOGS"

## 💰 Zarządzanie kosztami

### Sprawdzenie kosztów

```bash
# Wyświetl metryki użycia
gcloud run services describe royal-lips --region europe-central2
```

### Limity Cloud Run (free tier)

- 2 miliony requestów/miesiąc
- 360,000 GB-sekund pamięci
- 180,000 vCPU-sekund

### Zmniejszenie kosztów

```bash
# Zmniejsz limity
gcloud run services update royal-lips \
  --region europe-central2 \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5
```

## 🔒 Bezpieczeństwo

### Aktualizacja sekretu

```bash
# Nigdy nie hardkoduj sekretów w kodzie!
# Zawsze używaj zmiennych środowiskowych

# Aktualizacja zmiennej
gcloud run services update royal-lips \
  --region europe-central2 \
  --update-env-vars RESEND_API_KEY=nowy_klucz
```

### Użycie Google Secret Manager (zalecane dla produkcji)

```bash
# Włącz Secret Manager API
gcloud services enable secretmanager.googleapis.com

# Utwórz sekret
echo -n "re_twoj_klucz" | gcloud secrets create resend-api-key --data-file=-

# Nadaj uprawnienia Cloud Run do odczytu sekretu
gcloud secrets add-iam-policy-binding resend-api-key \
  --member=serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# Zaktualizuj service, aby używał sekretu
gcloud run services update royal-lips \
  --region europe-central2 \
  --update-secrets RESEND_API_KEY=resend-api-key:latest
```

## 🐛 Troubleshooting

### Problem: Build timeout

Zwiększ timeout w `cloudbuild.yaml`:
```yaml
timeout: 3600s  # 60 minut
```

### Problem: Out of memory podczas build

Zwiększ rozmiar maszyny w `cloudbuild.yaml`:
```yaml
options:
  machineType: 'E2_HIGHCPU_8'
```

### Problem: Aplikacja nie startuje

```bash
# Sprawdź logi startowe
gcloud run services logs read royal-lips --region europe-central2 --limit 50

# Sprawdź czy port 8080 jest używany
# W Dockerfile już jest ustawiony: ENV PORT=8080
```

### Problem: 502 Bad Gateway

- Sprawdź czy aplikacja nasłuchuje na porcie 8080
- Sprawdź logi pod kątem błędów startowych
- Sprawdź czy wszystkie zmienne środowiskowe są ustawione

## 📝 Aktualizacja webhooka w SheetDB

Po deployment, zaktualizuj URL webhooka w SheetDB:

1. Przejdź do: https://sheetdb.io/dashboard/gmhy5mfhbnppt
2. Zakładka "Webhooks"
3. Edytuj istniejący webhook
4. Zmień URL na:
   ```
   https://royal-lips-HASH-ey.a.run.app/api/booking-webhook
   ```
   (lub twoja własna domena)

## 🚀 CI/CD - Automatyczne wdrożenie

### Konfiguracja Cloud Build Triggers

Możesz skonfigurować automatyczne wdrożenie przy każdym push do repozytorium:

```bash
# Połącz repozytorium GitHub/GitLab
gcloud builds triggers create github \
  --name="royal-lips-deploy" \
  --repo-name="royal-lips" \
  --repo-owner="twoj-github-username" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml"
```

## 📊 Monitoring i alerty

### Ustawienie alertów

1. Przejdź do: https://console.cloud.google.com/monitoring
2. Utwórz alert policy
3. Przykładowe metryki:
   - Request count > 1000/min
   - Error rate > 5%
   - Response time > 2s

## ✅ Checklist wdrożenia

- [ ] Zainstalowany Google Cloud SDK
- [ ] Utworzony projekt GCP
- [ ] Włączone wymagane API
- [ ] Zmienne środowiskowe skonfigurowane
- [ ] Pierwszy deploy wykonany
- [ ] URL aplikacji zapisany
- [ ] Webhook w SheetDB zaktualizowany
- [ ] Domena skonfigurowana (jeśli używana)
- [ ] Testowa rezerwacja przeprowadzona
- [ ] Monitoring skonfigurowany

## 🆘 Pomoc

- Dokumentacja Cloud Run: https://cloud.google.com/run/docs
- Dokumentacja Next.js deployment: https://nextjs.org/docs/deployment
- Support GCP: https://cloud.google.com/support

## 💡 Porównanie z Vercel

| Feature | Google Cloud Run | Vercel |
|---------|------------------|--------|
| Cena (free tier) | 2M requestów | 100GB bandwidth |
| Region | Warszawa dostępna | Limited regions |
| Control | Pełna kontrola | Ograniczona |
| Scaling | 0-1000 instances | Automatyczny |
| Build time | ~5-10 min | ~2-5 min |

**Kiedy wybrać Cloud Run?**
- Potrzebujesz serwera w Polsce/EU
- Chcesz większej kontroli
- Masz inne usługi w GCP

**Kiedy wybrać Vercel?**
- Szybki deployment
- Brak konfiguracji
- Mniejszy ruch
