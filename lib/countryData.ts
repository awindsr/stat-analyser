// Country statistics data
// Values are approximate and based on 2023-2024 global statistics

export interface CountryStats {
  lifeExpectancy: number;      // Years (50-100)
  airQuality: number;           // Index (0-100, higher is better)
  waterQuality: number;         // Index (0-100, higher is better)
  populationGrowth: number;     // Percentage (0-5%)
  gdp: number;                  // GDP per capita in USD
  carbonEmissions?: number;    // Metric tons of CO2 per capita (calculated)
}

export const countryData: Record<string, CountryStats> = {
  // North America
  "United States": { lifeExpectancy: 78.9, airQuality: 68, waterQuality: 82, populationGrowth: 0.5, gdp: 76398 },
  "Canada": { lifeExpectancy: 82.3, airQuality: 79, waterQuality: 88, populationGrowth: 0.9, gdp: 54966 },
  "Mexico": { lifeExpectancy: 75.1, airQuality: 45, waterQuality: 65, populationGrowth: 0.9, gdp: 11497 },
  
  // Central America & Caribbean
  "Guatemala": { lifeExpectancy: 74.3, airQuality: 52, waterQuality: 58, populationGrowth: 1.8, gdp: 5200 },
  "Honduras": { lifeExpectancy: 75.3, airQuality: 54, waterQuality: 56, populationGrowth: 1.6, gdp: 3123 },
  "Nicaragua": { lifeExpectancy: 74.5, airQuality: 58, waterQuality: 60, populationGrowth: 1.2, gdp: 2151 },
  "Costa Rica": { lifeExpectancy: 80.3, airQuality: 72, waterQuality: 78, populationGrowth: 0.9, gdp: 13434 },
  "Panama": { lifeExpectancy: 78.5, airQuality: 68, waterQuality: 74, populationGrowth: 1.5, gdp: 16993 },
  "Cuba": { lifeExpectancy: 78.8, airQuality: 62, waterQuality: 68, populationGrowth: -0.1, gdp: 9500 },
  "Jamaica": { lifeExpectancy: 74.5, airQuality: 65, waterQuality: 70, populationGrowth: 0.4, gdp: 5582 },
  "Haiti": { lifeExpectancy: 64.0, airQuality: 48, waterQuality: 42, populationGrowth: 1.2, gdp: 1815 },
  "Dominican Republic": { lifeExpectancy: 74.1, airQuality: 55, waterQuality: 64, populationGrowth: 0.9, gdp: 9673 },
  
  // South America
  "Brazil": { lifeExpectancy: 75.9, airQuality: 52, waterQuality: 68, populationGrowth: 0.6, gdp: 10412 },
  "Argentina": { lifeExpectancy: 76.7, airQuality: 58, waterQuality: 72, populationGrowth: 0.9, gdp: 13709 },
  "Chile": { lifeExpectancy: 80.2, airQuality: 62, waterQuality: 76, populationGrowth: 0.8, gdp: 16265 },
  "Colombia": { lifeExpectancy: 77.3, airQuality: 48, waterQuality: 64, populationGrowth: 0.7, gdp: 6630 },
  "Peru": { lifeExpectancy: 76.7, airQuality: 42, waterQuality: 62, populationGrowth: 1.1, gdp: 7772 },
  "Venezuela": { lifeExpectancy: 72.1, airQuality: 44, waterQuality: 58, populationGrowth: -0.5, gdp: 4290 },
  "Ecuador": { lifeExpectancy: 77.0, airQuality: 50, waterQuality: 64, populationGrowth: 1.4, gdp: 6222 },
  "Bolivia": { lifeExpectancy: 71.5, airQuality: 48, waterQuality: 56, populationGrowth: 1.4, gdp: 3552 },
  "Paraguay": { lifeExpectancy: 74.3, airQuality: 60, waterQuality: 66, populationGrowth: 1.2, gdp: 5415 },
  "Uruguay": { lifeExpectancy: 77.9, airQuality: 72, waterQuality: 80, populationGrowth: 0.3, gdp: 17278 },
  "Guyana": { lifeExpectancy: 69.9, airQuality: 70, waterQuality: 68, populationGrowth: 0.5, gdp: 8132 },
  "Suriname": { lifeExpectancy: 71.6, airQuality: 68, waterQuality: 70, populationGrowth: 0.9, gdp: 6154 },
  
  // Europe - Western
  "United Kingdom": { lifeExpectancy: 81.3, airQuality: 65, waterQuality: 84, populationGrowth: 0.5, gdp: 48693 },
  "France": { lifeExpectancy: 82.7, airQuality: 62, waterQuality: 86, populationGrowth: 0.3, gdp: 44408 },
  "Germany": { lifeExpectancy: 81.3, airQuality: 64, waterQuality: 88, populationGrowth: -0.1, gdp: 51204 },
  "Spain": { lifeExpectancy: 83.6, airQuality: 60, waterQuality: 82, populationGrowth: 0.1, gdp: 30996 },
  "Italy": { lifeExpectancy: 83.6, airQuality: 55, waterQuality: 84, populationGrowth: -0.2, gdp: 35657 },
  "Netherlands": { lifeExpectancy: 82.3, airQuality: 68, waterQuality: 90, populationGrowth: 0.4, gdp: 58292 },
  "Belgium": { lifeExpectancy: 81.7, airQuality: 62, waterQuality: 86, populationGrowth: 0.4, gdp: 51768 },
  "Switzerland": { lifeExpectancy: 83.8, airQuality: 80, waterQuality: 92, populationGrowth: 0.7, gdp: 92101 },
  "Austria": { lifeExpectancy: 81.6, airQuality: 72, waterQuality: 88, populationGrowth: 0.4, gdp: 53268 },
  "Portugal": { lifeExpectancy: 81.0, airQuality: 68, waterQuality: 78, populationGrowth: -0.2, gdp: 24515 },
  "Greece": { lifeExpectancy: 81.0, airQuality: 58, waterQuality: 76, populationGrowth: -0.3, gdp: 20876 },
  "Ireland": { lifeExpectancy: 82.3, airQuality: 76, waterQuality: 88, populationGrowth: 1.0, gdp: 99152 },
  "Luxembourg": { lifeExpectancy: 82.7, airQuality: 74, waterQuality: 90, populationGrowth: 1.7, gdp: 126598 },
  
  // Europe - Northern
  "Norway": { lifeExpectancy: 82.8, airQuality: 82, waterQuality: 94, populationGrowth: 0.7, gdp: 89154 },
  "Sweden": { lifeExpectancy: 82.8, airQuality: 78, waterQuality: 92, populationGrowth: 0.6, gdp: 60239 },
  "Denmark": { lifeExpectancy: 81.4, airQuality: 74, waterQuality: 90, populationGrowth: 0.4, gdp: 68300 },
  "Finland": { lifeExpectancy: 81.9, airQuality: 80, waterQuality: 94, populationGrowth: 0.2, gdp: 53654 },
  "Iceland": { lifeExpectancy: 83.0, airQuality: 88, waterQuality: 96, populationGrowth: 0.9, gdp: 74278 },
  
  // Europe - Eastern
  "Poland": { lifeExpectancy: 76.6, airQuality: 48, waterQuality: 74, populationGrowth: -0.1, gdp: 18742 },
  "Czech Republic": { lifeExpectancy: 79.4, airQuality: 52, waterQuality: 78, populationGrowth: 0.2, gdp: 26821 },
  "Hungary": { lifeExpectancy: 76.0, airQuality: 50, waterQuality: 72, populationGrowth: -0.3, gdp: 18728 },
  "Romania": { lifeExpectancy: 75.6, airQuality: 46, waterQuality: 68, populationGrowth: -0.6, gdp: 14861 },
  "Bulgaria": { lifeExpectancy: 74.9, airQuality: 44, waterQuality: 66, populationGrowth: -0.7, gdp: 12221 },
  "Slovakia": { lifeExpectancy: 77.5, airQuality: 54, waterQuality: 76, populationGrowth: 0.1, gdp: 21185 },
  "Croatia": { lifeExpectancy: 78.5, airQuality: 62, waterQuality: 78, populationGrowth: -0.5, gdp: 17685 },
  "Serbia": { lifeExpectancy: 76.0, airQuality: 42, waterQuality: 64, populationGrowth: -0.4, gdp: 9230 },
  "Ukraine": { lifeExpectancy: 72.0, airQuality: 40, waterQuality: 60, populationGrowth: -0.5, gdp: 4836 },
  "Belarus": { lifeExpectancy: 74.8, airQuality: 48, waterQuality: 66, populationGrowth: -0.2, gdp: 7302 },
  "Lithuania": { lifeExpectancy: 75.9, airQuality: 58, waterQuality: 74, populationGrowth: -0.9, gdp: 23723 },
  "Latvia": { lifeExpectancy: 75.3, airQuality: 62, waterQuality: 76, populationGrowth: -1.0, gdp: 21148 },
  "Estonia": { lifeExpectancy: 78.8, airQuality: 68, waterQuality: 82, populationGrowth: -0.1, gdp: 27731 },
  
  // Russia & Neighbors
  "Russia": { lifeExpectancy: 72.6, airQuality: 45, waterQuality: 62, populationGrowth: -0.2, gdp: 14903 },
  "Kazakhstan": { lifeExpectancy: 73.2, airQuality: 42, waterQuality: 58, populationGrowth: 1.1, gdp: 11635 },
  "Uzbekistan": { lifeExpectancy: 71.7, airQuality: 38, waterQuality: 54, populationGrowth: 1.5, gdp: 2255 },
  "Turkmenistan": { lifeExpectancy: 68.2, airQuality: 36, waterQuality: 50, populationGrowth: 1.1, gdp: 8645 },
  "Kyrgyzstan": { lifeExpectancy: 71.5, airQuality: 44, waterQuality: 56, populationGrowth: 1.3, gdp: 1446 },
  "Tajikistan": { lifeExpectancy: 71.1, airQuality: 40, waterQuality: 52, populationGrowth: 1.9, gdp: 1146 },
  "Azerbaijan": { lifeExpectancy: 73.0, airQuality: 42, waterQuality: 58, populationGrowth: 0.8, gdp: 6680 },
  "Armenia": { lifeExpectancy: 75.1, airQuality: 48, waterQuality: 62, populationGrowth: 0.2, gdp: 5574 },
  "Georgia": { lifeExpectancy: 73.8, airQuality: 52, waterQuality: 66, populationGrowth: -0.1, gdp: 6628 },
  
  // Middle East
  "Turkey": { lifeExpectancy: 77.7, airQuality: 42, waterQuality: 64, populationGrowth: 0.7, gdp: 10674 },
  "Saudi Arabia": { lifeExpectancy: 75.1, airQuality: 38, waterQuality: 68, populationGrowth: 1.5, gdp: 31430 },
  "Iran": { lifeExpectancy: 76.7, airQuality: 35, waterQuality: 58, populationGrowth: 0.7, gdp: 5305 },
  "Iraq": { lifeExpectancy: 70.6, airQuality: 32, waterQuality: 48, populationGrowth: 2.3, gdp: 5955 },
  "Israel": { lifeExpectancy: 82.8, airQuality: 58, waterQuality: 78, populationGrowth: 1.6, gdp: 52170 },
  "Jordan": { lifeExpectancy: 74.5, airQuality: 44, waterQuality: 56, populationGrowth: 1.0, gdp: 4520 },
  "Lebanon": { lifeExpectancy: 78.9, airQuality: 42, waterQuality: 62, populationGrowth: -3.1, gdp: 4136 },
  "Syria": { lifeExpectancy: 72.7, airQuality: 36, waterQuality: 48, populationGrowth: 2.5, gdp: 1266 },
  "Yemen": { lifeExpectancy: 66.1, airQuality: 28, waterQuality: 38, populationGrowth: 2.3, gdp: 824 },
  "Oman": { lifeExpectancy: 77.9, airQuality: 52, waterQuality: 70, populationGrowth: 2.0, gdp: 21862 },
  "United Arab Emirates": { lifeExpectancy: 78.0, airQuality: 48, waterQuality: 72, populationGrowth: 0.9, gdp: 49451 },
  "Kuwait": { lifeExpectancy: 75.5, airQuality: 42, waterQuality: 68, populationGrowth: 1.4, gdp: 32373 },
  "Qatar": { lifeExpectancy: 79.3, airQuality: 46, waterQuality: 72, populationGrowth: 1.8, gdp: 83891 },
  "Bahrain": { lifeExpectancy: 77.7, airQuality: 44, waterQuality: 68, populationGrowth: 3.7, gdp: 28916 },
  
  // Africa - North
  "Egypt": { lifeExpectancy: 71.8, airQuality: 32, waterQuality: 52, populationGrowth: 1.7, gdp: 4295 },
  "Libya": { lifeExpectancy: 72.9, airQuality: 38, waterQuality: 54, populationGrowth: 1.4, gdp: 6357 },
  "Tunisia": { lifeExpectancy: 76.7, airQuality: 48, waterQuality: 62, populationGrowth: 0.9, gdp: 3807 },
  "Algeria": { lifeExpectancy: 76.9, airQuality: 42, waterQuality: 58, populationGrowth: 1.7, gdp: 4245 },
  "Morocco": { lifeExpectancy: 76.9, airQuality: 46, waterQuality: 60, populationGrowth: 1.2, gdp: 3795 },
  
  // Africa - West
  "Nigeria": { lifeExpectancy: 54.7, airQuality: 28, waterQuality: 38, populationGrowth: 2.5, gdp: 2184 },
  "Ghana": { lifeExpectancy: 64.1, airQuality: 38, waterQuality: 48, populationGrowth: 2.1, gdp: 2445 },
  "Senegal": { lifeExpectancy: 67.9, airQuality: 42, waterQuality: 52, populationGrowth: 2.7, gdp: 1607 },
  "Mali": { lifeExpectancy: 59.3, airQuality: 36, waterQuality: 42, populationGrowth: 3.0, gdp: 916 },
  "Niger": { lifeExpectancy: 62.4, airQuality: 38, waterQuality: 40, populationGrowth: 3.8, gdp: 590 },
  "Burkina Faso": { lifeExpectancy: 61.6, airQuality: 34, waterQuality: 42, populationGrowth: 2.9, gdp: 893 },
  "Ivory Coast": { lifeExpectancy: 57.8, airQuality: 32, waterQuality: 44, populationGrowth: 2.5, gdp: 2549 },
  
  // Africa - East
  "Ethiopia": { lifeExpectancy: 66.6, airQuality: 34, waterQuality: 42, populationGrowth: 2.6, gdp: 1020 },
  "Kenya": { lifeExpectancy: 66.7, airQuality: 38, waterQuality: 46, populationGrowth: 2.2, gdp: 2099 },
  "Tanzania": { lifeExpectancy: 65.5, airQuality: 40, waterQuality: 48, populationGrowth: 3.0, gdp: 1192 },
  "Uganda": { lifeExpectancy: 63.4, airQuality: 36, waterQuality: 44, populationGrowth: 3.3, gdp: 1015 },
  "Somalia": { lifeExpectancy: 57.5, airQuality: 42, waterQuality: 32, populationGrowth: 2.9, gdp: 461 },
  "Sudan": { lifeExpectancy: 65.3, airQuality: 30, waterQuality: 40, populationGrowth: 2.4, gdp: 1016 },
  "South Sudan": { lifeExpectancy: 57.9, airQuality: 38, waterQuality: 34, populationGrowth: 1.2, gdp: 768 },
  
  // Africa - Southern
  "South Africa": { lifeExpectancy: 64.1, airQuality: 46, waterQuality: 62, populationGrowth: 1.2, gdp: 6994 },
  "Zimbabwe": { lifeExpectancy: 61.5, airQuality: 42, waterQuality: 48, populationGrowth: 1.5, gdp: 1464 },
  "Botswana": { lifeExpectancy: 69.6, airQuality: 56, waterQuality: 64, populationGrowth: 2.0, gdp: 7348 },
  "Namibia": { lifeExpectancy: 63.7, airQuality: 52, waterQuality: 58, populationGrowth: 1.9, gdp: 4729 },
  "Mozambique": { lifeExpectancy: 60.2, airQuality: 40, waterQuality: 42, populationGrowth: 2.9, gdp: 528 },
  "Madagascar": { lifeExpectancy: 67.0, airQuality: 48, waterQuality: 46, populationGrowth: 2.7, gdp: 515 },
  
  // Asia - East
  "China": { lifeExpectancy: 78.2, airQuality: 35, waterQuality: 58, populationGrowth: 0.2, gdp: 12720 },
  "Japan": { lifeExpectancy: 84.8, airQuality: 72, waterQuality: 90, populationGrowth: -0.5, gdp: 33815 },
  "South Korea": { lifeExpectancy: 83.6, airQuality: 52, waterQuality: 78, populationGrowth: 0.1, gdp: 34165 },
  "North Korea": { lifeExpectancy: 72.0, airQuality: 38, waterQuality: 48, populationGrowth: 0.4, gdp: 1300 },
  "Mongolia": { lifeExpectancy: 69.9, airQuality: 32, waterQuality: 52, populationGrowth: 1.5, gdp: 4339 },
  
  // Asia - Southeast
  "Indonesia": { lifeExpectancy: 71.7, airQuality: 38, waterQuality: 52, populationGrowth: 0.9, gdp: 4788 },
  "Thailand": { lifeExpectancy: 77.7, airQuality: 42, waterQuality: 62, populationGrowth: 0.2, gdp: 7066 },
  "Vietnam": { lifeExpectancy: 75.4, airQuality: 36, waterQuality: 56, populationGrowth: 0.8, gdp: 4164 },
  "Philippines": { lifeExpectancy: 69.3, airQuality: 34, waterQuality: 54, populationGrowth: 1.5, gdp: 3499 },
  "Malaysia": { lifeExpectancy: 76.2, airQuality: 44, waterQuality: 66, populationGrowth: 1.1, gdp: 12451 },
  "Singapore": { lifeExpectancy: 83.6, airQuality: 68, waterQuality: 88, populationGrowth: 0.1, gdp: 82808 },
  "Myanmar": { lifeExpectancy: 67.1, airQuality: 38, waterQuality: 48, populationGrowth: 0.7, gdp: 1400 },
  "Cambodia": { lifeExpectancy: 69.8, airQuality: 40, waterQuality: 50, populationGrowth: 1.4, gdp: 1785 },
  "Laos": { lifeExpectancy: 68.1, airQuality: 42, waterQuality: 52, populationGrowth: 1.5, gdp: 2535 },
  
  // Asia - South
  "India": { lifeExpectancy: 70.4, airQuality: 28, waterQuality: 48, populationGrowth: 0.8, gdp: 2389 },
  "Pakistan": { lifeExpectancy: 67.3, airQuality: 26, waterQuality: 42, populationGrowth: 1.9, gdp: 1568 },
  "Bangladesh": { lifeExpectancy: 72.6, airQuality: 24, waterQuality: 44, populationGrowth: 1.0, gdp: 2457 },
  "Sri Lanka": { lifeExpectancy: 76.4, airQuality: 46, waterQuality: 58, populationGrowth: 0.5, gdp: 3474 },
  "Nepal": { lifeExpectancy: 70.8, airQuality: 32, waterQuality: 48, populationGrowth: 1.8, gdp: 1336 },
  "Bhutan": { lifeExpectancy: 71.8, airQuality: 68, waterQuality: 72, populationGrowth: 1.1, gdp: 3122 },
  "Afghanistan": { lifeExpectancy: 64.8, airQuality: 30, waterQuality: 36, populationGrowth: 2.3, gdp: 368 },
  
  // Oceania
  "Australia": { lifeExpectancy: 83.4, airQuality: 76, waterQuality: 90, populationGrowth: 1.3, gdp: 64674 },
  "New Zealand": { lifeExpectancy: 82.3, airQuality: 82, waterQuality: 92, populationGrowth: 1.6, gdp: 48781 },
  "Papua New Guinea": { lifeExpectancy: 64.5, airQuality: 58, waterQuality: 42, populationGrowth: 1.9, gdp: 2804 },
  "Fiji": { lifeExpectancy: 67.4, airQuality: 70, waterQuality: 68, populationGrowth: 0.6, gdp: 5740 },
  
  // Additional European countries
  "Albania": { lifeExpectancy: 78.6, airQuality: 48, waterQuality: 64, populationGrowth: -0.2, gdp: 6494 },
  "Bosnia and Herzegovina": { lifeExpectancy: 77.4, airQuality: 44, waterQuality: 62, populationGrowth: -0.6, gdp: 7032 },
  "North Macedonia": { lifeExpectancy: 75.8, airQuality: 42, waterQuality: 60, populationGrowth: -0.1, gdp: 6722 },
  "Montenegro": { lifeExpectancy: 76.9, airQuality: 52, waterQuality: 68, populationGrowth: 0.0, gdp: 9327 },
  "Slovenia": { lifeExpectancy: 81.3, airQuality: 64, waterQuality: 82, populationGrowth: 0.2, gdp: 29200 },
  "Moldova": { lifeExpectancy: 71.9, airQuality: 46, waterQuality: 58, populationGrowth: -0.2, gdp: 5189 },
  
  // Additional Asian countries
  "Taiwan": { lifeExpectancy: 80.7, airQuality: 54, waterQuality: 74, populationGrowth: 0.1, gdp: 33775 },
  "Hong Kong": { lifeExpectancy: 85.5, airQuality: 58, waterQuality: 82, populationGrowth: 0.7, gdp: 49660 },
  "Macau": { lifeExpectancy: 84.6, airQuality: 56, waterQuality: 78, populationGrowth: 1.4, gdp: 46177 },
  "Brunei": { lifeExpectancy: 75.9, airQuality: 62, waterQuality: 74, populationGrowth: 1.0, gdp: 31449 },
  "Timor-Leste": { lifeExpectancy: 69.5, airQuality: 52, waterQuality: 46, populationGrowth: 1.8, gdp: 1381 },
  "Maldives": { lifeExpectancy: 79.9, airQuality: 72, waterQuality: 76, populationGrowth: 1.8, gdp: 11818 },
};

// Get country data or return default values
export const getCountryData = (countryName: string): CountryStats => {
  return countryData[countryName] || {
    lifeExpectancy: 75,
    airQuality: 50,
    waterQuality: 50,
    populationGrowth: 2,
    gdp: 25000
  };
};

// Get list of all available countries
export const getAvailableCountries = (): string[] => {
  return Object.keys(countryData).sort();
};
