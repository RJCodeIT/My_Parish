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
  anointingOfTheSick: "Namaszczenie Chorych",
};

interface Sacrament {
  type: string;
  date: string;
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
        // Convert date strings to proper format for date inputs
        dateOfBirth: initialData.dateOfBirth ? formatDateForInput(initialData.dateOfBirth) : "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const filteredSacraments = formData.sacraments.filter((s) => s.date !== "");
  
    const formattedFormData = {
      ...formData,
      sacraments: filteredSacraments,
    };
  
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
              <div key={sacrament.type}>
                <Input
                  label={SACRAMENT_LABELS[sacrament.type]}
                  name={sacrament.type}
                  type="date"
                  value={sacrament.date}
                  onChange={(e) => handleSacramentChange(index, e.target.value)}
                />
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