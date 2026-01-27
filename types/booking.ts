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
  email?: string;
  miejscowoscData: string;
  osobaPrzeprowadzajacaZabieg?: string;

  // Szczegóły zabiegu
  nazwaProduktu: string;
  obszarZabiegu: string;
  celEfektu: string;
  numerZabiegu?: string; // "zabieg pierwszy" / "zabieg kolejny"

  // Przeciwwskazania (Słownik klucz -> wartość)
  przeciwwskazania: Record<string, boolean | null>;

  // Zgody
  zgodaPrzetwarzanieDanych: boolean;
  zgodaMarketing: boolean;
  zgodaFotografie: boolean;
  zgodaPomocPrawna: boolean;
  miejscaPublikacjiFotografii: string;

  // Podpisy
  podpisDane: string;
  podpisMarketing: string;
  podpisFotografie: string;
  podpisRodo: string;

  // Informacja dodatkowa
  informacjaDodatkowa?: string;
  zastrzeniaKlienta?: string;
}

// RODO Information - Dane administratora
export const rodoInfo = {
  administrator: 'Joanna Wielgos',
  firmaNazwa: 'Royal Lips Studio Makijażu Permanentnego',
  nip: '6842237473',
  regon: '180685260',
  adres: 'ul. Pużaka 37, 38-400 Krosno',
  pelnyTekst: `Zgodnie z art. 13 ust. 1-2 Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych) (dalej „RODO") informuję, że:

I. Administratorem Pani/Pana danych osobowych jest Joanna Wielgos, prowadząca działalność gospodarczą pod nazwą: Royal Lips Studio Makijażu Permanentnego, ul. Pużaka 37, 38-400 Krosno, REGON 180685260, NIP 6842237473

II. Będę przetwarzać Pani/Pana dane wyłącznie w celu wykonania umowy o wykonanie zabiegu kosmetycznego, w zakresie wynikającym ze zlecenia, i objętej zgodą na podstawie Oświadczenia o wyrażeniu zgody na wykonanie zabiegu kosmetycznego, zgodnie z zasadami wymienionymi w art. 5. Niedopuszczalne jest przetwarzanie Pani/Pana danych w celu marketingu bezpośredniego.

III. Prawo do sprzeciwu
W każdej chwili przysługuje Pani/Panu prawo do wniesienia sprzeciwu wobec przetwarzania Pani/Pana danych, przetwarzanych w celu i na podstawie wskazanych powyżej. Przestaniemy przetwarzać Pani/Pana dane w tych celach, chyba że będziemy w stanie wykazać, że istnieją ważne, prawnie uzasadnione podstawy, które są nadrzędne wobec Pani/Pana interesów, praw i wolności lub Pani/Pana dane będą nam niezbędne do ewentualnego ustalenia, dochodzenia lub obrony roszczeń.

IV. Będę przechowywać dane przez okres niezbędny dla prawidłowego wykonania umowy, nie dłużej jednak niż do przedawnienia dochodzenia roszczenia lub zgłoszenia szkody.

V. Pani/Pana dane osobowe mogą zostać przekazywane wyłącznie pracownikom księgowości/biura rachunkowego, na których przepisy nakładają obowiązek zachowania tajemnicy – tylko w celu umożliwienia rozliczenia wykonanego zabiegu, wystawienia faktury, rachunku imiennego, lub pracownikom przedsiębiorstwa Joanna Wielgos Royal Lips Studio Makijażu Permanentnego (ul. Pużaka 37, 38-400 Krosno), którym powierzono pisemnie przetwarzanie danych osobowych i którzy ponoszą odpowiedzialność za naruszenie zasad przetwarzania.

VI. Zgodnie z RODO, przysługuje Pani/Panu prawo do:
a) dostępu do swoich danych oraz otrzymania ich kopii
b) sprostowania (poprawiania) swoich danych
c) żądania usunięcia, ograniczenia lub wniesienia sprzeciwu wobec ich przetwarzania
d) przenoszenia danych
e) wniesienia skargi do organu nadzorczego

VII. Podanie danych jest dobrowolne z tym, że odmowa ich podania może uniemożliwić wykonanie zabiegu w ramach usług oferowanych Klientom, i stanowi podstawę odmowy ich wykonania.

VIII. Informuję, że nie podejmuję decyzji w sposób zautomatyzowany i Pani/Pana dane nie są profilowane.

IX. W każdej chwili przysługuje Pani/Panu prawo do wycofania zgody na przetwarzanie Pani/Pana danych osobowych (w tym należących do szczególnej kategorii), ale cofnięcie zgody nie wpływa na zgodność z prawem przetwarzania, którego dokonano zgodnie z prawem, przed jej wycofaniem.`,
};

// Stała dla Kwasu Hialuronowego
export const hyaluronicContraindications: Record<string, string> = {
  ciazaLaktacja: 'Jestem w ciąży lub w okresie laktacji',
  chorobaAutoimmunologiczna: 'Mam chorobę autoimmunologiczną',
  alergiaSkładniki: 'Mam alergię na składniki preparatu (dane z przeszłości, jeśli są)',
  alergiaBialka: 'Mam alergię na białka',
  uczulenieIgE: 'Mam uczulenie na alergeny IgE zależne',
  niedrocznoscNaczyn: 'Mam niedrożność naczyń krwionośnych z nieprawidłowym krzepnięciem krwi',
  zmianySkorne: 'Mam dermatologiczne zmiany skórne w obszarze poddawanym zabiegowi (trądzik ropowniczy, stany ropne, alergiczne lub grzybicze zmiany, naczyniaki, liszaje, brodawczaki, przerwania ciągłości naskórka, poparzenia słoneczne)',
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
  metodyRozgrzewajace: 'Stosowałem/am w dniu zabiegu metody rozgrzewające ciało: sauna, fitness, itd.',
  solarium: 'Byłem/am w solarium i nie opalałem/am się intensywnie min. tydzień przed zabiegiem',
};

// Naturalne reakcje dla kwasu hialuronowego
export const hyaluronicNaturalReactions = [
  'obrzęk i szczypanie okolicy pozabiegowej utrzymujący się do 2 tygodni',
  'zaczerwienienie i/lub zasinienie okolicy pozabiegowej utrzymujące się do tygodnia',
  'wylewy, krwiaki, siniaki okolicy pozabiegowej utrzymujące się do 2 tygodni',
  'tkliwość tkanek objętych zabiegiem utrzymująca się do około miesiąca',
  'możliwe wyczuwanie materiału zabiegowego (grudki) przez okres do 2 tygodni',
  'swędzenia w okresie gojenia',
];

// Powikłania dla kwasu hialuronowego
export const hyaluronicComplications = {
  czeste: [
    'przedłużający się obrzęk',
    'przedłużający się rumień',
    'zgrubienie w miejscu wprowadzenia preparatu',
    'wylewy krwawe',
    'migracja kwasu hialuronowego',
    'efekt Tyndalla',
    'przebarwienia w miejscu iniekcji',
  ],
  rzadkie: [
    'zakażenie wirusowe',
    'zakażenie bakteryjne',
    'zakażenia grzybicze',
    'nieregularna powierzchnia skóry zniekształcenie',
    'guzki na skórze',
    'opóźnione stany zapalne',
    'ropnie i owrzodzenia',
    'widoczna asymetria',
  ],
  bardzoRzadkie: [
    'martwica skóry',
    'zatory w obrębie naczyń krwionośnych i limfatycznych',
    'tworzenie się ziarniaków',
    'ucisk na lokalne naczynia krwionośne',
    'obrzęk naczynioruchowy',
  ],
};

// Zalecenia pozabiegowe dla kwasu hialuronowego
export const hyaluronicPostCare = [
  'Stosowanie preparatu pozabiegowego: MAŚĆ ARNIKOWA',
  'Miejsce poddane zabiegowi traktować ze szczególną ostrożnością',
  'Nie dotykać ani nie masować miejsc poddanych zabiegowi',
  'Zachować wysoką higienę dłoni, istnieje bowiem duże ryzyko wtórnego zakażenia',
  'Nie przemywać mydłem i środkami złuszczającymi miejsc poddanych wypełnieniu przez min. 2 tygodni',
  'Unikać silnej ekspozycji słonecznej przez 6 tygodni i stosować kremy z wysokim filtrem UV',
  'Nie korzystać z solarium przez okres 2 tygodni',
  'Nie korzystać z sauny, basenu czy krioterapii przez okres 1 tygodnia',
  'Unikać alkoholu przez okres min. 48 godzin po zabiegu',
  'Unikać gorących napojów w dniu zabiegu (dotyczy modelowania ust)',
  'Unikać wzmożonego wysiłku fizycznego przez około dwie doby',
  'Unikać spania przez kilka dni w pozycji mogącej spowodować uciśnięcie miejsca podania kwasu hialuronowego, a co za tym idzie przemieszczenia preparatu',
  'Nie poddawać się zabiegom peelingu chemicznego i mechanicznego przez okres 2 tygodni od zabiegu',
  'UWAGA: Stosować się ściśle do zaleceń pozabiegowych. Przez 4 doby po zabiegu należy pić dużo wody, minimum 2,5 litra dziennie.',
  'UWAGA: Utrzymywanie się reakcji zapalnych przez okres dłuższy niż 7 dni lub wystąpienie jakichkolwiek reakcji niepożądanych należy niezwłocznie zgłosić.',
];

// Stała dla PMU (Makijaż Permanentny)
export const pmuContraindications: Record<string, string> = {
  ciazaLaktacja: 'Ciąża i okres laktacji',
  alergiaBarwniki: 'Alergia na barwniki stosowane do pigmentacji',
  alergiaFarby: 'Alergia na farby fryzjerskie',
  alergiaZnieczulenie: 'Alergia na preparat Fashion Brows Turbo Strong/Zensa stosowany do znieczulenia miejscowego',
  zmianySkorne: 'Dermatologiczne zmiany skórne w obszarze poddawanym zabiegowi (trądzik ropowniczy, stany ropne, alergiczne lub grzybicze zmiany w okolicach podlegających zabiegowi, naczyniaki, liszaje, brodawczaki, przerwana ciągłość naskórka, poparzenia słoneczne)',
  luszczycaAktywna: 'Łuszczyca (w fazie aktywnej)',
  cukrzycaNiestabilna: 'Nieustabilizowana cukrzyca',
  hemofilia: 'Hemofilia',
  chorobaNowotwrowa: 'Choroba nowotworowa',
  hivZoltaczka: 'Żółtaczka i HIV',
  arytmiaSerca: 'Arytmia serca',
  epilepsja: 'Epilepsja',
  bielactwo: 'Bielactwo',
  opryszczka: 'Opryszczka',
  nadpobudliwoscNerwowa: 'Nadpobudliwość nerwowa, tiki nerwowe',
  chorobaAutoimmunologiczna: 'Choroba autoimmunologiczna',
  chorobaGalkiOcznej: 'Choroba gałki ocznej (w przypadku makijażu powiek)',
  stanyZapalneSpojowek: 'Stany zapalne spojówek i oczu (w przypadku makijażu powiek)',
  operacjeOczu: 'Przebyte zabiegi operacyjne oczu (w przypadku makijażu powiek)',
  zwyrodnienieSiatkowki: 'Zwyrodnienie siatkówki (w przypadku makijażu powiek)',
  sklonnoscDoBliznowcow: 'Skóra z tendencjami do keloidów i blizn',
  kuracjaSterydowa: 'Aktualna kuracja sterydowa',
  antybiotykoterapia: 'Aktualna antybiotykoterapia',
  lekiRozrzedzajaceKrew: 'Stosowanie leków rozrzedzających krew',
  lekiMiejscowe: 'Stosowanie leków do aplikacji miejscowej w obszarze objętym zabiegiem',
  zabiegZluszczania: 'Przeprowadzony zabieg złuszczania naskórka przez okres 4 tygodni przed zabiegiem',
  odzywkiDoBrwi: 'Stosowanie odżywek do rewitalizacji, stymulacji wzrostu brwi i rzęs w okresie 3 miesięcy przed zabiegiem (makijaż brwi, kreski powiek)',
  wypelniaczeUst: 'Ostrzykiwanie ust wypełniaczem (min. 3 miesiące przed zabiegiem)',
  leczenieStomatologiczne: 'Leczenie stomatologiczne (makijaż ust)',
  goraczkaPrzeziebienie: 'Podwyższona temperatura i przeziębienie w dniu zabiegu',
  alkoholNarkotyki: 'Spożycie alkoholu i środków odurzających w ostatnich 24h',
};

// Naturalne reakcje dla PMU
export const pmuNaturalReactions = [
  'swędzenie w okresie gojenia',
  'pojawienia się strupków i złuszczania naskórka w miejscu zabiegu',
  'makijaż w pierwszych dniach po zabiegu będzie znacząco ciemniejszy',
];

// Powikłania dla PMU
export const pmuComplications = {
  czeste: ['obrzęk', 'rumień'],
  rzadkie: ['zakażenie wirusowe', 'zakażenie bakteryjne'],
  bardzoRzadkie: ['bliznowce', 'migracja pigmentu'],
};

// Zalecenia pozabiegowe dla PMU
export const pmuPostCare = [
  'Miejsce poddane zabiegowi traktować ze szczególną ostrożnością',
  'WAŻNE: Strupków ani złuszczającego się naskórka nie wolno usuwać mechanicznie!',
  'Zachować wysoką higienę dłoni, istnieje bowiem duże ryzyko wtórnego zakażenia',
  'Nie przemywać wodą z mydłem i środkami złuszczającymi miejsc poddanych pigmentacji przez min. 2 tygodnie',
  'Unikać silnej ekspozycji słonecznej przez 6 tygodni i stosować kremy z wysokim filtrem UV',
  'Nie korzystać z solarium przez okres 6 tygodni',
  'Nie korzystać z sauny, basenu przez okres min. 3 tygodni',
  'Unikać mechanicznego odrywania strupków',
  'Unikać gorących napojów, ostrych potraw i alkoholu',
  'Przyjmować płyny przez słomkę w pierwszych dniach po zabiegu (makijaż ust)',
  'Nie używać pomadek, błyszczyków przez okres gojenia się ust (makijaż ust)',
  'Zachować szczególną higienę jamy ustnej (makijaż ust)',
  'Nie poddawać się zabiegom mezoterapii i wstrzyknięciom toksyny botulinowej w 2-3 tygodniu po zabiegu',
  'Nie poddawać się zabiegom peelingu chemicznego i mechanicznego przez okres 3 tygodni od zabiegu',
  'Zabieg przebiega w dwóch etapach: drugi zabieg tzw. dopigmentowanie (korekta) wykonany będzie do 2 miesięcy od pierwszotnego zabiegu',
  'W przypadku utrzymywanie się reakcji zapalnych przez okres dłuższy niż tydzień lub wystąpienie jakichkolwiek reakcji niepożądanych należy niezwłocznie zgłosić',
];

// Stała dla Lasera Q-Switch
export const laserContraindications: Record<string, string> = {
  ciazaLaktacja: 'Ciąża i okres laktacji',
  rozrusznikSerca: 'Rozrusznik serca',
  luszczycaAktywna: 'Łuszczyca (w fazie aktywnej)',
  cukrzycaNiestabilna: 'Nieustabilizowana cukrzyca',
  hemofilia: 'Hemofilia',
  chorobaNowotwrowa: 'Choroba nowotworowa',
  hivZoltaczka: 'Żółtaczka i HIV',
  arytmiaSerca: 'Arytmia serca',
  epilepsja: 'Epilepsja',
  bielactwo: 'Bielactwo',
  opryszczka: 'Opryszczka',
  nadpobudliwoscNerwowa: 'Nadpobudliwość nerwowa, tiki nerwowe',
  chorobaAutoimmunologiczna: 'Choroba autoimmunologiczna',
  chorobaGalkiOcznej: 'Choroba gałki ocznej (w przypadku zabiegu na powiekach)',
  stanyZapalneSpojowek: 'Stany zapalne spojówek i oczu (w przypadku zabiegu na powiekach)',
  operacjeOczu: 'Przebyte zabiegi operacyjne oczu (w przypadku zabiegu na powiekach)',
  zwyrodnienieSiatkowki: 'Zwyrodnienie siatkówki (w przypadku zabiegu na powiekach)',
  sklonnoscDoBliznowcow: 'Skóra z tendencjami do keloidów i blizn',
  kuracjaSterydowa: 'Aktualna kuracja sterydowa',
  antybiotykoterapia: 'Aktualna antybiotykoterapia',
  lekiRozrzedzajaceKrew: 'Stosowanie leków rozrzedzających krew',
  lekiMiejscowe: 'Stosowanie leków do aplikacji miejscowej w obszarze objętym zabiegiem',
  zabiegZluszczania: 'Przeprowadzony zabieg złuszczania naskórka przez okres 4 tygodni przed zabiegiem',
  odzywkiDoBrwi: 'Stosowanie odżywek do rewitalizacji, stymulacji wzrostu brwi i rzęs w okresie 3 miesięcy przed zabiegiem',
  goraczkaPrzeziebienie: 'Podwyższona temperatura i przeziębienie w dniu zabiegu',
  alkoholNarkotyki: 'Spożycie alkoholu i środków odurzających w ostatnich 24h',
};

// Naturalne reakcje dla Lasera
export const laserNaturalReactions = [
  'dyskomfort podczas zabiegu',
  'swędzenie w okresie gojenia',
  'pojawienia się strupków i złuszczania naskórka w miejscu zabiegu',
  'przemijające przebarwienia skóry',
];

// Powikłania dla Lasera
export const laserComplications = {
  czeste: ['obrzęk', 'rumień', 'strupki', 'pęcherzyki', 'reakcje alergiczne'],
  rzadkie: ['zakażenie wirusowe', 'bliznowacenie', 'zakażenie bakteryjne'],
  bardzoRzadkie: ['tymczasowe lub trwałe zmiany w kolorze i strukturze skóry'],
};

// Zalecenia pozabiegowe dla Lasera
export const laserPostCare = [
  'Miejsce poddane zabiegowi traktować ze szczególną ostrożnością',
  'Zachować wysoką higienę dłoni, istnieje bowiem duże ryzyko wtórnego zakażenia',
  'Unikać silnej ekspozycji słonecznej przez 4 tygodnie i stosować kremy z wysokim filtrem UV',
  'Nie korzystać z solarium przez okres 4 tygodnie',
  'Nie korzystać z sauny, basenu przez okres min. 3 tygodni',
  'Unikać mechanicznego odrywania strupków',
  'Unikać alkoholu przez około 48 godzin po zabiegu',
  'Nie poddawać się zabiegom peelingu chemicznego i mechanicznego przez okres 2 tygodni od zabiegu',
];

// Mapowanie typów na zestawy pytań
export const contraindicationsByFormType: Record<FormType, Record<string, string>> = {
  HYALURONIC: hyaluronicContraindications,
  PMU: pmuContraindications,
  LASER: laserContraindications,
};

// Zachowanie kompatybilności wstecznej (dla starych importów)
export const defaultContraindications = {}; 
export const contraindicationLabels = hyaluronicContraindications;
