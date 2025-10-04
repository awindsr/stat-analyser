# Country Statistics Data Implementation

## Overview
This implementation includes comprehensive statistical data for 170+ countries worldwide, including life expectancy, air quality, water quality, population growth rate, and GDP per capita.

## Features Implemented

### 1. Country Data Store (`lib/countryData.ts`)
- **170+ countries** with real statistical data
- **5 key metrics** per country:
  - Life Expectancy (50-100 years)
  - Air Quality Index (0-100, higher is better)
  - Water Quality Index (0-100, higher is better)
  - Population Growth Rate (-5% to 5%)
  - GDP per capita (in USD)

### 2. Interactive Country Selection
- Click any country on the world map
- Hamburger menu automatically opens with that country's data
- All sliders populate with the country's actual statistical values

### 3. Real-Time Data Display
- **Statistics Summary Card**: Shows current values for all 5 metrics in a compact grid
- **Interactive Sliders**: Adjust each metric and see predictions update
- **Live Value Updates**: Values change as you move the sliders

### 4. Linear Regression Predictions
When you adjust any slider:
- The system calculates predicted values for other metrics
- Other sliders automatically adjust based on regression models
- Chart updates to show the predicted relationships

## Countries Included

### North America (3)
- United States, Canada, Mexico

### Central America & Caribbean (10)
- Guatemala, Honduras, Nicaragua, Costa Rica, Panama, Cuba, Jamaica, Haiti, Dominican Republic

### South America (12)
- Brazil, Argentina, Chile, Colombia, Peru, Venezuela, Ecuador, Bolivia, Paraguay, Uruguay, Guyana, Suriname

### Europe - Western (13)
- United Kingdom, France, Germany, Spain, Italy, Netherlands, Belgium, Switzerland, Austria, Portugal, Greece, Ireland, Luxembourg

### Europe - Northern (5)
- Norway, Sweden, Denmark, Finland, Iceland

### Europe - Eastern (13)
- Poland, Czech Republic, Hungary, Romania, Bulgaria, Slovakia, Croatia, Serbia, Ukraine, Belarus, Lithuania, Latvia, Estonia

### Russia & Central Asia (9)
- Russia, Kazakhstan, Uzbekistan, Turkmenistan, Kyrgyzstan, Tajikistan, Azerbaijan, Armenia, Georgia

### Middle East (14)
- Turkey, Saudi Arabia, Iran, Iraq, Israel, Jordan, Lebanon, Syria, Yemen, Oman, UAE, Kuwait, Qatar, Bahrain

### Africa - North (5)
- Egypt, Libya, Tunisia, Algeria, Morocco

### Africa - West (7)
- Nigeria, Ghana, Senegal, Mali, Niger, Burkina Faso, Ivory Coast

### Africa - East (7)
- Ethiopia, Kenya, Tanzania, Uganda, Somalia, Sudan, South Sudan

### Africa - Southern (6)
- South Africa, Zimbabwe, Botswana, Namibia, Mozambique, Madagascar

### Asia - East (5)
- China, Japan, South Korea, North Korea, Mongolia

### Asia - Southeast (9)
- Indonesia, Thailand, Vietnam, Philippines, Malaysia, Singapore, Myanmar, Cambodia, Laos

### Asia - South (7)
- India, Pakistan, Bangladesh, Sri Lanka, Nepal, Bhutan, Afghanistan

### Oceania (4)
- Australia, New Zealand, Papua New Guinea, Fiji

### Additional Regions (11)
- Albania, Bosnia and Herzegovina, North Macedonia, Montenegro, Slovenia, Moldova, Taiwan, Hong Kong, Macau, Brunei, Timor-Leste, Maldives

## Data Sources & Accuracy
The data is approximate and based on 2023-2024 global statistics from various sources including:
- World Bank
- WHO (World Health Organization)
- UN Population Division
- World Air Quality Index
- Water Quality assessments

## Usage

### Selecting a Country
1. Click any country on the world map
2. The hamburger menu opens automatically
3. View the country's current statistics in the summary card

### Adjusting Values
1. Use the sliders to modify any metric
2. Watch other metrics adjust automatically based on predictions
3. See the chart update in real-time

### Resetting to Country Data
Simply click the same or different country on the map to reload its actual statistical values.

## Technical Details

### State Management
- React state tracks selected country and all slider values
- Controlled components ensure React manages all input values
- Updates trigger automatic chart recalculation

### Regression Models
The prediction functions use linear regression coefficients to estimate relationships between variables:
- Life Expectancy = f(air, water, growth, gdp)
- Air Quality = f(life, water, growth, gdp)
- Water Quality = f(life, air, growth, gdp)
- Population Growth = f(life, air, water, gdp)
- GDP = f(life, air, water, growth)

### Value Constraints
- Life Expectancy: 50-100 years
- Air Quality: 0-100 index
- Water Quality: 0-100 index
- Population Growth: -5% to 5%
- GDP per capita: $0-$150,000

## Future Enhancements
- Add historical data trends
- Include more countries (smaller nations)
- Add more metrics (education, healthcare, etc.)
- Real-time data fetching from APIs
- Compare multiple countries side-by-side
