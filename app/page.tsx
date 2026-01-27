"use client";

import { useState } from "react";
import SelectionScreen from "./components/SelectionScreen";
import HyaluronicForm from "./components/forms/HyaluronicForm";
import PmuForm from "./components/forms/PmuForm";
import LaserForm from "./components/forms/LaserForm";
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
    case "HYALURONIC":
      return <HyaluronicForm onBack={() => setSelectedForm(null)} />;
    case "PMU":
      return <PmuForm onBack={() => setSelectedForm(null)} />;
    case "LASER":
      return <LaserForm onBack={() => setSelectedForm(null)} />;
    default:
      return <div>Formularz nieznany</div>;
  }
}
