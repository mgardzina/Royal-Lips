export interface ConsentFormData {
  // Dane personalne
  // Dane personalne
  imieNazwisko: string;
  ulica: string;
  kodPocztowy: string;
  miasto: string;
  dataUrodzenia: string;
  telefon: string;
  miejscowoscData: string;

  // Szczegóły zabiegu
  nazwaProduktu: string;
  obszarZabiegu: string;
  celEfektu: string;

  // Przeciwwskazania (27 pytań - true = Tak, false = Nie)
  przeciwwskazania: {
    ciazaLaktacja: boolean | null;
    chorobaAutoimmunologiczna: boolean | null;
    alergiaSkładniki: boolean | null;
    alergiaBialka: boolean | null;
    uczulenieIgE: boolean | null;
    niedrocznoscNaczyn: boolean | null;
    zmianySkorne: boolean | null;
    tradzikRopny: boolean | null;
    luszczycaAktywna: boolean | null;
    cukrzycaNiestabilna: boolean | null;
    chorobaNowotwrowa: boolean | null;
    hemofilia: boolean | null;
    hiv: boolean | null;
    zoltaczka: boolean | null;
    arytmiaSerca: boolean | null;
    epilepsja: boolean | null;
    bielactwo: boolean | null;
    opryszczka: boolean | null;
    nadpobudliwoscNerwowa: boolean | null;
    tendencjaDoKeloidow: boolean | null;
    kuracjaSterydowa: boolean | null;
    antybiotykoterapia: boolean | null;
    lekiRozrzedzajaceKrew: boolean | null;
    kwasAcetylosalicylowy: boolean | null;
    witaminaC: boolean | null;
    lekiMiejscowe: boolean | null;
    zabiegZluszczania: boolean | null;
    alkoholNarkotyki: boolean | null;
    temperaturaPrzeziebienie: boolean | null;
    metodyRozgrzewajace: boolean | null;
    solarium: boolean | null;
  };

  // Zgody
  zgodaPrzetwarzanieDanych: boolean;
  zgodaMarketing: boolean;
  zgodaFotografie: boolean;
  miejscaPublikacjiFotografii: string;

  // Podpis (można rozszerzyć o canvas do podpisu)
  podpisDane: string;
  podpisMarketing: string;
  podpisFotografie: string;
  podpisRodo: string;
}

export const defaultContraindications: ConsentFormData['przeciwwskazania'] = {
  ciazaLaktacja: null,
  chorobaAutoimmunologiczna: null,
  alergiaSkładniki: null,
  alergiaBialka: null,
  uczulenieIgE: null,
  niedrocznoscNaczyn: null,
  zmianySkorne: null,
  tradzikRopny: null,
  luszczycaAktywna: null,
  cukrzycaNiestabilna: null,
  chorobaNowotwrowa: null,
  hemofilia: null,
  hiv: null,
  zoltaczka: null,
  arytmiaSerca: null,
  epilepsja: null,
  bielactwo: null,
  opryszczka: null,
  nadpobudliwoscNerwowa: null,
  tendencjaDoKeloidow: null,
  kuracjaSterydowa: null,
  antybiotykoterapia: null,
  lekiRozrzedzajaceKrew: null,
  kwasAcetylosalicylowy: null,
  witaminaC: null,
  lekiMiejscowe: null,
  zabiegZluszczania: null,
  alkoholNarkotyki: null,
  temperaturaPrzeziebienie: null,
  metodyRozgrzewajace: null,
  solarium: null,
};

export const contraindicationLabels: Record<keyof ConsentFormData['przeciwwskazania'], string> = {
  ciazaLaktacja: 'Jestem w ciąży lub w okresie laktacji',
  chorobaAutoimmunologiczna: 'Mam chorobę autoimmunologiczną',
  alergiaSkładniki: 'Mam alergię na składniki preparatu (dane z przeszłości, jeśli są)',
  alergiaBialka: 'Mam alergię na białka',
  uczulenieIgE: 'Mam uczulenie na alergeny IgE zależne',
  niedrocznoscNaczyn: 'Mam niedrożność naczyń krwionośnych z nieprawidłowym krzepnięciem krwi',
  zmianySkorne: 'Mam dermatologiczne zmiany skórne w obszarze poddawanym zabiegowi',
  tradzikRopny: 'Mam trądzik ropowniczy, stany ropne, alergiczne lub grzybicze zmiany w okolicach podlegających zabiegowi, naczyniaki, liszaje, brodawczaki, przerwania ciągłości naskórka, poparzenia słoneczne',
  luszczycaAktywna: 'Mam łuszczycę (w fazie aktywnej)',
  cukrzycaNiestabilna: 'Mam nieustabilizowaną cukrzycę',
  chorobaNowotwrowa: 'Mam chorobę nowotworową',
  hemofilia: 'Mam hemofilię',
  hiv: 'Mam HIV',
  zoltaczka: 'Mam żółtaczkę',
  arytmiaSerca: 'Mam arytmię serca',
  epilepsja: 'Mam epilepsję',
  bielactwo: 'Mam bielactwo',
  opryszczka: 'Mam opryszczkę',
  nadpobudliwoscNerwowa: 'Mam nadpobudliwość nerwową, tiki nerwowe',
  tendencjaDoKeloidow: 'Mam skórę z tendencjami do keloidów i blizn',
  kuracjaSterydowa: 'Jestem w trakcie kuracji sterydowej',
  antybiotykoterapia: 'Jestem w trakcie antybiotykoterapii',
  lekiRozrzedzajaceKrew: 'Stosuję leki rozrzedzające krew (np. Aspiryna, Heparyna, Acard, itp.)',
  kwasAcetylosalicylowy: 'Stosuję leki zawierające kwas acetylosalicylowy',
  witaminaC: 'Zażywam witaminę C',
  lekiMiejscowe: 'Stosuję leki do aplikacji miejscowej w obszarze objętym zabiegiem',
  zabiegZluszczania: 'Miałem/am przeprowadzony zabieg złuszczania naskórka przez okres 4 tygodni przed zabiegiem',
  alkoholNarkotyki: 'Spożywałem/am alkohol i/lub środków odurzających w ciągu ostatnich 24h',
  temperaturaPrzeziebienie: 'Mam podwyższoną temperaturę i przeziębienie w dniu zabiegu',
  metodyRozgrzewajace: 'Stosowałem/am w dniu zabiegu metody rozgrzewających ciało: sauna, fitness, itd.',
  solarium: 'Byłem/am w solarium i nie opalałem/am się intensywnie min. tydzień przed zabiegiem',
};

// Stary interfejs dla kompatybilności
export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  hasAllergies: boolean;
  allergiesDetails?: string;
  isPregnant: boolean;
  hasSkinConditions: boolean;
  skinConditionsDetails?: string;
  takingMedication: boolean;
  medicationDetails?: string;
  consentPersonalData: boolean;
  consentMarketing: boolean;
  additionalNotes?: string;
}

export interface BookingRecord extends BookingFormData {
  id: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
