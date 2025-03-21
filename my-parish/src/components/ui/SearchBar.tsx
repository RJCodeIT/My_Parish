import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Szukaj...' }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-lg border border-neutral/30 shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral/70 w-5 h-5" />
      </div>
    </div>
  );
}
