// Shared services data used across the app
export interface Service {
  id: string;
  category: "PMU" | "KWAS" | "MEZOTERAPIA";
  name: string;
  description: string;
  duration: string;
}

export const SERVICES: Service[] = [
  // PMU - Makijaż Permanentny
  {
    id: "pigmentacja-brwi",
    category: "PMU",
    name: "Pigmentacja Brwi",
    description: "Makijaż permanentny brwi - metoda włoskowa, pudrowa lub ombre. Naturalny efekt dopasowany do kształtu twarzy.",
    duration: "120-150 min"
  },
  {
    id: "pigmentacja-ust",
    category: "PMU",
    name: "Pigmentacja Ust",
    description: "Makijaż permanentny ust - kontur, pełne wypełnienie lub aquarelle. Podkreślenie naturalnego piękna ust.",
    duration: "120-150 min"
  },
  {
    id: "pigmentacja-powiek",
    category: "PMU",
    name: "Pigmentacja Powiek",
    description: "Makijaż permanentny powiek - kreska górna, międzykresowa. Trwały efekt podkreślonego spojrzenia.",
    duration: "90-120 min"
  },
  {
    id: "kreska-cieniowana",
    category: "PMU",
    name: "Kreska Cieniowana",
    description: "Delikatna, rozciągnięta kreska na górnej powiece. Efekt naturalnego cienia i głębi spojrzenia.",
    duration: "90-120 min"
  },
  {
    id: "kreska-dolna",
    category: "PMU",
    name: "Kreska Dolna",
    description: "Subtelne podkreślenie dolnej linii rzęs. Powiększenie optyczne oka i nadanie wyrazu spojrzeniu.",
    duration: "60-90 min"
  },

  // KWAS - Kwas Hialuronowy
  {
    id: "modelowanie-ust",
    category: "KWAS",
    name: "Modelowanie Ust",
    description: "Profesjonalne powiększenie i modelowanie ust kwasem hialuronowym. Naturalne lub bardziej wyraziste efekty.",
    duration: "45-60 min"
  },
  {
    id: "rewitalizacja-ust",
    category: "KWAS",
    name: "Rewitalizacja Ust",
    description: "Nawilżenie i odświeżenie ust kwasem hialuronowym. Idealny zabieg dla osób pragnących delikatnego efektu.",
    duration: "30-45 min"
  },
  {
    id: "wypelniacze-zmarszczek",
    category: "KWAS",
    name: "Wypełniacze Zmarszczek",
    description: "Redukcja zmarszczek mimicznych - zmarszczki lwi, nosowo-wargowe, kurzych łapek. Wygładzenie i odmłodzenie twarzy.",
    duration: "30-45 min"
  },
  {
    id: "wolumetria-twarzy",
    category: "KWAS",
    name: "Wolumetria Twarzy",
    description: "Przywrócenie objętości i konturowanie twarzy. Lifting policzków, modelowanie żuchwy i podbródka.",
    duration: "60-90 min"
  },
  {
    id: "nici-pdo",
    category: "KWAS",
    name: "Nici PDO",
    description: "Nieinwazyjny lifting z użyciem nici PDO. Ujędrnienie skóry i poprawa owalu twarzy bez skalpela.",
    duration: "60-90 min"
  },
  {
    id: "lipoliza-iniekcyjna",
    category: "KWAS",
    name: "Lipoliza Iniekcyjna",
    description: "Redukcja tkanki tłuszczowej poprzez iniekcje. Skuteczne usuwanie drugiego podbródka.",
    duration: "45-60 min"
  },

  // MEZOTERAPIA
  {
    id: "osocze-bogatoplytkowe",
    category: "MEZOTERAPIA",
    name: "Osocze Bogatopłytkowe",
    description: "Zabieg PRP z własnej krwi. Naturalna regeneracja i odmłodzenie skóry.",
    duration: "90 min"
  },
  {
    id: "stymulatory-tkankowe",
    category: "MEZOTERAPIA",
    name: "Stymulatory Tkankowe",
    description: "Biostymulacja skóry substancjami aktywującymi produkcję kolagenu.",
    duration: "60-90 min"
  },
  {
    id: "mezoterapia",
    category: "MEZOTERAPIA",
    name: "Mezoterapia",
    description: "Głębokie nawilżenie i rewitalizacja skóry kwasem hialuronowym, witaminami i minerałami.",
    duration: "60 min"
  },
  {
    id: "laserowy-peeling-weglowy",
    category: "MEZOTERAPIA",
    name: "Laserowy Peeling Węglowy",
    description: "Innowacyjny zabieg oczyszczający i odmładzający z użyciem lasera.",
    duration: "45-60 min"
  },
  {
    id: "peeling-medyczny",
    category: "MEZOTERAPIA",
    name: "Peeling Medyczny",
    description: "Złuszczanie naskórka kwasami. Rozjaśnienie przebarwień i poprawa tekstury skóry.",
    duration: "60 min"
  },
  {
    id: "dermapen",
    category: "MEZOTERAPIA",
    name: "Dermapen",
    description: "Mikronakłuwanie stymulujące odnowę skóry. Redukcja zmarszczek, blizn i rozstępów.",
    duration: "60-90 min"
  },
  {
    id: "retix-c-xylogic",
    category: "MEZOTERAPIA",
    name: "Retix C Xylogic",
    description: "Innowacyjny zabieg z retinolem i witaminą C. Silne działanie przeciwstarzeniowe.",
    duration: "60 min"
  },
  {
    id: "oczyszczanie-wodorowe",
    category: "MEZOTERAPIA",
    name: "Oczyszczanie Wodorowe",
    description: "Głębokie oczyszczanie skóry wodorem. Usunięcie zanieczyszczeń, nawilżenie i dotlenienie.",
    duration: "90 min"
  },
  {
    id: "radiofrekwencja-mikroiglowa",
    category: "MEZOTERAPIA",
    name: "Radiofrekwencja Mikroigłowa",
    description: "Lifting bez skalpela. Ujędrnienie skóry dzięki połączeniu mikronakłuwania i fal radiowych.",
    duration: "90-120 min"
  },
  {
    id: "inne",
    category: "PMU",
    name: "Inna usługa / Konsultacja",
    description: "Skonsultuj indywidualnie swoją potrzebę.",
    duration: "30-60 min"
  }
];

export const CATEGORIES = ["PMU", "KWAS", "MEZOTERAPIA"] as const;

export type ServiceCategory = typeof CATEGORIES[number];
