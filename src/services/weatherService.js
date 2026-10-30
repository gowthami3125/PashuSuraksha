/**
 * Open-Meteo Live Weather & Vector-Borne Forewarning Service
 * PashuSuraksha - Phase 3 Surveillance
 * 
 * Free live Open-Meteo API (no key required):
 * https://api.open-meteo.com/v1/forecast
 * 
 * Computes Vector Forewarning Index for:
 * - Lumpy Skin Disease (LSD) - Biting flies (Stomoxys calcitrans) & mosquitoes (Aedes/Culex)
 * - Bluetongue - Biting midges (Culicoides spp.)
 * - Ephemeral Fever - Mosquito vectors
 */

const WEATHER_CACHE = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

// District Centroids for Weather Polling
export const DISTRICT_COORDINATES = {
  // Maharashtra
  'Pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  'Kolhapur': { lat: 16.7050, lng: 74.2433, state: 'Maharashtra' },
  'Nashik': { lat: 19.9975, lng: 73.7898, state: 'Maharashtra' },
  'Latur': { lat: 18.4088, lng: 76.5604, state: 'Maharashtra' },
  'Nagpur': { lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
  'Ahmednagar': { lat: 19.0948, lng: 74.7480, state: 'Maharashtra' },
  'Satara': { lat: 17.6805, lng: 74.0183, state: 'Maharashtra' },
  'Solapur': { lat: 17.6599, lng: 75.9064, state: 'Maharashtra' },
  'Aurangabad': { lat: 19.8762, lng: 75.3433, state: 'Maharashtra' },

  // Andhra Pradesh
  'Guntur': { lat: 16.3067, lng: 80.4365, state: 'Andhra Pradesh' },
  'Krishna': { lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh' },
  'West Godavari': { lat: 16.7107, lng: 81.0952, state: 'Andhra Pradesh' },
  'Visakhapatnam': { lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
  'Chittoor': { lat: 13.6288, lng: 79.4192, state: 'Andhra Pradesh' },
  'Kurnool': { lat: 15.8281, lng: 78.0373, state: 'Andhra Pradesh' },
  'Prakasam': { lat: 15.5057, lng: 80.0499, state: 'Andhra Pradesh' }
};

/**
 * Calculates vector forewarning multiplication risk based on temperature & humidity
 */
export function calculateVectorRisk(temperature, relativeHumidity, precipitation = 0) {
  // Vector multiplication sweet spot for Stomoxys (biting flies) & Culicoides midges:
  // Temp 24°C - 34°C + Humidity > 70%
  let score = 0;
  let riskLevel = 'LOW';
  let primaryThreat = 'Minimal Vector Activity';
  let recommendationEn = 'Standard shed sanitation and dung disposal.';
  let recommendationMr = 'गोठ्याची सामान्य स्वच्छता आणि शेणाची योग्य विल्हेवाट ठेवा.';
  let recommendationHi = 'बाड़े की सामान्य सफाई और गोबर का उचित निस्तारण करें।';
  let recommendationTe = 'పాక సాధారణ పరిశుభ్రత మరియు పేడ తొలగింపు.';

  if (temperature >= 22 && temperature <= 36) {
    score += 40;
  } else if (temperature > 36 || temperature < 18) {
    score += 15;
  }

  if (relativeHumidity >= 75) {
    score += 50;
  } else if (relativeHumidity >= 60) {
    score += 30;
  } else {
    score += 10;
  }

  if (precipitation > 1.0) {
    score += 10; // Standing rainwater creates breeding puddles
  }

  if (score >= 75) {
    riskLevel = 'HIGH';
    primaryThreat = 'High Biting Fly & Mosquito Breeding Surge (LSD & Bluetongue Risk)';
    recommendationEn = 'CRITICAL: High vector multiplication weather. Spray fly repellents, install insect netting in sheds, and eliminate standing rainwater pools.';
    recommendationMr = 'तातडीचा इशारा: गोमाशा व डासांची पैदास वाढण्याचे वातावरण. गोठ्यात कडुनिंबाचा धूर करा, जनावरांवर माशी प्रतिबंधक औषध फवारा.';
    recommendationHi = 'अति-सावधान: मक्खी-मच्छर तेजी से पनपने के अनुकूल मौसम। कीटनाशक छिड़कें, पानी जमा न होने दें और धुआं करें।';
    recommendationTe = 'అత్యవసర హెచ్చరిక: ఈగలు మరియు దోమలు ఎక్కువగా వృద్ధి చెందే వాతావరణం. పాకలో వేప పొగ వేయండి, నీటి నిల్వలను తొలగించండి.';
  } else if (score >= 45) {
    riskLevel = 'MODERATE';
    primaryThreat = 'Moderate Vector Surge';
    recommendationEn = 'Moderate fly activity. Clean drainage canals around cattle sheds and apply neem oil on animal coats.';
    recommendationMr = 'मध्यम धोका. गोठ्याभोवतीची नाले स्वच्छ ठेवा आणि जनावरांच्या अंगावर कडुनिंबाचे तेल लावा.';
    recommendationHi = 'मध्यम जोखिम। नालियों की सफाई करें और पशुओं पर नीम का तेल लगाएं।';
    recommendationTe = 'మధ్యస్థ ప్రమాదం. డ్రైనేజీని శుభ్రం చేయండి మరియు పశువులకు వేప నూనె పూయండి.';
  }

  return {
    score,
    riskLevel,
    primaryThreat,
    recommendations: {
      en: recommendationEn,
      mr: recommendationMr,
      hi: recommendationHi,
      te: recommendationTe
    }
  };
}

/**
 * Fetch real-time weather from Open-Meteo for a given district
 */
export async function fetchDistrictWeather(districtName) {
  const coords = DISTRICT_COORDINATES[districtName] || DISTRICT_COORDINATES['Pune'];
  const cacheKey = `${coords.lat},${coords.lng}`;

  const cached = WEATHER_CACHE.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    
    // 4-second timeout for resilient network UX
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Open-Meteo HTTP error: ${res.status}`);

    const data = await res.json();
    const current = data.current || {};
    const temp = current.temperature_2m !== undefined ? Math.round(current.temperature_2m) : 28;
    const humidity = current.relative_humidity_2m !== undefined ? Math.round(current.relative_humidity_2m) : 74;
    const precip = current.precipitation !== undefined ? current.precipitation : 0;
    const windSpeed = current.wind_speed_10m !== undefined ? current.wind_speed_10m : 12;

    const vectorAssessment = calculateVectorRisk(temp, humidity, precip);

    const result = {
      district: districtName,
      state: coords.state,
      lat: coords.lat,
      lng: coords.lng,
      temperature: temp,
      humidity: humidity,
      precipitation: precip,
      windSpeed: windSpeed,
      vectorRisk: vectorAssessment,
      isLive: true,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Open-Meteo Weather API (Live)'
    };

    WEATHER_CACHE.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;
  } catch (err) {
    console.warn(`[WeatherService] Fallback to simulated regional seasonal metrics for ${districtName}:`, err.message);
    
    // Realistic seasonal baseline fallback for Maharashtra/AP (Monsoon/Post-Monsoon tropical)
    const baseTemp = coords.state === 'Andhra Pradesh' ? 31 : 29;
    const baseHum = 76;
    const vectorAssessment = calculateVectorRisk(baseTemp, baseHum, 0.4);

    const fallback = {
      district: districtName,
      state: coords.state,
      lat: coords.lat,
      lng: coords.lng,
      temperature: baseTemp,
      humidity: baseHum,
      precipitation: 0.4,
      windSpeed: 11,
      vectorRisk: vectorAssessment,
      isLive: false,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Regional Agro-Meteorological Baseline (Offline Mode)'
    };

    WEATHER_CACHE.set(cacheKey, { timestamp: Date.now(), data: fallback });
    return fallback;
  }
}
