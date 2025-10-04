"use client"
import { useState, useEffect, useCallback } from "react";
import Script from "next/script";
import World from "@react-map/world";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCountryData, type CountryStats } from "@/lib/countryData";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [sliderValues, setSliderValues] = useState<CountryStats>({
    lifeExpectancy: 75,
    airQuality: 50,
    waterQuality: 50,
    populationGrowth: 2,
    gdp: 25000,
    carbonEmissions: 0
  });

  const handleCountrySelect = (countryName: string | null) => {
    if (countryName) {
      setSelectedCountry(countryName);
      // Load country-specific data
      const countryStats = getCountryData(countryName);
      // Calculate carbon emissions for the country
      const carbonEmissions = -2772.8667 + 70.3028 * countryStats.lifeExpectancy + 
                             0.0762 * countryStats.airQuality - 1.2057 * countryStats.waterQuality - 
                             281.6896 * countryStats.populationGrowth - 0.1628 * countryStats.gdp;
      setSliderValues({
        ...countryStats,
        carbonEmissions: carbonEmissions
      });
      setMenuOpen(true);
      toast(`Selected: ${countryName}`);
    }
  };

  // Memoized prediction calculation function
  const calculatePredictions = useCallback((values: CountryStats, sourceSliderId: string) => {
    // New equations with carbon emissions
    const predictLifeExpectancy = (airQuality: number, waterQuality: number, populationGrowth: number, gdp: number, carbonEmissions: number) => {
      return 55.1562 + 0.0081 * airQuality + 0.1147 * waterQuality - 3.9004 * populationGrowth + 0.0009 * gdp + 0.0048 * carbonEmissions;
    };

    const predictAirQuality = (lifeExpectancy: number, waterQuality: number, populationGrowth: number, gdp: number, carbonEmissions: number) => {
      return 3.7091 + 2.7131 * lifeExpectancy + 1.2923 * waterQuality - 26.3698 * populationGrowth - 0.0366 * gdp + 0.0017 * carbonEmissions;
    };

    const predictWaterQuality = (lifeExpectancy: number, airQuality: number, populationGrowth: number, gdp: number, carbonEmissions: number) => {
      return -47.0764 + 1.3957 * lifeExpectancy + 0.0471 * airQuality + 3.0430 * populationGrowth + 0.0023 * gdp - 0.0010 * carbonEmissions;
    };

    const predictPopulationGrowth = (lifeExpectancy: number, airQuality: number, waterQuality: number, gdp: number, carbonEmissions: number) => {
      return 5.2874 - 0.0545 * lifeExpectancy - 0.0011 * airQuality + 0.0035 * waterQuality - 0.0001 * gdp - 0.0003 * carbonEmissions;
    };

    const predictGDP = (lifeExpectancy: number, airQuality: number, waterQuality: number, populationGrowth: number, carbonEmissions: number) => {
      return -3208.9994 + 143.6661 * lifeExpectancy - 16.5578 * airQuality + 28.7421 * waterQuality - 1246.5250 * populationGrowth - 1.6768 * carbonEmissions;
    };

    const predictCarbonEmissions = (lifeExpectancy: number, airQuality: number, waterQuality: number, populationGrowth: number, gdp: number) => {
      return -2772.8667 + 70.3028 * lifeExpectancy + 0.0762 * airQuality - 1.2057 * waterQuality - 281.6896 * populationGrowth - 0.1628 * gdp;
    };

    // Calculate carbon emissions first (always calculated, never a source)
    const carbonEmissions = predictCarbonEmissions(values.lifeExpectancy, values.airQuality, values.waterQuality, values.populationGrowth, values.gdp);

    // Calculate predicted values
    return {
      lifeExpectancy: sourceSliderId === 'lifeExpectancy' ? values.lifeExpectancy : predictLifeExpectancy(values.airQuality, values.waterQuality, values.populationGrowth, values.gdp, carbonEmissions),
      airQuality: sourceSliderId === 'airQuality' ? values.airQuality : predictAirQuality(values.lifeExpectancy, values.waterQuality, values.populationGrowth, values.gdp, carbonEmissions),
      waterQuality: sourceSliderId === 'waterQuality' ? values.waterQuality : predictWaterQuality(values.lifeExpectancy, values.airQuality, values.populationGrowth, values.gdp, carbonEmissions),
      populationGrowth: sourceSliderId === 'populationGrowth' ? values.populationGrowth : predictPopulationGrowth(values.lifeExpectancy, values.airQuality, values.waterQuality, values.gdp, carbonEmissions),
      gdp: sourceSliderId === 'gdp' ? values.gdp : predictGDP(values.lifeExpectancy, values.airQuality, values.waterQuality, values.populationGrowth, carbonEmissions),
      carbonEmissions: carbonEmissions
    };
  }, []);

  // Memoized slider change handler
  const handleSliderChange = useCallback((sliderId: string, value: number) => {
    setSliderValues(currentValues => {
      // Create updated values with the changed slider
      const updatedValues = {
        ...currentValues,
        [sliderId]: value
      };
      
      // Calculate predictions for other sliders
      const predicted = calculatePredictions(updatedValues, sliderId);
      
      // Apply constraints and predictions
      const finalValues = { ...updatedValues };
      if (sliderId !== 'lifeExpectancy') {
        finalValues.lifeExpectancy = Math.max(50, Math.min(100, predicted.lifeExpectancy));
      }
      if (sliderId !== 'airQuality') {
        finalValues.airQuality = Math.max(0, Math.min(100, predicted.airQuality));
      }
      if (sliderId !== 'waterQuality') {
        finalValues.waterQuality = Math.max(0, Math.min(100, predicted.waterQuality));
      }
      if (sliderId !== 'populationGrowth') {
        finalValues.populationGrowth = Math.max(-5, Math.min(5, predicted.populationGrowth));
      }
      if (sliderId !== 'gdp') {
        finalValues.gdp = Math.max(0, Math.min(150000, predicted.gdp));
      }
      // Carbon emissions is always calculated, never constrained by slider
      finalValues.carbonEmissions = predicted.carbonEmissions;
      
      return finalValues;
    });
  }, [calculatePredictions]);

  const updateChart = (values: CountryStats) => {
    if (typeof window === 'undefined' || !(window as any).Plotly) return;

    // Calculate predicted values for chart display
    const predicted = calculatePredictions(values, 'none');

    // Create Plotly bar chart
    const trace = {
      x: ['Life Expectancy', 'Air Quality', 'Water Quality', 'Population Growth', 'GDP', 'Carbon Emissions'],
      y: [
        predicted.lifeExpectancy,
        predicted.airQuality,
        predicted.waterQuality,
        predicted.populationGrowth,
        predicted.gdp,
        predicted.carbonEmissions || 0
      ],
      type: 'bar',
      marker: { color: ['#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6', '#EF4444'] }
    };

    const layout = {
      title: { 
        text: 'Predicted Values', 
        x: 0.5, 
        xanchor: 'center',
        font: { family: 'Space Grotesk', size: 20, color: '#333333' }
      },
      yaxis: { 
        title: 'Value', 
        titlefont: { family: 'Space Grotesk', size: 16, color: '#333333' },
        tickfont: { family: 'Space Grotesk', size: 14, color: '#333333' }
      },
      xaxis: {
        tickfont: { family: 'Space Grotesk', size: 14, color: '#333333' }
      },
      margin: { t: 60, b: 60, l: 60, r: 60 },
      showlegend: false,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      responsive: true
    };

    const chartElement = document.getElementById('chart');
    if (chartElement) {
      (window as any).Plotly.newPlot('chart', [trace], layout);
    }
  };

  useEffect(() => {
    // Update chart whenever slider values change
    if (typeof window !== 'undefined' && (window as any).Plotly && selectedCountry) {
      updateChart(sliderValues);
    }
  }, [sliderValues, selectedCountry]);

  useEffect(() => {
    // Initial chart render when Plotly loads
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Plotly && selectedCountry) {
        updateChart(sliderValues);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedCountry]);

  return (
    <>
      <Script src="https://cdn.plot.ly/plotly-latest.min.js" strategy="afterInteractive" onLoad={() => updateChart(sliderValues)} />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      
      <style jsx global>{`
        * {
          font-family: 'Space Grotesk', sans-serif;
        }
        
        /* Custom slider styling */
        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          background: #E5E7EB;
          border-radius: 4px;
          outline: none;
          transition: background 0.3s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>

      <main className="bg-white min-h-screen relative">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="fixed top-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg shadow-lg transition-all duration-300"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Side Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pt-20">
            {/* Country Header */}
            {selectedCountry ? (
              <>
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedCountry}</h2>
                  <p className="text-sm text-gray-500">Adjust statistical variables</p>
                </div>
                
                {/* Carbon Emissions Display - Prominent */}
                <div className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-sm font-medium mb-1">Carbon Emissions</h3>
                      <p className="text-white/80 text-xs">Metric tons CO₂ per capita</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-3xl font-bold">
                        {(sliderValues.carbonEmissions || 0).toFixed(2)}
                      </div>
                      <div className="text-white/80 text-xs mt-1">tons/capita</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-white/90 text-xs">
                      This value is calculated based on the relationships between all other variables.
                      Adjust the sliders below to see how they affect carbon emissions.
                    </p>
                  </div>
                </div>
                
                {/* Current Statistics Summary */}
                <div className="mb-6 bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Statistics</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white rounded p-2">
                      <div className="text-gray-500">Life Expectancy</div>
                      <div className="font-bold text-blue-600">{sliderValues.lifeExpectancy.toFixed(1)} yrs</div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-gray-500">Air Quality</div>
                      <div className="font-bold text-blue-600">{sliderValues.airQuality.toFixed(1)}/100</div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-gray-500">Water Quality</div>
                      <div className="font-bold text-blue-600">{sliderValues.waterQuality.toFixed(1)}/100</div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-gray-500">Pop. Growth</div>
                      <div className="font-bold text-blue-600">{sliderValues.populationGrowth.toFixed(2)}%</div>
                    </div>
                    <div className="bg-white rounded p-2 col-span-2">
                      <div className="text-gray-500">GDP per capita</div>
                      <div className="font-bold text-blue-600">${sliderValues.gdp.toFixed(0)}</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Country Selected</h2>
                <p className="text-sm text-gray-500">Select a country from the map to view and adjust its data</p>
              </div>
            )}
            
            {/* Sliders */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="lifeExpectancy" className="block text-sm font-medium text-gray-700 mb-2">
                  Life Expectancy (50–100 years)
                </label>
                <input
                  type="range"
                  id="lifeExpectancy"
                  min="50"
                  max="100"
                  value={sliderValues.lifeExpectancy}
                  step="0.1"
                  className="w-full"
                  onChange={(e) => handleSliderChange('lifeExpectancy', parseFloat(e.target.value))}
                />
                <span className="text-sm text-gray-500 mt-1 block">{sliderValues.lifeExpectancy.toFixed(1)}</span>
              </div>

              <div>
                <label htmlFor="airQuality" className="block text-sm font-medium text-gray-700 mb-2">
                  Air Quality (0–100)
                </label>
                <input
                  type="range"
                  id="airQuality"
                  min="0"
                  max="100"
                  value={sliderValues.airQuality}
                  step="0.1"
                  className="w-full"
                  onChange={(e) => handleSliderChange('airQuality', parseFloat(e.target.value))}
                />
                <span className="text-sm text-gray-500 mt-1 block">{sliderValues.airQuality.toFixed(1)}</span>
              </div>

              <div>
                <label htmlFor="waterQuality" className="block text-sm font-medium text-gray-700 mb-2">
                  Water Quality (0–100)
                </label>
                <input
                  type="range"
                  id="waterQuality"
                  min="0"
                  max="100"
                  value={sliderValues.waterQuality}
                  step="0.1"
                  className="w-full"
                  onChange={(e) => handleSliderChange('waterQuality', parseFloat(e.target.value))}
                />
                <span className="text-sm text-gray-500 mt-1 block">{sliderValues.waterQuality.toFixed(1)}</span>
              </div>

              <div>
                <label htmlFor="populationGrowth" className="block text-sm font-medium text-gray-700 mb-2">
                  Population Growth (-5–5%)
                </label>
                <input
                  type="range"
                  id="populationGrowth"
                  min="-5"
                  max="5"
                  value={sliderValues.populationGrowth}
                  step="0.01"
                  className="w-full"
                  onChange={(e) => handleSliderChange('populationGrowth', parseFloat(e.target.value))}
                />
                <span className="text-sm text-gray-500 mt-1 block">{sliderValues.populationGrowth.toFixed(2)}%</span>
              </div>

              <div>
                <label htmlFor="gdp" className="block text-sm font-medium text-gray-700 mb-2">
                  GDP per capita (0–150000 USD)
                </label>
                <input
                  type="range"
                  id="gdp"
                  min="0"
                  max="150000"
                  value={sliderValues.gdp}
                  step="100"
                  className="w-full"
                  onChange={(e) => handleSliderChange('gdp', parseFloat(e.target.value))}
                />
                <span className="text-sm text-gray-500 mt-1 block">${sliderValues.gdp.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/10 bg-opacity-10 z-30"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
          <div className="w-full max-w-6xl">
            <div className="bg-white rounded-xl  p-6 sm:p-8 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">
                Interactive World Statistics
              </h1>
              <p className="text-gray-600 text-sm sm:text-base text-center mb-6">
                Select a country to explore and adjust statistical variables
              </p>

              {/* World Map */}
              <div className="flex justify-center">
                <World onSelect={handleCountrySelect} size={1000} hoverColor="BLUE" type="select-single" />
              </div>
            </div>

            {/* Plotly Chart */}
            {selectedCountry && (
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Predicted Values for {selectedCountry}
                </h2>
                <div id="chart" className="w-full h-80 sm:h-96"></div>
              </div>
            )}
          </div>
        </div>
        
        <ToastContainer />
      </main>
    </>
  );
}