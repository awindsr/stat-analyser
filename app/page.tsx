"use client"
import { useState, useEffect, useCallback } from "react";
import Script from "next/script";
import World from "@react-map/world";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCountryData, type CountryStats } from "@/lib/countryData";
import { generateSliderFacts, generateCountryInsight, type SliderChange } from "@/lib/geminiService";
import ReactMarkdown from 'react-markdown';

// Declare Plotly on window object
declare global {
  interface Window {
    Plotly?: {
      newPlot: (id: string, data: unknown[], layout: unknown) => void;
    };
  }
}

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
  const [previousValues, setPreviousValues] = useState<CountryStats>({
    lifeExpectancy: 75,
    airQuality: 50,
    waterQuality: 50,
    populationGrowth: 2,
    gdp: 25000,
    carbonEmissions: 0
  });
  const [showChart, setShowChart] = useState(false);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [insightContent, setInsightContent] = useState('');
  const [insightTitle, setInsightTitle] = useState('');
  const [insightFacts, setInsightFacts] = useState<string[]>([]);
  const [currentFactSet, setCurrentFactSet] = useState(0);
  const [sliderFactsCache, setSliderFactsCache] = useState<{ [key: string]: string[] }>({});
  const [showDatasetModal, setShowDatasetModal] = useState(false);
  const [datasetData, setDatasetData] = useState<{ headers: string[], rows: string[][] } | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [geminiMessages, setGeminiMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [geminiInput, setGeminiInput] = useState('');
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [datasetsExpanded, setDatasetsExpanded] = useState(false);

  // Show insight modal with content based on current values
  const showInsight = async (title: string) => {
    if (!selectedCountry) return;
    const insight = await generateCountryInsight(selectedCountry, {
      lifeExpectancy: sliderValues.lifeExpectancy,
      airQuality: sliderValues.airQuality,
      waterQuality: sliderValues.waterQuality,
      populationGrowth: sliderValues.populationGrowth,
      gdp: sliderValues.gdp,
      carbonEmissions: sliderValues.carbonEmissions || 0
    });
    setInsightTitle(title);
    setInsightContent(insight);
    setInsightFacts([]);
    setShowInsightModal(true);
  };

  // Show facts modal based on current values
  const showFacts = async (title: string, facts: string[]) => {
    setInsightTitle(title);
    setInsightFacts(facts);
    setInsightContent('');
    setShowInsightModal(true);
  };

  const nextFactSet = () => {
    setCurrentFactSet((prev) => (prev + 1) % Math.ceil(insightFacts.length / 4));
  };

  const prevFactSet = () => {
    setCurrentFactSet((prev) => (prev - 1 + Math.ceil(insightFacts.length / 4)) % Math.ceil(insightFacts.length / 4));
  };

  const getCurrentFacts = () => {
    const startIndex = currentFactSet * 4;
    return insightFacts.slice(startIndex, startIndex + 4);
  };

  // Parse CSV data and show dataset modal
  const showDataset = async (fileName: string, datasetName: string) => {
    try {
      const response = await fetch(`/assets/${fileName}`);
      const csvText = await response.text();
      
      // Parse CSV
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',');
      const rows = lines.slice(1).map(line => line.split(','));
      
      setDatasetData({ headers, rows });
      setDatasetName(datasetName);
      setShowDatasetModal(true);
    } catch (error) {
      console.error('Error loading dataset:', error);
    }
  };


  // Handle Gemini chat with context
  const handleGeminiChat = async (message: string) => {
    if (!message.trim()) return;
    
    setIsGeminiLoading(true);
    const userMessage = { role: 'user' as const, content: message };
    setGeminiMessages(prev => [...prev, userMessage]);
    setGeminiInput('');
    
    try {
      const contextPrompt = `
You are an expert AI assistant helping users understand global development statistics. 

Current context for ${selectedCountry || 'the selected country'}:
- Life Expectancy: ${sliderValues.lifeExpectancy.toFixed(1)} years
- Air Quality: ${sliderValues.airQuality.toFixed(1)}/100
- Water Quality: ${sliderValues.waterQuality.toFixed(1)}/100
- Population Growth: ${sliderValues.populationGrowth.toFixed(2)}%
- GDP per capita: $${sliderValues.gdp.toFixed(0)}
- Carbon Emissions: ${(sliderValues.carbonEmissions || 0).toFixed(2)} tons CO₂ per capita

User question: ${message}

Please provide a helpful, educational response that relates to the current statistical values. Focus on:
1. What these statistics mean in context
2. How they relate to each other
3. Policy implications or insights
4. Comparisons to global averages or other countries

Keep responses concise but informative (2-3 sentences). Use markdown formatting for emphasis.
`;

      console.log('Sending request to AI API...');
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: contextPrompt }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${errorData.error || errorData.message || 'Failed to get response'}`);
      }
      
      let data;
      try {
        data = await response.json();
        console.log('API Response:', data);
      } catch (parseError) {
        console.error('Failed to parse API response:', parseError);
        throw new Error('Invalid response format from API');
      }
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from API');
      }
      
      if (!data.response) {
        throw new Error(`No response from AI. API returned: ${JSON.stringify(data)}`);
      }
      
      if (typeof data.response !== 'string' || data.response.trim() === '') {
        throw new Error('Empty response from AI');
      }
      
      const assistantMessage = { role: 'assistant' as const, content: data.response };
      setGeminiMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error with AI chat:', error);
      
      // Try fallback using existing AI service
      try {
        console.log('Trying fallback with existing AI service...');
        const fallbackResponse = await generateCountryInsight(selectedCountry || 'Global', {
          lifeExpectancy: sliderValues.lifeExpectancy,
          airQuality: sliderValues.airQuality,
          waterQuality: sliderValues.waterQuality,
          populationGrowth: sliderValues.populationGrowth,
          gdp: sliderValues.gdp,
          carbonEmissions: sliderValues.carbonEmissions || 0
        });
        
        const fallbackMessage = { role: 'assistant' as const, content: `Based on the current statistics, here's some insight: ${fallbackResponse}` };
        setGeminiMessages(prev => [...prev, fallbackMessage]);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        
        // Final fallback - provide basic statistics
        const statsMessage = `I'm having trouble connecting to the AI service. Here are your current statistics:

**${selectedCountry || 'Selected Country'} Statistics:**
- **Life Expectancy**: ${sliderValues.lifeExpectancy.toFixed(1)} years
- **Air Quality**: ${sliderValues.airQuality.toFixed(1)}/100
- **Water Quality**: ${sliderValues.waterQuality.toFixed(1)}/100
- **Population Growth**: ${sliderValues.populationGrowth.toFixed(2)}%
- **GDP per capita**: $${sliderValues.gdp.toFixed(0)}
- **Carbon Emissions**: ${(sliderValues.carbonEmissions || 0).toFixed(2)} tons CO₂ per capita

Please check your API key configuration or try again later.`;
        
        const errorMessage = { role: 'assistant' as const, content: statsMessage };
        setGeminiMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const handleInfoButtonClick = (sliderId: string) => {
    const sliderNames: { [key: string]: string } = {
      lifeExpectancy: 'Life Expectancy',
      airQuality: 'Air Quality',
      waterQuality: 'Water Quality',
      populationGrowth: 'Population Growth',
      gdp: 'GDP per capita'
    };
    
    const cachedFacts = sliderFactsCache[sliderId];
    if (cachedFacts && cachedFacts.length > 0) {
      showFacts(`${sliderNames[sliderId]} Insights`, cachedFacts);
    } else {
      setInsightTitle(`${sliderNames[sliderId]}`);
      setInsightContent(`Adjust the ${sliderNames[sliderId]} slider to see how it affects other variables and generate insights about the changes.`);
      setInsightFacts([]);
      setShowInsightModal(true);
    }
  };

  const handleCountrySelect = async (countryName: string | null) => {
    if (countryName) {
      setSelectedCountry(countryName);
      // Load country-specific data
      const countryStats = getCountryData(countryName);
      // Calculate carbon emissions for the country
      const carbonEmissions = 2772.8667 + 70.3028 * countryStats.lifeExpectancy + 
                             0.0762 * countryStats.airQuality - 1.2057 * countryStats.waterQuality - 
                             281.6896 * countryStats.populationGrowth - 0.1628 * countryStats.gdp;
      const newValues = {
        ...countryStats,
        carbonEmissions: carbonEmissions
      };
      setSliderValues(newValues);
      setPreviousValues(newValues);
      setMenuOpen(true);
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
      return 2772.8667 + 70.3028 * lifeExpectancy + 0.0762 * airQuality - 1.2057 * waterQuality - 281.6896 * populationGrowth - 0.1628 * gdp;
    };

    // Start with current values
    let result = { ...values };
    
    // Iteratively solve the system of equations (3 iterations for convergence)
    for (let iteration = 0; iteration < 3; iteration++) {
      // Calculate carbon emissions with current values
      const carbonEmissions = predictCarbonEmissions(
        result.lifeExpectancy,
        result.airQuality,
        result.waterQuality,
        result.populationGrowth,
        result.gdp
      );

      // Update each value (except the source slider)
      result = {
        lifeExpectancy: sourceSliderId === 'lifeExpectancy' ? values.lifeExpectancy : 
          predictLifeExpectancy(result.airQuality, result.waterQuality, result.populationGrowth, result.gdp, carbonEmissions),
        airQuality: sourceSliderId === 'airQuality' ? values.airQuality : 
          predictAirQuality(result.lifeExpectancy, result.waterQuality, result.populationGrowth, result.gdp, carbonEmissions),
        waterQuality: sourceSliderId === 'waterQuality' ? values.waterQuality : 
          predictWaterQuality(result.lifeExpectancy, result.airQuality, result.populationGrowth, result.gdp, carbonEmissions),
        populationGrowth: sourceSliderId === 'populationGrowth' ? values.populationGrowth : 
          predictPopulationGrowth(result.lifeExpectancy, result.airQuality, result.waterQuality, result.gdp, carbonEmissions),
        gdp: sourceSliderId === 'gdp' ? values.gdp : 
          predictGDP(result.lifeExpectancy, result.airQuality, result.waterQuality, result.populationGrowth, carbonEmissions),
        carbonEmissions: carbonEmissions
      };
    }

    return result;
  }, []);

  // Memoized slider change handler
  const handleSliderChange = useCallback(async (sliderId: string, value: number) => {
    const oldValue = sliderValues[sliderId as keyof CountryStats] || 0;
    
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
  // Carbon emissions is always calculated, but must never be negative
  finalValues.carbonEmissions = Math.max(0, predicted.carbonEmissions ?? 0);
      
      // Update previous values for next comparison
      setPreviousValues(currentValues);
      
      return finalValues;
    });

    // Generate and cache AI facts for the slider change (but don't show modal)
    if (selectedCountry && Math.abs(value - oldValue) > 0.1) {
      // Calculate the updated values that will be set
      const updatedValues = {
        ...sliderValues,
        [sliderId]: value
      };
      const predicted = calculatePredictions(updatedValues, sliderId);
      
      // Apply constraints to get final values
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
      finalValues.carbonEmissions = predicted.carbonEmissions || 0;

      try {
        const change: SliderChange = {
          sliderId,
          oldValue,
          newValue: value,
          countryName: selectedCountry,
          allValues: finalValues as Required<CountryStats>
        };
        
        const facts = await generateSliderFacts(change);
        // Cache the facts instead of showing them
        setSliderFactsCache(prev => ({
          ...prev,
          [sliderId]: facts
        }));
      } catch (error) {
        console.error('Error generating facts:', error);
      }
    }
  }, [calculatePredictions, sliderValues, selectedCountry]);

  const updateChart = useCallback((values: CountryStats) => {
    if (typeof window === 'undefined' || !window.Plotly) return;

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
    if (chartElement && window.Plotly) {
      window.Plotly.newPlot('chart', [trace], layout);
    }
  }, [calculatePredictions]);

  useEffect(() => {
    // Update chart whenever slider values change and chart is visible
    if (typeof window !== 'undefined' && window.Plotly && selectedCountry && showChart) {
      updateChart(sliderValues);
    }
  }, [sliderValues, selectedCountry, showChart, updateChart]);

  useEffect(() => {
    // Initial chart render when Plotly loads and chart is shown
    if (showChart && selectedCountry) {
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined' && window.Plotly) {
          updateChart(sliderValues);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedCountry, showChart, sliderValues, updateChart]);

  return (
    <>
      <Script src="https://cdn.plot.ly/plotly-latest.min.js" strategy="afterInteractive" onLoad={() => {
        if (showChart && selectedCountry) {
          updateChart(sliderValues);
        }
      }} />
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
          className={`fixed top-0 right-0 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ width: '70vw' }}
        >
          <div className="p-6 pt-20">
            {/* Country Header */}
            {selectedCountry ? (
              <>
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedCountry}</h2>
                  <p className="text-sm text-gray-500">Adjust statistical variables</p>
                </div>
                
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Stats and Carbon Emissions */}
                  <div className="space-y-6">
                    {/* Carbon Emissions Display - Prominent */}
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 shadow-lg">
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
                          Adjust the sliders to see how they affect carbon emissions.
                        </p>
                      </div>
                    </div>
                    
                    {/* Current Statistics Summary */}
                    <div className="bg-blue-50 rounded-lg p-4">
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
                  </div>
                  
                  {/* Right Column - Sliders */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Adjust Variables</h3>
                    <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="lifeExpectancy" className="block text-sm font-medium text-gray-700">
                    Life Expectancy (50–100 years)
                  </label>
                  <button
                    onClick={() => handleInfoButtonClick('lifeExpectancy')}
                    className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50"
                    title="View insights"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="airQuality" className="block text-sm font-medium text-gray-700">
                    Air Quality (0–100)
                  </label>
                  <button
                    onClick={() => handleInfoButtonClick('airQuality')}
                    className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50"
                    title="View insights"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="waterQuality" className="block text-sm font-medium text-gray-700">
                    Water Quality (0–100)
                  </label>
                  <button
                    onClick={() => handleInfoButtonClick('waterQuality')}
                    className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50"
                    title="View insights"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="populationGrowth" className="block text-sm font-medium text-gray-700">
                    Population Growth (-5–5%)
                  </label>
                  <button
                    onClick={() => handleInfoButtonClick('populationGrowth')}
                    className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50"
                    title="View insights"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="gdp" className="block text-sm font-medium text-gray-700">
                    GDP per capita (0–150000 USD)
                  </label>
                  <button
                    onClick={() => handleInfoButtonClick('gdp')}
                    className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50"
                    title="View insights"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
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

            {/* Datasets Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setDatasetsExpanded(!datasetsExpanded)}
                className="flex items-center justify-between w-full text-left hover:bg-gray-50 rounded-lg p-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Available Datasets</h3>
                    <p className="text-sm text-gray-600">View and download statistical data files</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    datasetsExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                datasetsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="pt-4">
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { name: 'Air Quality', file: 'air_quality.csv', description: 'Air quality index data by region and year' },
                      { name: 'Carbon Emissions', file: 'carbon_emission.csv', description: 'Carbon emission data by region and year' },
                      { name: 'GDP', file: 'gdp.csv', description: 'Gross Domestic Product data by region and year' },
                      { name: 'Life Expectancy', file: 'life_expectancy.csv', description: 'Life expectancy data by region and year' },
                      { name: 'Population Rate', file: 'population_rate.csv', description: 'Population growth rate data by region and year' },
                      { name: 'Water Quality', file: 'water_quality.csv', description: 'Water quality index data by region and year' }
                    ].map((dataset) => (
                      <div key={dataset.file} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{dataset.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{dataset.description}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => showDataset(dataset.file, dataset.name)}
                              className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50"
                              title="View dataset"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <a
                              href={`/assets/${dataset.file}`}
                              download={dataset.file}
                              className="text-green-500 hover:text-green-700 transition-colors p-2 rounded-lg hover:bg-green-50"
                              title="Download dataset"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gemini AI Assistant Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Assistant</h3>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">AI Assistant</h4>
                    <p className="text-sm text-gray-600">Ask questions about the current statistics</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-64 overflow-y-auto p-3 bg-white rounded-lg border border-gray-200 space-y-3 mb-4">
                  {geminiMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-sm">Ask me about the current statistics!</p>
                    </div>
                  ) : (
                    geminiMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                          message.role === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isGeminiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={(e) => { e.preventDefault(); handleGeminiChat(geminiInput); }} className="flex gap-2">
                  <input
                    type="text"
                    value={geminiInput}
                    onChange={(e) => setGeminiInput(e.target.value)}
                    placeholder="Ask about the statistics..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    disabled={isGeminiLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (geminiInput.trim() && !isGeminiLoading) {
                          handleGeminiChat(geminiInput);
                        }
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isGeminiLoading || !geminiInput.trim()}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[40px]"
                    title={isGeminiLoading ? "AI is thinking..." : "Send message"}
                  >
                    {isGeminiLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Chart Toggle Button */}
            {/* <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowChart(!showChart)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {showChart ? 'Hide Chart' : 'Show Predicted Values Chart'}
              </button>
            </div> */}

            {/* Chart Section */}
            {/* {showChart && selectedCountry && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Interconnected Statistics
                </h3>
                <div id="chart" className="w-full h-64 bg-gray-50 rounded-lg p-2"></div>
              </div>
            )} */}
          </>
        ) : (
          <div className="p-6 pt-20">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Country Selected</h2>
              <p className="text-sm text-gray-500">Select a country from the map to view and adjust its data</p>
            </div>
          </div>
        )}
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

          </div>
        </div>
        
        <ToastContainer />
        
        {/* Insight Modal */}
        {showInsightModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 rounded-2xl shadow-xl max-w-xl w-full max-h-[80vh] overflow-hidden transition-all duration-300">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border-b border-white/20 text-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 tracking-tight">{insightTitle}</h2>
                  <button
                    onClick={() => setShowInsightModal(false)}
                    className="text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Step Indicator */}
                {insightFacts.length > 4 && (
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    {Array.from({ length: Math.ceil(insightFacts.length / 4) }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentFactSet ? 'bg-white shadow-lg' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[70vh]">
                {insightFacts.length > 0 ? (
                  <div className="space-y-4">
                    {getCurrentFacts().map((fact, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="text-gray-800 leading-relaxed text-base">
                          <ReactMarkdown>{fact}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="text-gray-800 leading-relaxed text-lg">
                      <ReactMarkdown>{insightContent}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="border-t px-6 py-4 flex justify-between items-center bg-white rounded-b-2xl">
                <div className="flex gap-2">
                  {insightFacts.length > 4 && (
                    <>
                      <button
                        onClick={prevFactSet}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 border border-gray-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Prev
                      </button>
                      <button
                        onClick={nextFactSet}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 border border-gray-200"
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setShowInsightModal(false)}
                  className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dataset Modal */}
        {showDatasetModal && datasetData && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden transition-all duration-300">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border-b border-white/20 text-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 tracking-tight">{datasetName} Dataset</h2>
                  <button
                    onClick={() => setShowDatasetModal(false)}
                    className="text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="overflow-auto max-h-[calc(90vh-120px)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {datasetData.headers.map((header, index) => (
                          <th
                            key={index}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {datasetData.rows.slice(0, 100).map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {datasetData.rows.length > 100 && (
                    <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
                      Showing first 100 rows of {datasetData.rows.length} total rows
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}