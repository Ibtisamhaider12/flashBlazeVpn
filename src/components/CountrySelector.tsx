import React, { useState } from 'react';
import type { Country } from '../types';

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

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="country-selector">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="country-list">
        {filteredCountries.length === 0 ? (
          <div className="no-results">No countries found</div>
        ) : (
          filteredCountries.map((country) => (
            <div
              key={country.code}
              className={`country-item ${
                selectedCountry?.code === country.code ? 'selected' : ''
              } ${disabled ? 'disabled' : ''}`}
              onClick={() => !disabled && onSelect(country)}
            >
              <span className="country-flag">{country.flag}</span>
              <span className="country-name">{country.name}</span>
              <span className="country-code">{country.code.toUpperCase()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CountrySelector;

