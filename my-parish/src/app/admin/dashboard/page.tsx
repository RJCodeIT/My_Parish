'use client';

import { useState } from 'react';
import SearchBar from '@/components/ui/SearchBar';

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
    // TODO: Implement search functionality for parishioners and groups
    console.log('Searching for:', query);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-2xl font-bold text-primary">Strona główna admina</div>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-neutral/30">
        <h2 className="text-xl font-bold text-primary mb-4">Wyszukiwanie parafian i grup</h2>
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Wyszukaj parafian lub grupy..."
        />
      </div>
    </div>
  );
}