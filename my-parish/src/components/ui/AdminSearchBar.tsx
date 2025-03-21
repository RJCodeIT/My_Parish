'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface AdminSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function AdminSearchBar({ onSearch, placeholder }: AdminSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="w-full mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-lg border border-neutral-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
      </div>
    </div>
  );
}
