import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Parishioner {
  _id: string;
  firstName: string;
  lastName: string;
}

interface SelectParishionerProps {
  label: string;
  multiple?: boolean;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

export default function SelectParishioner({
  label,
  multiple = false,
  value,
  onChange,
}: SelectParishionerProps) {
  const [search, setSearch] = useState("");
  const [parishioners, setParishioners] = useState<Parishioner[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get("/api/parishioners").then((res) => setParishioners(res.data));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredParishioners = parishioners.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string) => {
    const selectedParishioner = parishioners.find((p) => p._id === id);

    if (!selectedParishioner) return;

    if (multiple) {
      let selectedIds = Array.isArray(value) ? [...value] : [];
      if (selectedIds.includes(id)) {
        selectedIds = selectedIds.filter((v) => v !== id);
      } else {
        selectedIds.push(id);
      }
      onChange(selectedIds);
      setSearch(selectedIds.map((v) => {
        const p = parishioners.find((p) => p._id === v);
        return p ? `${p.firstName} ${p.lastName}` : "";
      }).join(", "));
    } else {
      onChange(id);
      setSearch(`${selectedParishioner.firstName} ${selectedParishioner.lastName}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col w-full relative" ref={dropdownRef}>
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        placeholder="Wyszukaj parafianina..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="border border-gray-300 rounded-lg p-2 mb-2"
      />
      {isOpen && (
        <div className="absolute top-full left-0 w-full border border-gray-300 rounded-lg p-2 max-h-40 overflow-y-auto bg-white z-10 shadow-md">
          {filteredParishioners.map((p) => (
            <div
              key={p._id}
              onClick={() => handleSelect(p._id)}
              className={`p-2 cursor-pointer ${
                (Array.isArray(value) && value.includes(p._id)) || value === p._id
                  ? "bg-blue-200"
                  : "hover:bg-gray-200"
              }`}
            >
              {p.firstName} {p.lastName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
