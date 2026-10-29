'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ placeholder = 'Search decorations, themes...', className = '' }: Props) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`flex items-center bg-white rounded-full shadow-lg overflow-hidden max-w-md mx-auto ${className}`}>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        type="text"
        placeholder={placeholder}
        className="flex-1 px-5 py-2.5 text-sm text-gray-800 outline-none bg-transparent"
      />
      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-sm font-semibold transition-colors flex-shrink-0"
      >
        🔍 Search
      </button>
    </form>
  );
}
