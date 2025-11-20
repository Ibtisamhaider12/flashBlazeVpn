import React, { useState } from 'react';
import type { Country } from '../types';
import { safeStateUpdate, safeCallback, normalizeError } from '../utils/errorHandler';

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry: Country | null;
  onSelect: (country: Country) => void;
  disabled?: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selectedCountry,
  onSelect,
  disabled
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Safe array operations with defensive checks
  const safeCountries = Array.isArray(countries) ? countries : [];
  
  const filteredCountries = safeCountries.filter(country => {
    try {
      if (!country || typeof country !== 'object') return false;
      const name = country.name || '';
      const code = country.code || '';
      const search = searchTerm.toLowerCase();
      return name.toLowerCase().includes(search) || code.toLowerCase().includes(search);
    } catch (error) {
      console.warn('Error filtering country:', error);
      return false;
    }
  });

  const handleSelect = safeCallback((country: Country) => {
    if (!disabled && onSelect && country && typeof country === 'object') {
      try {
        onSelect(country);
      } catch (error) {
        console.error('Error in onSelect callback:', normalizeError(error));
      }
    }
  });

  const handleSearchChange = safeCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value || '';
    safeStateUpdate(setSearchTerm, value);
  });

  return (
    <div className="country-selector">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={disabled}
        />
      </div>
      <div className="country-list">
        {filteredCountries.length === 0 ? (
          <div className="no-results">No countries found</div>
        ) : (
          filteredCountries.map((country) => {
            try {
              if (!country || !country.code) return null;
              return (
                <div
                  key={country.code}
                  className={`country-item ${
                    selectedCountry?.code === country.code ? 'selected' : ''
                  } ${disabled ? 'disabled' : ''}`}
                  onClick={() => handleSelect(country)}
                >
                  <span className="country-flag">{country.flag || ''}</span>
                  <span className="country-name">{country.name || ''}</span>
                  <span className="country-code">{(country.code || '').toUpperCase()}</span>
                </div>
              );
            } catch (error) {
              console.error('Error rendering country item:', error);
              return null;
            }
          })
        )}
      </div>
    </div>
  );
};

export default CountrySelector;

