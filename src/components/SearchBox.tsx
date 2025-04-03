
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchActivities } from '@/services';
import { useDebounce } from '@/hooks/useDebounce';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchActivities(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.error('Error searching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search activities..."
          value={query}
          onChange={handleInputChange}
          className="w-full sm:w-64 pl-10 pr-10 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-kids-blue/30 focus:bg-white"
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        {query.length > 0 && (
          <button 
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50">
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse">Searching...</div>
            </div>
          )}

          {!isLoading && results.length === 0 && query.trim().length > 1 && (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div>
              <div className="p-2 text-xs text-gray-500 border-b">
                {results.length} results found
              </div>
              <ul>
                {results.map((activity) => (
                  <li key={activity.id} className="border-b last:border-0">
                    <Link
                      to={`/activity/${activity.id}`}
                      className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div 
                        className="w-10 h-10 rounded-md bg-gray-200 flex-shrink-0 mr-3 bg-cover bg-center"
                        style={{ backgroundImage: `url(${activity.image})` }}
                      ></div>
                      <div className="flex-grow">
                        <h4 className="text-gray-800 font-medium text-sm">{activity.title}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">{activity.category}</span>
                          {activity.location && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{activity.location.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
