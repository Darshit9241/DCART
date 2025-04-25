import React, { useState, useEffect, forwardRef } from 'react';
import { BiSearch } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";

const SearchModal = forwardRef(({ closeModal, navigate }, ref) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState(['laptops', 'smartphones', 'headphones', 'watches', 'cameras']);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        const parsedSearches = JSON.parse(savedSearches);
        setRecentSearches(parsedSearches);
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  // Save search to recent searches
  const saveToRecentSearches = (query) => {
    if (!query) return;
    
    const searches = [...recentSearches];
    // Remove if already exists
    const existingIndex = searches.findIndex(s => s === query);
    if (existingIndex !== -1) {
      searches.splice(existingIndex, 1);
    }
    // Add to beginning of array
    searches.unshift(query);
    // Keep only the most recent 5 searches
    setRecentSearches(searches.slice(0, 5));
    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(searches.slice(0, 5)));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Save search query to recent searches
      saveToRecentSearches(searchQuery.trim());
      
      // Mock search functionality - in a real app, this would call an API
      setTimeout(() => {
        setIsSearching(false);
        // Close the modal
        closeModal();
        // Navigate to search results page with query parameter
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        // Reset search query
        setSearchQuery("");
      }, 500);
    }
  };

  // Voice search functionality
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser');
      return;
    }
    
    setIsVoiceSearchActive(true);
    
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      // Auto-search after voice input
      setTimeout(() => {
        setIsVoiceSearchActive(false);
        handleSearch({ preventDefault: () => {} });
      }, 500);
    };
    
    recognition.onerror = (event) => {
      setIsVoiceSearchActive(false);
      console.error('Speech recognition error', event.error);
    };
    
    recognition.onend = () => {
      setIsVoiceSearchActive(false);
    };
    
    recognition.start();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
      <div 
        ref={ref} 
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-11/12 max-w-lg mx-4 animate-slide-in-up"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Search Products</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 p-2 -m-2"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <div className="absolute right-3 top-3 flex items-center space-x-2">
            {/* Voice Search Button */}
            <button 
              type="button"
              onClick={handleVoiceSearch}
              className={`text-gray-500 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 ${isVoiceSearchActive ? 'text-red-500 animate-pulse' : ''}`}
            >
              <FaMicrophone className="h-5 w-5" />
            </button>
            
            {/* Search Button */}
            <button 
              type="submit"
              className="text-gray-500 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400"
            >
              {isSearching ? (
                <div className="h-6 w-6 border-2 border-t-orange-500 border-gray-200 rounded-full animate-spin" />
              ) : (
                <BiSearch className="h-6 w-6" />
              )}
            </button>
          </div>
        </form>
        
        {/* Recent & Popular Searches */}
        <div className="mt-5 space-y-4">
          {recentSearches.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <button
                    key={`recent-${index}`}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
                    onClick={() => {
                      setSearchQuery(term);
                      handleSearch({ preventDefault: () => {} });
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term, index) => (
                <button
                  key={`popular-${index}`}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
                  onClick={() => {
                    setSearchQuery(term);
                    handleSearch({ preventDefault: () => {} });
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {searchResults.length > 0 && (
          <div className="mt-4 max-h-60 overflow-y-auto border-t border-gray-100 dark:border-gray-700 pt-2">
            {searchResults.map((item, index) => (
              <div 
                key={index} 
                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                onClick={() => {
                  closeModal();
                  navigate(`/product/${item.id}`);
                }}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-md mr-3 flex-shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="object-cover w-full h-full rounded-md" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">${item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default SearchModal; 