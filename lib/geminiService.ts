import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface SliderChange {
  sliderId: string;
  oldValue: number;
  newValue: number;
  countryName: string;
  allValues: {
    lifeExpectancy: number;
    airQuality: number;
    waterQuality: number;
    populationGrowth: number;
    gdp: number;
    carbonEmissions: number;
  };
}

export async function generateSliderFacts(change: SliderChange): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const sliderNames: { [key: string]: string } = {
      lifeExpectancy: 'Life Expectancy',
      airQuality: 'Air Quality',
      waterQuality: 'Water Quality',
      populationGrowth: 'Population Growth',
      gdp: 'GDP per capita',
      carbonEmissions: 'Carbon Emissions'
    };

    const prompt = `
You are an expert in global development and environmental policy. A user is adjusting statistical variables for ${change.countryName}.

The user just changed ${sliderNames[change.sliderId]} from ${change.oldValue.toFixed(2)} to ${change.newValue.toFixed(2)}.

Current statistics for ${change.countryName}:
- Life Expectancy: ${change.allValues.lifeExpectancy.toFixed(1)} years
- Air Quality: ${change.allValues.airQuality.toFixed(1)}/100
- Water Quality: ${change.allValues.waterQuality.toFixed(1)}/100
- Population Growth: ${change.allValues.populationGrowth.toFixed(2)}%
- GDP per capita: $${change.allValues.gdp.toFixed(0)}
- Carbon Emissions: ${change.allValues.carbonEmissions.toFixed(2)} tons CO₂ per capita

Generate exactly 4 distinct, insightful facts about this change. Each fact should be:
1. 1-2 sentences long
2. Focus on different aspects (economic, social, environmental, policy)
3. Be educational and practical
4. Help users understand the interconnected nature of these statistics
5. Use markdown formatting for emphasis (bold, italic, lists, etc.)

Format as a numbered list where each item is a separate fact. Always provide exactly 4 facts. Use markdown formatting to make the facts more engaging and readable.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the numbered list into an array
    const facts = text
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(fact => fact.length > 0);
    
    return facts.length > 0 ? facts : [
      `This change to ${sliderNames[change.sliderId]} could have significant implications for ${change.countryName}'s development trajectory.`,
      `The interconnected nature of these statistics means this adjustment will likely affect other variables as well.`,
      `Consider the broader policy implications of this change for sustainable development.`
    ];
  } catch (error) {
    console.error('Error generating facts:', error);
    const sliderNames: { [key: string]: string } = {
      lifeExpectancy: 'Life Expectancy',
      airQuality: 'Air Quality',
      waterQuality: 'Water Quality',
      populationGrowth: 'Population Growth',
      gdp: 'GDP per capita',
      carbonEmissions: 'Carbon Emissions'
    };
    return [
      `This change to ${sliderNames[change.sliderId]} could have significant implications for ${change.countryName}'s development trajectory.`,
      `The interconnected nature of these statistics means this adjustment will likely affect other variables as well.`,
      `Consider the broader policy implications of this change for sustainable development.`
    ];
  }
}

export async function generateCountryInsight(countryName: string, values: SliderChange['allValues']): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert in global development and environmental policy. A user has selected ${countryName} and the current statistics are:

- Life Expectancy: ${values.lifeExpectancy.toFixed(1)} years
- Air Quality: ${values.airQuality.toFixed(1)}/100
- Water Quality: ${values.waterQuality.toFixed(1)}/100
- Population Growth: ${values.populationGrowth.toFixed(2)}%
- GDP per capita: $${values.gdp.toFixed(0)}
- Carbon Emissions: ${values.carbonEmissions.toFixed(2)} tons CO₂ per capita

Provide a brief, insightful overview (2-3 sentences) about:
1. What these statistics tell us about ${countryName}'s current development status
2. Key challenges or opportunities the country faces
3. How the interconnected nature of these variables affects the country's future

Keep it educational and help the user understand the country's development context.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error('Error generating country insight:', error);
    return `Welcome to ${countryName}! This country's development indicators show interesting patterns. Try adjusting the sliders to explore how different variables interact.`;
  }
}
