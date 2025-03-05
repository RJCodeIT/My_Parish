"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";

const SACRAMENT_LABELS: { [key: string]: string } = {
  baptism: "Chrzest",
  firstCommunion: "Pierwsza Komunia",
  confirmation: "Bierzmowanie",
  marriage: "Małżeństwo",
  holyOrders: "Święcenia Kapłańskie",
  anointingOfTheSick: "Namaszczenie Chorych",
};

export default function ParishionersForm() {
  const [formData, setFormData] = useState({
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
  });

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
      const response = await fetch("/api/parishioners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedFormData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Błąd:", data);
        alert(`Błąd: ${data.message}`);
        return;
      }
  
      alert("Parishioner added successfully!");
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
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Błąd połączenia z serwerem.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md space-y-6">

      {/* 📌 Sekcja: Dane wiernego */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Dane wiernego</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Imię" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <Input label="Nazwisko" name="lastName" value={formData.lastName} onChange={handleChange} required />
          <Input label="Data urodzenia" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
          <Input label="Telefon" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} />
        </div>
        <div className="mt-4">
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        </div>
      </div>

      {/* 📌 Sekcja: Adres */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Adres</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Ulica" name="street" value={formData.address.street} onChange={handleAddressChange} required />
          <Input label="Numer domu" name="houseNumber" value={formData.address.houseNumber} onChange={handleAddressChange} required />
          <Input label="Kod pocztowy" name="postalCode" value={formData.address.postalCode} onChange={handleAddressChange} required />
          <Input label="Miasto" name="city" value={formData.address.city} onChange={handleAddressChange} required />
        </div>
      </div>

      {/* 📌 Sekcja: Sakramenty */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Sakramenty</h3>
        <div className="grid grid-cols-2 gap-4">
          {formData.sacraments.map((sacrament, index) => (
            <Input
              key={sacrament.type}
              label={SACRAMENT_LABELS[sacrament.type]}
              name={sacrament.type}
              type="date"
              value={sacrament.date}
              onChange={(e) => handleSacramentChange(index, e.target.value)}
            />
          ))}
        </div>
      </div>

      {/* 📌 Sekcja: Uwagi */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Uwagi</h3>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        ></textarea>
      </div>

      {/* 📌 Przycisk zapisu */}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
        Dodaj Wiernego
      </button>
    </form>
  );
}
