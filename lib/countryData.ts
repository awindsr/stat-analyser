// Country statistics data
// Values are approximate and based on 2023-2024 global statistics

export interface CountryStats {
  lifeExpectancy: number;      // Years (50-100)
  airQuality: number;           // Index (0-100, higher is better)
  waterQuality: number;         // Index (0-100, higher is better)
  populationGrowth: number;     // Percentage (0-5%)
  gdp: number;                  // GDP per capita in USD
  carbonEmissions?: number;     // Metric tons of CO2 per capita (calculated)
}

export const countryData: Record<string, CountryStats> = {
  // North America
  "United States": { lifeExpectancy: 78.9, airQuality: 68, waterQuality: 82, populationGrowth: 0.5, gdp: 76398, carbonEmissions: 14.9 },
  "Canada": { lifeExpectancy: 82.3, airQuality: 79, waterQuality: 88, populationGrowth: 0.9, gdp: 54966, carbonEmissions: 14.2 },
  "Mexico": { lifeExpectancy: 75.1, airQuality: 45, waterQuality: 65, populationGrowth: 0.9, gdp: 11497, carbonEmissions: 3.7 },
  
  // Central America & Caribbean
  "Guatemala": { lifeExpectancy: 74.3, airQuality: 52, waterQuality: 58, populationGrowth: 1.8, gdp: 5200, carbonEmissions: 1.1 },
  "Honduras": { lifeExpectancy: 75.3, airQuality: 54, waterQuality: 56, populationGrowth: 1.6, gdp: 3123, carbonEmissions: 1.0 },
  "Nicaragua": { lifeExpectancy: 74.5, airQuality: 58, waterQuality: 60, populationGrowth: 1.2, gdp: 2151, carbonEmissions: 0.8 },
  "Costa Rica": { lifeExpectancy: 80.3, airQuality: 72, waterQuality: 78, populationGrowth: 0.9, gdp: 13434, carbonEmissions: 1.7 },
  "Panama": { lifeExpectancy: 78.5, airQuality: 68, waterQuality: 74, populationGrowth: 1.5, gdp: 16993, carbonEmissions: 2.6 },
  "Cuba": { lifeExpectancy: 78.8, airQuality: 62, waterQuality: 68, populationGrowth: -0.1, gdp: 9500, carbonEmissions: 1.9 },
  "Jamaica": { lifeExpectancy: 74.5, airQuality: 65, waterQuality: 70, populationGrowth: 0.4, gdp: 5582, carbonEmissions: 2.3 },
  "Haiti": { lifeExpectancy: 64.0, airQuality: 48, waterQuality: 42, populationGrowth: 1.2, gdp: 1815, carbonEmissions: 0.3 },
  "Dominican Republic": { lifeExpectancy: 74.1, airQuality: 55, waterQuality: 64, populationGrowth: 0.9, gdp: 9673, carbonEmissions: 2.1 },
  
  // South America
  "Brazil": { lifeExpectancy: 75.9, airQuality: 52, waterQuality: 68, populationGrowth: 0.6, gdp: 10412, carbonEmissions: 2.2 },
  "Argentina": { lifeExpectancy: 76.7, airQuality: 58, waterQuality: 72, populationGrowth: 0.9, gdp: 13709, carbonEmissions: 4.1 },
  "Chile": { lifeExpectancy: 80.2, airQuality: 62, waterQuality: 76, populationGrowth: 0.8, gdp: 16265, carbonEmissions: 4.6 },
  "Colombia": { lifeExpectancy: 77.3, airQuality: 48, waterQuality: 64, populationGrowth: 0.7, gdp: 6630, carbonEmissions: 1.8 },
  "Peru": { lifeExpectancy: 76.7, airQuality: 42, waterQuality: 62, populationGrowth: 1.1, gdp: 7772, carbonEmissions: 1.9 },
  "Venezuela": { lifeExpectancy: 72.1, airQuality: 44, waterQuality: 58, populationGrowth: -0.5, gdp: 4290, carbonEmissions: 3.2 },
  "Ecuador": { lifeExpectancy: 77.0, airQuality: 50, waterQuality: 64, populationGrowth: 1.4, gdp: 6222, carbonEmissions: 2.3 },
  "Bolivia": { lifeExpectancy: 71.5, airQuality: 48, waterQuality: 56, populationGrowth: 1.4, gdp: 3552, carbonEmissions: 1.8 },
  "Paraguay": { lifeExpectancy: 74.3, airQuality: 60, waterQuality: 66, populationGrowth: 1.2, gdp: 5415, carbonEmissions: 1.2 },
  "Uruguay": { lifeExpectancy: 77.9, airQuality: 72, waterQuality: 80, populationGrowth: 0.3, gdp: 17278, carbonEmissions: 2.3 },
  "Guyana": { lifeExpectancy: 69.9, airQuality: 70, waterQuality: 68, populationGrowth: 0.5, gdp: 8132, carbonEmissions: 4.3 },
  "Suriname": { lifeExpectancy: 71.6, airQuality: 68, waterQuality: 70, populationGrowth: 0.9, gdp: 6154, carbonEmissions: 3.6 },
  
  // Europe - Western
  "United Kingdom": { lifeExpectancy: 81.3, airQuality: 65, waterQuality: 84, populationGrowth: 0.5, gdp: 48693, carbonEmissions: 5.2 },
  "France": { lifeExpectancy: 82.7, airQuality: 62, waterQuality: 86, populationGrowth: 0.3, gdp: 44408, carbonEmissions: 4.6 },
  "Germany": { lifeExpectancy: 81.3, airQuality: 64, waterQuality: 88, populationGrowth: -0.1, gdp: 51204, carbonEmissions: 7.9 },
  "Spain": { lifeExpectancy: 83.6, airQuality: 60, waterQuality: 82, populationGrowth: 0.1, gdp: 30996, carbonEmissions: 5.0 },
  "Italy": { lifeExpectancy: 83.6, airQuality: 55, waterQuality: 84, populationGrowth: -0.2, gdp: 35657, carbonEmissions: 5.5 },
  "Netherlands": { lifeExpectancy: 82.3, airQuality: 68, waterQuality: 90, populationGrowth: 0.4, gdp: 58292, carbonEmissions: 7.8 },
  "Belgium": { lifeExpectancy: 81.7, airQuality: 62, waterQuality: 86, populationGrowth: 0.4, gdp: 51768, carbonEmissions: 7.6 },
  "Switzerland": { lifeExpectancy: 83.8, airQuality: 80, waterQuality: 92, populationGrowth: 0.7, gdp: 92101, carbonEmissions: 4.0 },
  "Austria": { lifeExpectancy: 81.6, airQuality: 72, waterQuality: 88, populationGrowth: 0.4, gdp: 53268, carbonEmissions: 6.8 },
  "Portugal": { lifeExpectancy: 81.0, airQuality: 68, waterQuality: 78, populationGrowth: -0.2, gdp: 24515, carbonEmissions: 4.1 },
  "Greece": { lifeExpectancy: 81.0, airQuality: 58, waterQuality: 76, populationGrowth: -0.3, gdp: 20876, carbonEmissions: 5.7 },
  "Ireland": { lifeExpectancy: 82.3, airQuality: 76, waterQuality: 88, populationGrowth: 1.0, gdp: 99152, carbonEmissions: 7.1 },
  "Luxembourg": { lifeExpectancy: 82.7, airQuality: 74, waterQuality: 90, populationGrowth: 1.7, gdp: 126598, carbonEmissions: 11.6 },
  
  // Europe - Northern
  "Norway": { lifeExpectancy: 82.8, airQuality: 82, waterQuality: 94, populationGrowth: 0.7, gdp: 89154, carbonEmissions: 7.5 },
  "Sweden": { lifeExpectancy: 82.8, airQuality: 78, waterQuality: 92, populationGrowth: 0.6, gdp: 60239, carbonEmissions: 3.6 },
  "Denmark": { lifeExpectancy: 81.4, airQuality: 74, waterQuality: 90, populationGrowth: 0.4, gdp: 68300, carbonEmissions: 5.3 },
  "Finland": { lifeExpectancy: 81.9, airQuality: 80, waterQuality: 94, populationGrowth: 0.2, gdp: 53654, carbonEmissions: 6.8 },
  "Iceland": { lifeExpectancy: 83.0, airQuality: 88, waterQuality: 96, populationGrowth: 0.9, gdp: 74278, carbonEmissions: 10.3 },
  
  // Europe - Eastern
  "Poland": { lifeExpectancy: 76.6, airQuality: 48, waterQuality: 74, populationGrowth: -0.1, gdp: 18742, carbonEmissions: 8.1 },
  "Czech Republic": { lifeExpectancy: 79.4, airQuality: 52, waterQuality: 78, populationGrowth: 0.2, gdp: 26821, carbonEmissions: 9.3 },
  "Hungary": { lifeExpectancy: 76.0, airQuality: 50, waterQuality: 72, populationGrowth: -0.3, gdp: 18728, carbonEmissions: 4.9 },
  "Romania": { lifeExpectancy: 75.6, airQuality: 46, waterQuality: 68, populationGrowth: -0.6, gdp: 14861, carbonEmissions: 3.7 },
  "Bulgaria": { lifeExpectancy: 74.9, airQuality: 44, waterQuality: 66, populationGrowth: -0.7, gdp: 12221, carbonEmissions: 5.8 },
  "Slovakia": { lifeExpectancy: 77.5, airQuality: 54, waterQuality: 76, populationGrowth: 0.1, gdp: 21185, carbonEmissions: 6.2 },
  "Croatia": { lifeExpectancy: 78.5, airQuality: 62, waterQuality: 78, populationGrowth: -0.5, gdp: 17685, carbonEmissions: 4.2 },
  "Serbia": { lifeExpectancy: 76.0, airQuality: 42, waterQuality: 64, populationGrowth: -0.4, gdp: 9230, carbonEmissions: 5.5 },
  "Ukraine": { lifeExpectancy: 72.0, airQuality: 40, waterQuality: 60, populationGrowth: -0.5, gdp: 4836, carbonEmissions: 3.3 },
  "Belarus": { lifeExpectancy: 74.8, airQuality: 48, waterQuality: 66, populationGrowth: -0.2, gdp: 7302, carbonEmissions: 6.2 },
  "Lithuania": { lifeExpectancy: 75.9, airQuality: 58, waterQuality: 74, populationGrowth: -0.9, gdp: 23723, carbonEmissions: 4.5 },
  "Latvia": { lifeExpectancy: 75.3, airQuality: 62, waterQuality: 76, populationGrowth: -1.0, gdp: 21148, carbonEmissions: 3.8 },
  "Estonia": { lifeExpectancy: 78.8, airQuality: 68, waterQuality: 82, populationGrowth: -0.1, gdp: 27731, carbonEmissions: 7.4 },
  
  // Russia & Neighbors
  "Russia": { lifeExpectancy: 72.6, airQuality: 45, waterQuality: 62, populationGrowth: -0.2, gdp: 14903, carbonEmissions: 11.4 },
  "Kazakhstan": { lifeExpectancy: 73.2, airQuality: 42, waterQuality: 58, populationGrowth: 1.1, gdp: 11635, carbonEmissions: 13.8 },
  "Uzbekistan": { lifeExpectancy: 71.7, airQuality: 38, waterQuality: 54, populationGrowth: 1.5, gdp: 2255, carbonEmissions: 3.5 },
  "Turkmenistan": { lifeExpectancy: 68.2, airQuality: 36, waterQuality: 50, populationGrowth: 1.1, gdp: 8645, carbonEmissions: 11.1 },
  "Kyrgyzstan": { lifeExpectancy: 71.5, airQuality: 44, waterQuality: 56, populationGrowth: 1.3, gdp: 1446, carbonEmissions: 1.6 },
  "Tajikistan": { lifeExpectancy: 71.1, airQuality: 40, waterQuality: 52, populationGrowth: 1.9, gdp: 1146, carbonEmissions: 1.1 },
  "Azerbaijan": { lifeExpectancy: 73.0, airQuality: 42, waterQuality: 58, populationGrowth: 0.8, gdp: 6680, carbonEmissions: 3.7 },
  "Armenia": { lifeExpectancy: 75.1, airQuality: 48, waterQuality: 62, populationGrowth: 0.2, gdp: 5574, carbonEmissions: 2.2 },
  "Georgia": { lifeExpectancy: 73.8, airQuality: 52, waterQuality: 66, populationGrowth: -0.1, gdp: 6628, carbonEmissions: 2.9 },
  
  // Middle East
  "Turkey": { lifeExpectancy: 77.7, airQuality: 42, waterQuality: 64, populationGrowth: 0.7, gdp: 10674, carbonEmissions: 5.1 },
  "Saudi Arabia": { lifeExpectancy: 75.1, airQuality: 38, waterQuality: 68, populationGrowth: 1.5, gdp: 31430, carbonEmissions: 18.2 },
  "Iran": { lifeExpectancy: 76.7, airQuality: 35, waterQuality: 58, populationGrowth: 0.7, gdp: 5305, carbonEmissions: 7.8 },
  "Iraq": { lifeExpectancy: 70.6, airQuality: 32, waterQuality: 48, populationGrowth: 2.3, gdp: 5955, carbonEmissions: 4.6 },
  "Israel": { lifeExpectancy: 82.8, airQuality: 58, waterQuality: 78, populationGrowth: 1.6, gdp: 52170, carbonEmissions: 6.2 },
  "Jordan": { lifeExpectancy: 74.5, airQuality: 44, waterQuality: 56, populationGrowth: 1.0, gdp: 4520, carbonEmissions: 2.2 },
  "Lebanon": { lifeExpectancy: 78.9, airQuality: 42, waterQuality: 62, populationGrowth: -3.1, gdp: 4136, carbonEmissions: 4.3 },
  "Syria": { lifeExpectancy: 72.7, airQuality: 36, waterQuality: 48, populationGrowth: 2.5, gdp: 1266, carbonEmissions: 1.2 },
  "Yemen": { lifeExpectancy: 66.1, airQuality: 28, waterQuality: 38, populationGrowth: 2.3, gdp: 824, carbonEmissions: 0.4 },
  "Oman": { lifeExpectancy: 77.9, airQuality: 52, waterQuality: 70, populationGrowth: 2.0, gdp: 21862, carbonEmissions: 15.4 },
  "United Arab Emirates": { lifeExpectancy: 78.0, airQuality: 48, waterQuality: 72, populationGrowth: 0.9, gdp: 49451, carbonEmissions: 25.8 },
  "Kuwait": { lifeExpectancy: 75.5, airQuality: 42, waterQuality: 68, populationGrowth: 1.4, gdp: 32373, carbonEmissions: 23.5 },
  "Qatar": { lifeExpectancy: 79.3, airQuality: 46, waterQuality: 72, populationGrowth: 1.8, gdp: 83891, carbonEmissions: 37.6 },
  "Bahrain": { lifeExpectancy: 77.7, airQuality: 44, waterQuality: 68, populationGrowth: 3.7, gdp: 28916, carbonEmissions: 23.4 },
  
  // Africa - North
  "Egypt": { lifeExpectancy: 71.8, airQuality: 32, waterQuality: 52, populationGrowth: 1.7, gdp: 4295, carbonEmissions: 2.3 },
  "Libya": { lifeExpectancy: 72.9, airQuality: 38, waterQuality: 54, populationGrowth: 1.4, gdp: 6357, carbonEmissions: 9.2 },
  "Tunisia": { lifeExpectancy: 76.7, airQuality: 48, waterQuality: 62, populationGrowth: 0.9, gdp: 3807, carbonEmissions: 2.7 },
  "Algeria": { lifeExpectancy: 76.9, airQuality: 42, waterQuality: 58, populationGrowth: 1.7, gdp: 4245, carbonEmissions: 3.9 },
  "Morocco": { lifeExpectancy: 76.9, airQuality: 46, waterQuality: 60, populationGrowth: 1.2, gdp: 3795, carbonEmissions: 1.8 },
  
  // Africa - West
  "Nigeria": { lifeExpectancy: 54.7, airQuality: 28, waterQuality: 38, populationGrowth: 2.5, gdp: 2184, carbonEmissions: 0.6 },
  "Ghana": { lifeExpectancy: 64.1, airQuality: 38, waterQuality: 48, populationGrowth: 2.1, gdp: 2445, carbonEmissions: 0.6 },
  "Senegal": { lifeExpectancy: 67.9, airQuality: 42, waterQuality: 52, populationGrowth: 2.7, gdp: 1607, carbonEmissions: 0.7 },
  "Mali": { lifeExpectancy: 59.3, airQuality: 36, waterQuality: 42, populationGrowth: 3.0, gdp: 916, carbonEmissions: 0.3 },
  "Niger": { lifeExpectancy: 62.4, airQuality: 38, waterQuality: 40, populationGrowth: 3.8, gdp: 590, carbonEmissions: 0.1 },
  "Burkina Faso": { lifeExpectancy: 61.6, airQuality: 34, waterQuality: 42, populationGrowth: 2.9, gdp: 893, carbonEmissions: 0.2 },
  "Ivory Coast": { lifeExpectancy: 57.8, airQuality: 32, waterQuality: 44, populationGrowth: 2.5, gdp: 2549, carbonEmissions: 0.4 },
  
  // Africa - East
  "Ethiopia": { lifeExpectancy: 66.6, airQuality: 34, waterQuality: 42, populationGrowth: 2.6, gdp: 1020, carbonEmissions: 0.1 },
  "Kenya": { lifeExpectancy: 66.7, airQuality: 38, waterQuality: 46, populationGrowth: 2.2, gdp: 2099, carbonEmissions: 0.4 },
  "Tanzania": { lifeExpectancy: 65.5, airQuality: 40, waterQuality: 48, populationGrowth: 3.0, gdp: 1192, carbonEmissions: 0.2 },
  "Uganda": { lifeExpectancy: 63.4, airQuality: 36, waterQuality: 44, populationGrowth: 3.3, gdp: 1015, carbonEmissions: 0.1 },
  "Somalia": { lifeExpectancy: 57.5, airQuality: 42, waterQuality: 32, populationGrowth: 2.9, gdp: 461, carbonEmissions: 0.1 },
  "Sudan": { lifeExpectancy: 65.3, airQuality: 30, waterQuality: 40, populationGrowth: 2.4, gdp: 1016, carbonEmissions: 0.4 },
  "South Sudan": { lifeExpectancy: 57.9, airQuality: 38, waterQuality: 34, populationGrowth: 1.2, gdp: 768, carbonEmissions: 0.2 },
  
  // Africa - Southern
  "South Africa": { lifeExpectancy: 64.1, airQuality: 46, waterQuality: 62, populationGrowth: 1.2, gdp: 6994, carbonEmissions: 7.0 },
  "Zimbabwe": { lifeExpectancy: 61.5, airQuality: 42, waterQuality: 48, populationGrowth: 1.5, gdp: 1464, carbonEmissions: 0.8 },
  "Botswana": { lifeExpectancy: 69.6, airQuality: 56, waterQuality: 64, populationGrowth: 2.0, gdp: 7348, carbonEmissions: 2.8 },
  "Namibia": { lifeExpectancy: 63.7, airQuality: 52, waterQuality: 58, populationGrowth: 1.9, gdp: 4729, carbonEmissions: 1.6 },
  "Mozambique": { lifeExpectancy: 60.2, airQuality: 40, waterQuality: 42, populationGrowth: 2.9, gdp: 528, carbonEmissions: 0.3 },
  "Madagascar": { lifeExpectancy: 67.0, airQuality: 48, waterQuality: 46, populationGrowth: 2.7, gdp: 515, carbonEmissions: 0.1 },
  
  // Asia - East
  "China": { lifeExpectancy: 78.2, airQuality: 35, waterQuality: 58, populationGrowth: 0.2, gdp: 12720, carbonEmissions: 8.0 },
  "Japan": { lifeExpectancy: 84.8, airQuality: 72, waterQuality: 90, populationGrowth: -0.5, gdp: 33815, carbonEmissions: 8.5 },
  "South Korea": { lifeExpectancy: 83.6, airQuality: 52, waterQuality: 78, populationGrowth: 0.1, gdp: 34165, carbonEmissions: 11.6 },
  "North Korea": { lifeExpectancy: 72.0, airQuality: 38, waterQuality: 48, populationGrowth: 0.4, gdp: 1300, carbonEmissions: 1.9 },
  "Mongolia": { lifeExpectancy: 69.9, airQuality: 32, waterQuality: 52, populationGrowth: 1.5, gdp: 4339, carbonEmissions: 7.1 },
  
  // Asia - Southeast
  "Indonesia": { lifeExpectancy: 71.7, airQuality: 38, waterQuality: 52, populationGrowth: 0.9, gdp: 4788, carbonEmissions: 2.3 },
  "Thailand": { lifeExpectancy: 77.7, airQuality: 42, waterQuality: 62, populationGrowth: 0.2, gdp: 7066, carbonEmissions: 3.7 },
  "Vietnam": { lifeExpectancy: 75.4, airQuality: 36, waterQuality: 56, populationGrowth: 0.8, gdp: 4164, carbonEmissions: 3.5 },
  "Philippines": { lifeExpectancy: 69.3, airQuality: 34, waterQuality: 54, populationGrowth: 1.5, gdp: 3499, carbonEmissions: 1.3 },
  "Malaysia": { lifeExpectancy: 76.2, airQuality: 44, waterQuality: 66, populationGrowth: 1.1, gdp: 12451, carbonEmissions: 8.0 },
  "Singapore": { lifeExpectancy: 83.6, airQuality: 68, waterQuality: 88, populationGrowth: 0.1, gdp: 82808, carbonEmissions: 8.8 },
  "Myanmar": { lifeExpectancy: 67.1, airQuality: 38, waterQuality: 48, populationGrowth: 0.7, gdp: 1400, carbonEmissions: 0.6 },
  "Cambodia": { lifeExpectancy: 69.8, airQuality: 40, waterQuality: 50, populationGrowth: 1.4, gdp: 1785, carbonEmissions: 0.8 },
  "Laos": { lifeExpectancy: 68.1, airQuality: 42, waterQuality: 52, populationGrowth: 1.5, gdp: 2535, carbonEmissions: 2.9 },
  
  // Asia - South
  "India": { lifeExpectancy: 70.4, airQuality: 28, waterQuality: 48, populationGrowth: 0.8, gdp: 2389, carbonEmissions: 1.9 },
  "Pakistan": { lifeExpectancy: 67.3, airQuality: 26, waterQuality: 42, populationGrowth: 1.9, gdp: 1568, carbonEmissions: 0.9 },
  "Bangladesh": { lifeExpectancy: 72.6, airQuality: 24, waterQuality: 44, populationGrowth: 1.0, gdp: 2457, carbonEmissions: 0.6 },
  "Sri Lanka": { lifeExpectancy: 76.4, airQuality: 46, waterQuality: 58, populationGrowth: 0.5, gdp: 3474, carbonEmissions: 1.0 },
  "Nepal": { lifeExpectancy: 70.8, airQuality: 32, waterQuality: 48, populationGrowth: 1.8, gdp: 1336, carbonEmissions: 0.5 },
  "Bhutan": { lifeExpectancy: 71.8, airQuality: 68, waterQuality: 72, populationGrowth: 1.1, gdp: 3122, carbonEmissions: 1.4 },
  "Afghanistan": { lifeExpectancy: 64.8, airQuality: 30, waterQuality: 36, populationGrowth: 2.3, gdp: 368, carbonEmissions: 0.3 },
  
  // Oceania
  "Australia": { lifeExpectancy: 83.4, airQuality: 76, waterQuality: 90, populationGrowth: 1.3, gdp: 64674, carbonEmissions: 15.3 },
  "New Zealand": { lifeExpectancy: 82.3, airQuality: 82, waterQuality: 92, populationGrowth: 1.6, gdp: 48781, carbonEmissions: 6.3 },
  "Papua New Guinea": { lifeExpectancy: 64.5, airQuality: 58, waterQuality: 42, populationGrowth: 1.9, gdp: 2804, carbonEmissions: 0.8 },
  "Fiji": { lifeExpectancy: 67.4, airQuality: 70, waterQuality: 68, populationGrowth: 0.6, gdp: 5740, carbonEmissions: 1.2 },
  
  // Additional European countries
  "Albania": { lifeExpectancy: 78.6, airQuality: 48, waterQuality: 64, populationGrowth: -0.2, gdp: 6494, carbonEmissions: 1.8 },
  "Bosnia and Herzegovina": { lifeExpectancy: 77.4, airQuality: 44, waterQuality: 62, populationGrowth: -0.6, gdp: 7032, carbonEmissions: 6.2 },
  "North Macedonia": { lifeExpectancy: 75.8, airQuality: 42, waterQuality: 60, populationGrowth: -0.1, gdp: 6722, carbonEmissions: 3.6 },
  "Montenegro": { lifeExpectancy: 76.9, airQuality: 52, waterQuality: 68, populationGrowth: 0.0, gdp: 9327, carbonEmissions: 3.7 },
  "Slovenia": { lifeExpectancy: 81.3, airQuality: 64, waterQuality: 82, populationGrowth: 0.2, gdp: 29200, carbonEmissions: 6.2 },
  "Moldova": { lifeExpectancy: 71.9, airQuality: 46, waterQuality: 58, populationGrowth: -0.2, gdp: 5189, carbonEmissions: 1.7 },
  
  // Additional Asian countries
  "Taiwan": { lifeExpectancy: 80.7, airQuality: 54, waterQuality: 74, populationGrowth: 0.1, gdp: 33775, carbonEmissions: 11.6 },
  "Hong Kong": { lifeExpectancy: 85.5, airQuality: 58, waterQuality: 82, populationGrowth: 0.7, gdp: 49660, carbonEmissions: 4.3 },
  "Macau": { lifeExpectancy: 84.6, airQuality: 56, waterQuality: 78, populationGrowth: 1.4, gdp: 46177, carbonEmissions: 2.1 },
  "Brunei": { lifeExpectancy: 75.9, airQuality: 62, waterQuality: 74, populationGrowth: 1.0, gdp: 31449, carbonEmissions: 22.1 },
  "Timor-Leste": { lifeExpectancy: 69.5, airQuality: 52, waterQuality: 46, populationGrowth: 1.8, gdp: 1381, carbonEmissions: 0.5 },
  "Maldives": { lifeExpectancy: 79.9, airQuality: 72, waterQuality: 76, populationGrowth: 1.8, gdp: 11818, carbonEmissions: 3.3 },
};

// Get country data or return default values
export const getCountryData = (countryName: string): CountryStats => {
  const data = countryData[countryName] || {
    lifeExpectancy: 75,
    airQuality: 50,
    waterQuality: 50,
    populationGrowth: 2,
    gdp: 25000,
    carbonEmissions: 5.0
  };
  
  // If carbon emissions is not defined, calculate it using the formula
  if (data.carbonEmissions === undefined) {
    const carbonEmissions = 2772.8667 + 70.3028 * data.lifeExpectancy + 
                           0.0762 * data.airQuality - 1.2057 * data.waterQuality - 
                           281.6896 * data.populationGrowth - 0.1628 * data.gdp;
    
    return {
      ...data,
      carbonEmissions: Math.max(0, carbonEmissions) // Ensure non-negative
    };
  }
  
  return data;
};

// Get list of all available countries
export const getAvailableCountries = (): string[] => {
  return Object.keys(countryData).sort();
};
