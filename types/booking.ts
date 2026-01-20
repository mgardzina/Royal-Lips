export interface BookingFormData {
  // Dane personalne
  firstName: string
  lastName: string
  email: string
  phone: string
  
  // Szczegóły usługi
  serviceType: string
  preferredDate: string
  preferredTime: string
  
  // Wywiad zdrowotny
  hasAllergies: boolean
  allergiesDetails?: string
  isPregnant: boolean
  hasSkinConditions: boolean
  skinConditionsDetails?: string
  takingMedication: boolean
  medicationDetails?: string
  
  // RODO
  consentPersonalData: boolean
  consentMarketing: boolean
  
  // Dodatkowe
  additionalNotes?: string
}

export interface BookingRecord extends BookingFormData {
  id: string
  createdAt: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export type ServiceType = {
  id: string
  name: string
  duration: number // w minutach
  description: string
}

export const SERVICES: ServiceType[] = [
  {
    id: 'brwi',
    name: 'Makijaż permanentny brwi',
    duration: 120,
    description: 'Profesjonalny makijaż permanentny brwi metodą microblading lub pudrową'
  },
  {
    id: 'usta',
    name: 'Makijaż permanentny ust',
    duration: 150,
    description: 'Naturalne lub bardziej wyraziste usta dzięki pigmentacji'
  },
  {
    id: 'kreski',
    name: 'Makijaż permanentny kresek',
    duration: 120,
    description: 'Kreska górna lub dolna - podkreśl swoje spojrzenie'
  },
  {
    id: 'inne',
    name: 'Inna usługa',
    duration: 60,
    description: 'Skonsultuj indywidualnie'
  }
]