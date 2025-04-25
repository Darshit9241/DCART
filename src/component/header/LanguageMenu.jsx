import React from 'react';

export default function LanguageMenu({ 
  selectedLanguage, 
  selectedCurrency, 
  setSelectedLanguage, 
  setSelectedCurrency, 
  closeMenu 
}) {
  // Available languages and currencies
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ];

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    closeMenu();
    // Here you would implement actual language change logic
    // For example, dispatch an action to update app language
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    closeMenu();
    // Here you would implement actual currency change logic
    // For example, dispatch an action to update app currency
  };

  return (
    <div className="absolute left-0 mt-3 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-fadeIn">
      <div className="py-2 px-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">Select Language</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {languages.map(language => (
            <button
              key={language.code}
              className={`text-left px-3 py-1.5 text-sm rounded hover:bg-orange-50 ${selectedLanguage === language.name ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-700'}`}
              onClick={() => handleLanguageChange(language.name)}
            >
              {language.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="py-2 px-4">
        <h3 className="text-sm font-medium text-gray-500">Select Currency</h3>
        <div className="mt-2 space-y-1">
          {currencies.map(currency => (
            <button
              key={currency.code}
              className={`w-full text-left px-3 py-1.5 text-sm rounded hover:bg-orange-50 ${selectedCurrency === currency.code ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-700'}`}
              onClick={() => handleCurrencyChange(currency.code)}
            >
              <span className="inline-block w-8">{currency.symbol}</span>
              {currency.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 