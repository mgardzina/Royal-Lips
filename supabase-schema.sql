-- ================================================
-- SCHEMA BAZY DANYCH DLA BEAUTY BOOKING APP
-- ================================================
-- Wykonaj ten kod w Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ================================================
-- 1. Tworzenie tabeli bookings (rezerwacje)
-- ================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    -- Dane personalne
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    -- Szczegóły usługi (bez CHECK constraint - akceptuje wszystkie ID usług)
    service_type TEXT NOT NULL,
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    -- Wywiad zdrowotny
    has_allergies BOOLEAN DEFAULT false,
    allergies_details TEXT,
    is_pregnant BOOLEAN DEFAULT false,
    has_skin_conditions BOOLEAN DEFAULT false,
    skin_conditions_details TEXT,
    taking_medication BOOLEAN DEFAULT false,
    medication_details TEXT,
    -- RODO
    consent_personal_data BOOLEAN NOT NULL DEFAULT false,
    consent_marketing BOOLEAN DEFAULT false,
    -- Dodatkowe
    additional_notes TEXT,
    -- Status rezerwacji
    status TEXT DEFAULT 'pending' CHECK (
        status IN ('pending', 'confirmed', 'completed', 'cancelled')
    ),
    -- Notatki wewnętrzne (tylko dla admina)
    admin_notes TEXT
);
-- 2. Funkcja automatycznego update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = TIMEZONE('utc'::text, NOW());
RETURN NEW;
END;
$$ language 'plpgsql';
-- 3. Trigger dla automatycznego update timestamp
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE
UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- 4. Włączenie Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- 5. Polityki RLS
-- Polityka: Wszyscy mogą wstawiać dane (formularz publiczny)
DROP POLICY IF EXISTS "Enable insert for all users" ON bookings;
CREATE POLICY "Enable insert for all users" ON bookings FOR
INSERT WITH CHECK (true);
-- Polityka: Tylko zalogowani użytkownicy mogą czytać (admin panel)
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON bookings;
CREATE POLICY "Enable read access for authenticated users only" ON bookings FOR
SELECT USING (auth.role() = 'authenticated');
-- Polityka: Tylko zalogowani użytkownicy mogą aktualizować
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON bookings;
CREATE POLICY "Enable update for authenticated users only" ON bookings FOR
UPDATE USING (auth.role() = 'authenticated');
-- Polityka: Tylko zalogowani użytkownicy mogą usuwać
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON bookings;
CREATE POLICY "Enable delete for authenticated users only" ON bookings FOR DELETE USING (auth.role() = 'authenticated');
-- 6. Indeksy dla lepszej wydajności
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_preferred_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_service_type ON bookings(service_type);
-- 7. Komentarze do tabeli (dokumentacja)
COMMENT ON TABLE bookings IS 'Tabela przechowująca rezerwacje wizyt w gabinecie beauty';
COMMENT ON COLUMN bookings.status IS 'Status rezerwacji: pending, confirmed, completed, cancelled';
COMMENT ON COLUMN bookings.service_type IS 'Typ usługi - dozwolone wartości:
  PMU (Makijaż Permanentny):
    - pigmentacja-brwi
    - pigmentacja-ust
    - pigmentacja-powiek
    - kreska-cieniowana
    - kreska-dolna
  KWAS (Kwas Hialuronowy):
    - modelowanie-ust
    - rewitalizacja-ust
    - wypelniacze-zmarszczek
    - wolumetria-twarzy
    - nici-pdo
    - lipoliza-iniekcyjna
  MEZOTERAPIA:
    - osocze-bogatoplytkowe
    - stymulatory-tkankowe
    - mezoterapia
    - laserowy-peeling-weglowy
    - peeling-medyczny
    - dermapen
    - retix-c-xylogic
    - oczyszczanie-wodorowe
    - radiofrekwencja-mikroiglowa
  INNE:
    - inne (konsultacja)';
-- ================================================
-- OPCJONALNIE: Przykładowe dane testowe
-- ================================================
-- Odkomentuj poniżej, jeśli chcesz dodać dane testowe
INSERT INTO bookings (
        first_name,
        last_name,
        email,
        phone,
        service_type,
        preferred_date,
        preferred_time,
        has_allergies,
        is_pregnant,
        has_skin_conditions,
        taking_medication,
        consent_personal_data,
        consent_marketing,
        additional_notes,
        status
    )
VALUES (
        'Anna',
        'Kowalska',
        'anna@example.com',
        '+48 123 456 789',
        'brwi',
        '2025-02-01',
        '10:00',
        false,
        false,
        false,
        false,
        true,
        true,
        'Proszę o kontakt telefoniczny',
        'pending'
    );
-- ================================================
-- WERYFIKACJA
-- ================================================
-- Sprawdź czy wszystko się utworzyło poprawnie:
SELECT tablename,
    schemaname
FROM pg_tables
WHERE tablename = 'bookings';
-- Sprawdź polityki RLS:
SELECT schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'bookings';
-- Sprawdź indeksy:
SELECT indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'bookings';