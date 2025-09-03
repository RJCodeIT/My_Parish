"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import { useAlerts } from "@/components/ui/Alerts";

const SACRAMENT_LABELS: { [key: string]: string } = {
  baptism: "Chrzest",
  firstCommunion: "Pierwsza Komunia",
  confirmation: "Bierzmowanie",
  marriage: "Małżeństwo",
  holyOrders: "Święcenia Kapłańskie",
};

interface Sacrament {
  type: string;
  date: string;
  // Dodatkowe pola dla wybranych sakramentów (frontend-only)
  godfather?: string; // Chrzest: ojciec chrzestny
  godmother?: string; // Chrzest: matka chrzestna
  witness?: string; // Bierzmowanie: świadek
  spouse?: string; // Małżeństwo: małżonek
  witnessMan?: string; // Małżeństwo: świadek
  witnessWoman?: string; // Małżeństwo: świadkowa
}

interface Address {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
}

interface ParishionerData {
  _id?: string;
  id?: string; // Added to support Prisma's default id field
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: Address;
  sacraments: Sacrament[];
  notes: string;
  // deceased
  isDeceased?: boolean;
  deceasedAt?: string;
  placeOfDeath?: string;
  deathCertificateNumber?: string;
  deathCertificateIssuedBy?: string;
  deathReporterName?: string;
  deathReporterRelation?: string;
  deathReporterPhone?: string;
  deathNotes?: string;
  // funeral
  funeralDate?: string;
  funeralLocation?: string;
  cemeteryName?: string;
  cremation?: boolean | null;
  officiant?: string;
  funeralNotes?: string;
}

interface ParishionersFormProps {
  initialData?: ParishionerData;
  isEditMode?: boolean;
}

const defaultFormData: ParishionerData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  phoneNumber: "",
  email: "",
  address: {
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
  },
  sacraments: Object.keys(SACRAMENT_LABELS).map((key) => ({ type: key, date: "" })),
  notes: "",
  isDeceased: false,
  deceasedAt: "",
  placeOfDeath: "",
  deathCertificateNumber: "",
  deathCertificateIssuedBy: "",
  deathReporterName: "",
  deathReporterRelation: "",
  deathReporterPhone: "",
  deathNotes: "",
  funeralDate: "",
  funeralLocation: "",
  cemeteryName: "",
  cremation: null,
  officiant: "",
  funeralNotes: "",
};

export default function ParishionersForm({ initialData, isEditMode = false }: ParishionersFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ParishionerData>(defaultFormData);
  const alerts = useAlerts();

  useEffect(() => {
    if (initialData && isEditMode) {
      console.log("Initial data received in form:", initialData);
      
      // Ensure all sacrament types exist in the form
      const allSacraments = Object.keys(SACRAMENT_LABELS).map(type => {
        const existingSacrament = initialData.sacraments.find(s => s.type === type);
        return existingSacrament || { type, date: "" };
      });

      // Format date strings properly for input fields (YYYY-MM-DD)
      const formattedData = {
        ...initialData,
        isDeceased: typeof initialData.isDeceased === 'boolean' ? initialData.isDeceased : false,
        // Convert date strings to proper format for date inputs
        dateOfBirth: initialData.dateOfBirth ? formatDateForInput(initialData.dateOfBirth) : "",
        deceasedAt: initialData.deceasedAt ? formatDateForInput(initialData.deceasedAt) : "",
        funeralDate: initialData.funeralDate ? formatDateForInput(initialData.funeralDate) : "",
        sacraments: allSacraments.map(s => ({
          ...s,
          date: s.date ? formatDateForInput(s.date) : ""
        }))
      };
      
      console.log("Formatted data for form:", formattedData);
      setFormData(formattedData);
    }
  }, [initialData, isEditMode]);

  // Helper function to format dates for input fields
  const formatDateForInput = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "";
      }
      // Format as YYYY-MM-DD
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleSacramentChange = (index: number, date: string) => {
    setFormData((prev) => {
      const newSacraments = [...prev.sacraments];
      newSacraments[index].date = date;
      return { ...prev, sacraments: newSacraments };
    });
  };

  const handleSacramentFieldChange = (
    index: number,
    field: keyof Sacrament,
    value: string
  ) => {
    setFormData((prev) => {
      const newSacraments = [...prev.sacraments];
      // ensure the object exists
      newSacraments[index] = { ...newSacraments[index], [field]: value } as Sacrament;
      return { ...prev, sacraments: newSacraments };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const filteredSacraments = formData.sacraments.filter((s) => s.date !== "");
  
    const hasDeceasedBlock = !!(
      formData.deceasedAt || formData.placeOfDeath || formData.deathCertificateNumber ||
      formData.deathCertificateIssuedBy || formData.deathReporterName || formData.deathReporterRelation ||
      formData.deathReporterPhone || formData.deathNotes || formData.isDeceased
    );

    const hasFuneralBlock = !!(
      formData.funeralDate || formData.funeralLocation || formData.cemeteryName ||
      typeof formData.cremation === 'boolean' || formData.officiant || formData.funeralNotes
    );

    const deceased = hasDeceasedBlock
      ? {
          deceasedAt: formData.deceasedAt || undefined,
          placeOfDeath: formData.placeOfDeath || undefined,
          deathCertificateNumber: formData.deathCertificateNumber || undefined,
          deathCertificateIssuedBy: formData.deathCertificateIssuedBy || undefined,
          deathReporterName: formData.deathReporterName || undefined,
          deathReporterRelation: formData.deathReporterRelation || undefined,
          deathReporterPhone: formData.deathReporterPhone || undefined,
          deathNotes: formData.deathNotes || undefined,
        }
      : undefined;

    const funeral = hasFuneralBlock
      ? {
          funeralDate: formData.funeralDate || undefined,
          funeralLocation: formData.funeralLocation || undefined,
          cemeteryName: formData.cemeteryName || undefined,
          cremation: typeof formData.cremation === 'boolean' ? formData.cremation : undefined,
          officiant: formData.officiant || undefined,
          funeralNotes: formData.funeralNotes || undefined,
        }
      : undefined;

    const formattedFormData = {
      ...formData,
      isDeceased: formData.isDeceased,
      deceased,
      funeral,
      sacraments: filteredSacraments,
    } as const;
  
    try {
      let response;
      
      // Use either _id or id field, whichever is available
      if (isEditMode && (formData._id || formData.id)) {
        const parishionerId = formData._id || formData.id;
        response = await fetch(`/mojaParafia/api/parishioners/${parishionerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedFormData),
        });
      } else {
        response = await fetch("/mojaParafia/api/parishioners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedFormData),
        });
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Błąd:", data);
        alerts.showError(`Błąd: ${data.message || data.error}`);
        return;
      }
  
      alerts.showSuccess(isEditMode ? "Parafianin zaktualizowany pomyślnie!" : "Parafianin dodany pomyślnie!");
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push("/admin/dashboard/parafianie");
      }, 2000);
    } catch (error) {
      console.error("Error sending request:", error);
      alerts.showError("Błąd połączenia z serwerem.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
      {/* 📌 Sekcja: Dane wiernego */}
      <div className="space-y-6 sm:space-y-8">
        <div className="space-y-6 sm:space-y-8">
          <h3 className="text-lg font-medium text-gray-900">Dane wiernego</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <Input 
                label="Imię" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <Input 
                label="Nazwisko" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <Input 
                label="Data urodzenia" 
                name="dateOfBirth" 
                type="date" 
                value={formData.dateOfBirth} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <Input 
                label="Telefon" 
                name="phoneNumber" 
                type="tel" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div>
            <Input 
              label="Email" 
              name="email" 
              type={formData.email ? "email" : "text"} 
              value={formData.email} 
              onChange={(e) => {
                // Jeśli pole jest puste, ustaw jako pusty string, w przeciwnym razie użyj wartości
                const value = e.target.value.trim() === "" ? "" : e.target.value;
                setFormData((prev) => ({ ...prev, email: value }));
              }} 
            />
          </div>
        </div>

        {/* 📌 Sekcja: Adres */}
        <div className="space-y-6 sm:space-y-8">
          <h3 className="text-lg font-medium text-gray-900">Adres</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <Input 
                label="Ulica" 
                name="street" 
                value={formData.address.street} 
                onChange={handleAddressChange} 
                required 
              />
            </div>
            <div>
              <Input 
                label="Numer domu" 
                name="houseNumber" 
                value={formData.address.houseNumber} 
                onChange={handleAddressChange} 
                required 
              />
            </div>
            <div>
              <Input 
                label="Kod pocztowy" 
                name="postalCode" 
                value={formData.address.postalCode} 
                onChange={handleAddressChange} 
                required 
              />
            </div>
            <div>
              <Input 
                label="Miasto" 
                name="city" 
                value={formData.address.city} 
                onChange={handleAddressChange} 
                required 
              />
            </div>
          </div>
        </div>

        {/* 📌 Sekcja: Sakramenty */}
        <div className="space-y-6 sm:space-y-8">
          <h3 className="text-lg font-medium text-gray-900">Sakramenty</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            {formData.sacraments.map((sacrament, index) => (
              <div key={sacrament.type} className="space-y-3">
                <Input
                  label={SACRAMENT_LABELS[sacrament.type]}
                  name={sacrament.type}
                  type="date"
                  value={sacrament.date}
                  onChange={(e) => handleSacramentChange(index, e.target.value)}
                />
                {/* Pola dodatkowe widoczne po uzupełnieniu daty */}
                {sacrament.date && sacrament.type === "baptism" && (
                  <div className="space-y-3">
                    <Input
                      label="Ojciec chrzestny"
                      name={`baptism_godfather_${index}`}
                      value={sacrament.godfather || ""}
                      onChange={(e) => handleSacramentFieldChange(index, "godfather", e.target.value)}
                    />
                    <Input
                      label="Matka chrzestna"
                      name={`baptism_godmother_${index}`}
                      value={sacrament.godmother || ""}
                      onChange={(e) => handleSacramentFieldChange(index, "godmother", e.target.value)}
                    />
                  </div>
                )}
                {sacrament.date && sacrament.type === "confirmation" && (
                  <Input
                    label="Świadek"
                    name={`confirmation_witness_${index}`}
                    value={sacrament.witness || ""}
                    onChange={(e) => handleSacramentFieldChange(index, "witness", e.target.value)}
                  />
                )}
                {sacrament.date && sacrament.type === "marriage" && (
                  <div className="space-y-3">
                    <Input
                      label="Małżonek"
                      name={`marriage_spouse_${index}`}
                      value={sacrament.spouse || ""}
                      onChange={(e) => handleSacramentFieldChange(index, "spouse", e.target.value)}
                    />
                    <Input
                      label="Świadek"
                      name={`marriage_witnessMan_${index}`}
                      value={sacrament.witnessMan || ""}
                      onChange={(e) => handleSacramentFieldChange(index, "witnessMan", e.target.value)}
                    />
                    <Input
                      label="Świadkowa"
                      name={`marriage_witnessWoman_${index}`}
                      value={sacrament.witnessWoman || ""}
                      onChange={(e) => handleSacramentFieldChange(index, "witnessWoman", e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 📌 Sekcja: Uwagi */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Uwagi</h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            className="w-full min-h-[120px] px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-600 border border-neutral/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            rows={3}
          ></textarea>
        </div>

        {/* 📌 Sekcja: Zgon (tylko w edycji i gdy parafianin jest zmarły) */}
        {isEditMode && formData.isDeceased && (
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-lg font-medium text-gray-900">Dane zgonu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <div>
                <Input
                  label="Data zgonu"
                  name="deceasedAt"
                  type="date"
                  value={formData.deceasedAt || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  label="Miejsce zgonu"
                  name="placeOfDeath"
                  value={formData.placeOfDeath || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  label="Nr aktu zgonu"
                  name="deathCertificateNumber"
                  value={formData.deathCertificateNumber || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  label="Wystawca aktu"
                  name="deathCertificateIssuedBy"
                  value={formData.deathCertificateIssuedBy || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  label="Zgłaszający"
                  name="deathReporterName"
                  value={formData.deathReporterName || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  label="Relacja"
                  name="deathReporterRelation"
                  value={formData.deathReporterRelation || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  label="Telefon zgłaszającego"
                  name="deathReporterPhone"
                  value={formData.deathReporterPhone || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Uwagi dot. zgonu</label>
                <textarea
                  name="deathNotes"
                  value={formData.deathNotes || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deathNotes: e.target.value }))}
                  className="w-full min-h-[100px] px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-600 border border-neutral/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* 📌 Sekcja: Pogrzeb (tylko w edycji i gdy parafianin jest zmarły) */}
        {isEditMode && formData.isDeceased && (
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-lg font-medium text-gray-900">Dane pogrzebu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <div>
                <Input
                  label="Data pogrzebu"
                  name="funeralDate"
                  type="date"
                  value={formData.funeralDate || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  label="Miejsce liturgii"
                  name="funeralLocation"
                  value={formData.funeralLocation || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  label="Cmentarz"
                  name="cemeteryName"
                  value={formData.cemeteryName || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="cremation"
                  name="cremation"
                  type="checkbox"
                  checked={!!formData.cremation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cremation: e.target.checked }))}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="cremation" className="text-sm text-gray-700">Kremacja</label>
              </div>
              <div>
                <Input
                  label="Celebrans"
                  name="officiant"
                  value={formData.officiant || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Uwagi dot. pogrzebu</label>
                <textarea
                  name="funeralNotes"
                  value={formData.funeralNotes || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, funeralNotes: e.target.value }))}
                  className="w-full min-h-[100px] px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-600 border border-neutral/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        
      </div>
      
      {/* 📌 Przycisk zapisu */}
      <div className="flex justify-center sm:justify-end pt-6 sm:pt-8">
        <button 
          type="submit" 
          className="w-full sm:w-auto inline-flex justify-center items-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          {isEditMode ? 'Zapisz zmiany' : 'Dodaj Wiernego'}
        </button>
      </div>
    </form>
  );
}