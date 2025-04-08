"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";

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
      
      if (isEditMode && formData._id) {
        response = await fetch(`/api/parishioners/${formData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedFormData),
        });
      } else {
        response = await fetch("/api/parishioners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedFormData),
        });
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Błąd:", data);
        alert(`Błąd: ${data.message}`);
        return;
      }
  
      if (isEditMode) {
        alert("Parafianin zaktualizowany pomyślnie!");
        router.push("/admin/dashboard/parafianie");
      } else {
        alert("Parafianin dodany pomyślnie!");
        setFormData({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          phoneNumber: "",
          email: "",
          address: { street: "", houseNumber: "", postalCode: "", city: "" },
          sacraments: formData.sacraments.map((s) => ({ ...s, date: "" })),
          notes: "",
        });
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Błąd połączenia z serwerem.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-12">
      {/* 📌 Sekcja: Dane wiernego */}
      <div className="space-y-8">
        <div className="space-y-8">
          <h3 className="text-lg font-medium text-gray-900">Dane wiernego</h3>
          <div className="grid grid-cols-2 gap-8">
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
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* 📌 Sekcja: Adres */}
        <div className="space-y-8">
          <h3 className="text-lg font-medium text-gray-900">Adres</h3>
          <div className="grid grid-cols-2 gap-8">
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
        <div className="space-y-8">
          <h3 className="text-lg font-medium text-gray-900">Sakramenty</h3>
          <div className="grid grid-cols-2 gap-8">
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
            className="w-full min-h-[120px] px-4 py-2.5 text-gray-600 border border-neutral/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            rows={3}
          ></textarea>
        </div>
      </div>

      {/* 📌 Przycisk zapisu */}
      <div className="flex justify-end pt-8">
        <button 
          type="submit" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          {isEditMode ? 'Zapisz zmiany' : 'Dodaj Wiernego'}
        </button>
      </div>
    </form>
  );
}
