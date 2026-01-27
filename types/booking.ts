export type FormType = 'HYALURONIC' | 'PMU' | 'LASER';

export interface ConsentFormData {
  type: FormType;
  
  // Dane personalne
  imieNazwisko: string;
  ulica: string;
  kodPocztowy: string;
  miasto: string;
  dataUrodzenia: string;
  telefon: string;
  miejscowoscData: string;

  // Szczegóły zabiegu
  nazwaProduktu: string; // Dla lasera: Cel
  obszarZabiegu: string;
  celEfektu: string;

  // Przeciwwskazania (Słownik klucz -> wartość)
  przeciwwskazania: Record<string, boolean | null>;

  // Zgody
  zgodaPrzetwarzanieDanych: boolean;
  zgodaMarketing: boolean;
  zgodaFotografie: boolean;
  miejscaPublikacjiFotografii: string;

  // Podpisy
  podpisDane: string;
  podpisMarketing: string;
  podpisFotografie: string;
  podpisRodo: string;
}

// Stała dla Kwasu Hialuronowego (obecny)
export const hyaluronicContraindications: Record<string, string> = {
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

// Stała dla PMU (nowy)
export const pmuContraindications: Record<string, string> = {
  ciazaLaktacja: 'Ciąża i okres laktacji',
  alergiaBarwniki: 'Alergia na barwniki do pigmentacji',
  alergiaFarby: 'Alergia na farby fryzjerskie',
  alergiaZnieczulenie: 'Alergia na preparaty znieczulające (Fashion Brows Turbo Strong/Zensa)',
  zmianySkorne: 'Dermatologiczne zmiany skórne w obszarze zabiegu (trądzik, stany ropne, liszaje, brodawczaki, poparzenia)',
  luszczycaAktywna: 'Łuszczyca (faza aktywna)',
  cukrzycaNiestabilna: 'Nieustabilizowana cukrzyca',
  hemofilia: 'Hemofilia',
  chorobaNowotwrowa: 'Choroba nowotworowa',
  hivZoltaczka: 'Żółtaczka i HIV',
  arytmiaSerca: 'Arytmia serca',
  epilepsja: 'Epilepsja',
  bielactwo: 'Bielactwo',
  opryszczka: 'Opryszczka',
  nadpobudliwoscNerwowa: 'Nadpobudliwość nerwowa, tiki',
  chorobaAutoimmunologiczna: 'Choroba autoimmunologiczna',
  chorobyOczu: 'Tylko dla powiek: Choroby gałki ocznej, stany zapalne spojówek, przebyte operacje oczu, zwyrodnienie siatkówki',
  sklonnoscDoBliznowcow: 'Skłonność do bliznowców (koloidów)',
  kuracjaSterydowa: 'Aktualna kuracja sterydowa lub antybiotykoterapia',
  lekiRozrzedzajaceKrew: 'Leki rozrzedzające krew',
  zabiegZluszczania: 'Zabiegi złuszczania naskórka (ostatnie 4 tyg.)',
  odzywkiDoBrwi: 'Odżywki do brwi/rzęs (ostatnie 3 mies.)',
  wypelniaczeUst: 'Wypełniacze ust (ostatnie 3 mies.)',
  leczenieStomatologiczne: 'Leczenie stomatologiczne (przy ustach)',
  goraczkaPrzeziebienie: 'Gorączka/przeziębienie w dniu zabiegu',
  alkoholNarkotyki: 'Alkohol/narkotyki (24h przed)',
};

// Stała dla Lasera (nowy)
export const laserContraindications: Record<string, string> = {
  ciazaLaktacja: 'Ciąża i laktacja',
  rozrusznikSerca: 'Rozrusznik serca',
  luszczycaCukrzyca: 'Łuszczyca, Cukrzyca, Hemofilia, Nowotwory, HIV/Żółtaczka',
  arytmiaEpilepsja: 'Arytmia, Epilepsja, Bielactwo, Opryszczka',
  nadpobudliwoscNerwowa: 'Nadpobudliwość nerwowa/tiki',
  chorobaAutoimmunologiczna: 'Choroby autoimmunologiczne',
  chorobyOczu: 'Choroby oczu/operacje (przy zabiegu na powiekach)',
  sklonnoscDoBliznowcow: 'Skłonność do bliznowców',
  leki: 'Leki: Sterydy, Antybiotyki, Rozrzedzające krew',
  lekiMiejscowe: 'Leki miejscowe w obszarze zabiegu',
  zabiegZluszczania: 'Złuszczanie naskórka (4 tyg. przed)',
  odzywkiDoBrwi: 'Odżywki na porost (3 mies. przed)',
  goraczkaAlkohol: 'Gorączka/Alkohol (24h)',
};

// Mapowanie typów na zestawy pytań
export const contraindicationsByFormType: Record<FormType, Record<string, string>> = {
  HYALURONIC: hyaluronicContraindications,
  PMU: pmuContraindications,
  LASER: laserContraindications,
};

// Zachowanie kompatybilności wstecznej (dla starych importów)
export const defaultContraindications = {}; 
export const contraindicationLabels = hyaluronicContraindications;
