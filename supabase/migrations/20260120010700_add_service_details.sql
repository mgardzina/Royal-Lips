-- Dodanie kolumn service_category i service_name do tabeli bookings
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS service_category TEXT,
    ADD COLUMN IF NOT EXISTS service_name TEXT;
-- Komentarze
COMMENT ON COLUMN bookings.service_category IS 'Kategoria usługi: PMU, KWAS, MEZOTERAPIA';
COMMENT ON COLUMN bookings.service_name IS 'Nazwa usługi (czytelna dla człowieka)';