"use client"
import { useState, useEffect } from "react";
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
    gdp: 25000
  });

  const handleCountrySelect = (countryName: string | null) => {
    if (countryName) {
      setSelectedCountry(countryName);
      // Load country-specific data
      const countryStats = getCountryData(countryName);
      setSliderValues(countryStats);
      setMenuOpen(true);
      toast(`Selected: ${countryName}`);
    }
  };

  const handleSliderChange = (sliderId: string, value: number) => {
    // Calculate new values with predictions
    const updatedValues = {
      ...sliderValues,
      [sliderId]: value
    };
    
    // Apply predictions for other sliders
    const predicted = calculatePredictions(updatedValues, sliderId);
    
    const finalValues = { ...updatedValues };
    if (sliderId !== 'lifeExpectancy') finalValues.lifeExpectancy = Math.max(50, Math.min(100, predicted.lifeExpectancy));
    if (sliderId !== 'airQuality') finalValues.airQuality = Math.max(0, Math.min(100, predicted.airQuality));
    if (sliderId !== 'waterQuality') finalValues.waterQuality = Math.max(0, Math.min(100, predicted.waterQuality));
    if (sliderId !== 'populationGrowth') finalValues.populationGrowth = Math.max(-5, Math.min(5, predicted.populationGrowth));
    if (sliderId !== 'gdp') finalValues.gdp = Math.max(0, Math.min(150000, predicted.gdp));
    
    setSliderValues(finalValues);
  };

  const calculatePredictions = (values: CountryStats, sourceSliderId: string) => {
    const predictLifeExpectancy = (airQuality: number, waterQuality: number, populationGrowth: number, gdp: number) => {
      return 63.1253 + 0.0128 * airQuality + 0.1642 * waterQuality - 7.9104 * populationGrowth + 0.0003 * gdp;
    };

    const predictAirQuality = (lifeExpectancy: number, waterQuality: number, populationGrowth: number, gdp: number) => {
      return -1.0948 + 2.8352 * lifeExpectancy + 1.2904 * waterQuality - 26.8613 * populationGrowth - 0.0368 * gdp;
    };

    const predictWaterQuality = (lifeExpectancy: number, airQuality: number, populationGrowth: number, gdp: number) => {
      return -44.3600 + 1.3270 * lifeExpectancy + 0.0471 * airQuality + 3.3284 * populationGrowth + 0.0025 * gdp;
    };

    const predictPopulationGrowth = (lifeExpectancy: number, airQuality: number, waterQuality: number, gdp: number) => {
      return 6.5226 - 0.0793 * lifeExpectancy - 0.0012 * airQuality + 0.0041 * waterQuality - 0.0001 * gdp;
    };

    const predictGDP = (lifeExpectancy: number, airQuality: number, waterQuality: number, populationGrowth: number) => {
      return 1981.7790 + 35.4615 * lifeExpectancy - 22.9526 * airQuality + 42.3187 * waterQuality - 1064.9488 * populationGrowth;
    };

    // Calculate predicted values
    return {
      lifeExpectancy: sourceSliderId === 'lifeExpectancy' ? values.lifeExpectancy : predictLifeExpectancy(values.airQuality, values.waterQuality, values.populationGrowth, values.gdp),
      airQuality: sourceSliderId === 'airQuality' ? values.airQuality : predictAirQuality(values.lifeExpectancy, values.waterQuality, values.populationGrowth, values.gdp),
      waterQuality: sourceSliderId === 'waterQuality' ? values.waterQuality : predictWaterQuality(values.lifeExpectancy, values.airQuality, values.populationGrowth, values.gdp),
      populationGrowth: sourceSliderId === 'populationGrowth' ? values.populationGrowth : predictPopulationGrowth(values.lifeExpectancy, values.airQuality, values.waterQuality, values.gdp),
      gdp: sourceSliderId === 'gdp' ? values.gdp : predictGDP(values.lifeExpectancy, values.airQuality, values.waterQuality, values.populationGrowth)
    };
  };

  const updateChart = (values: CountryStats) => {
    if (typeof window === 'undefined' || !(window as any).Plotly) return;

    // Calculate predicted values for chart display
    const predicted = calculatePredictions(values, 'none');

    // Create Plotly bar chart
    const trace = {
      x: ['Life Expectancy', 'Air Quality', 'Water Quality', 'Population Growth', 'GDP'],
      y: [
        predicted.lifeExpectancy,
        predicted.airQuality,
        predicted.waterQuality,
        predicted.populationGrowth,
        predicted.gdp
      ],
      type: 'bar',
      marker: { color: '#3B82F6' }
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

      <main className="bg-gray-50 min-h-screen relative">
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