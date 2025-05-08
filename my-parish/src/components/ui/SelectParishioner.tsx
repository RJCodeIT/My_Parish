import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

interface Parishioner {
  _id?: string;
  id?: string;
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
  const [selectedMembers, setSelectedMembers] = useState<Parishioner[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get the ID from a parishioner, handling both _id and id formats
  const getParishionerId = useCallback((parishioner: Parishioner): string => {
    return parishioner._id || parishioner.id || '';
  }, []);

  // Update the list of selected members
  const updateSelectedMembers = useCallback((selectedIds: string[], parishionersList: Parishioner[]) => {
    const selected = selectedIds
      .map(id => parishionersList.find(p => getParishionerId(p) === id))
      .filter((p): p is Parishioner => p !== undefined);
    
    setSelectedMembers(selected);
  }, [getParishionerId]);

  // Load parishioners and initialize selected members
  useEffect(() => {
    axios.get("/api/parishioners").then((res) => {
      console.log("Loaded parishioners:", res.data);
      setParishioners(res.data);
      
      // Initialize selected members based on value prop
      if (value) {
        const selectedIds = Array.isArray(value) ? value : [value];
        updateSelectedMembers(selectedIds, res.data);
      }
    });
  }, [value, updateSelectedMembers]);

  // Update selected members when value changes
  useEffect(() => {
    if (value && parishioners.length > 0) {
      const selectedIds = Array.isArray(value) ? value : [value];
      updateSelectedMembers(selectedIds, parishioners);
    }
  }, [value, parishioners, updateSelectedMembers]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter parishioners based on search text
  const filteredParishioners = parishioners.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  // Handle selection of a parishioner
  const handleSelect = useCallback((id: string) => {
    const selectedParishioner = parishioners.find((p) => getParishionerId(p) === id);
    if (!selectedParishioner) return;

    if (multiple) {
      // For multiple selection, toggle the selected state
      let selectedIds = Array.isArray(value) ? [...value] : [];
      if (selectedIds.includes(id)) {
        selectedIds = selectedIds.filter((v) => v !== id);
      } else {
        selectedIds.push(id);
      }
      onChange(selectedIds);
    } else {
      // For single selection, just set the value
      onChange(id);
      setSearch(`${selectedParishioner.firstName} ${selectedParishioner.lastName}`);
      setIsOpen(false);
    }
  }, [parishioners, value, multiple, onChange, getParishionerId]);

  // Remove a selected member (for multiple selection or single selection)
  const handleRemoveMember = useCallback((id: string) => {
    if (multiple && Array.isArray(value)) {
      const newValue = value.filter(v => v !== id);
      onChange(newValue);
    } else if (!multiple) {
      // For single selection, just clear the value
      onChange("");
      setSearch("");
    }
  }, [multiple, value, onChange]);

  return (
    <div className="flex flex-col w-full relative" ref={dropdownRef}>
      <label className="text-sm font-medium mb-1">{label}</label>
      
      {/* Search input */}
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
      
      {/* Selected members display (for both multiple and single selection) */}
      {((multiple && selectedMembers.length > 0) || (!multiple && selectedMembers.length === 1)) && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedMembers.map((member) => (
            <div 
              key={getParishionerId(member)} 
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm"
            >
              <span>{member.firstName} {member.lastName}</span>
              <button 
                onClick={() => handleRemoveMember(getParishionerId(member))}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Dropdown with parishioner options */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full border border-gray-300 rounded-lg p-2 max-h-40 overflow-y-auto bg-white z-10 shadow-md">
          {filteredParishioners.length > 0 ? (
            filteredParishioners.map((p) => {
              const parishionerId = getParishionerId(p);
              const isSelected = Array.isArray(value) 
                ? value.includes(parishionerId) 
                : value === parishionerId;
              
              return (
                <div
                  key={parishionerId}
                  onClick={() => handleSelect(parishionerId)}
                  className={`p-3 mb-2 cursor-pointer rounded ${isSelected ? "bg-blue-200" : "hover:bg-gray-200"}`}
                >
                  {p.firstName} {p.lastName}
                </div>
              );
            })
          ) : (
            <div className="p-2 text-gray-500">Brak wyników</div>
          )}
        </div>
      )}
    </div>
  );
}
