"use client";

import { useState } from "react";
import SelectionScreen from "./components/SelectionScreen";
import FacialVolumetryForm from "./components/forms/FacialVolumetryForm";

import LipModelingForm from "./components/forms/LipModelingForm";
import WrinkleLevelingForm from "./components/forms/WrinkleLevelingForm";
import { FormType } from "../types/booking";

export default function HomePage() {
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);

  if (!selectedForm) {
    return (
      <SelectionScreen
        onSelect={(type) => {
          setSelectedForm(type);
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  // Renderowanie odpowiedniego formularza
  switch (selectedForm) {
    case "LIP_AUGMENTATION":
      return <LipModelingForm onBack={() => setSelectedForm(null)} />;
    case "FACIAL_VOLUMETRY":
      return <FacialVolumetryForm onBack={() => setSelectedForm(null)} />;

    case "WRINKLE_REDUCTION":
      return <WrinkleLevelingForm onBack={() => setSelectedForm(null)} />;
    default:
      return <div>Formularz nieznany</div>;
  }
}
