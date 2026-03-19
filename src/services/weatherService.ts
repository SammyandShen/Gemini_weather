export interface WeatherData {
  locationName: string;
  current: {
    temperature: number;
    condition: string;
    precipitationProbability: number;
    windSpeed: number;
    humidity: number;
    uvIndex: number;
    aqi: number;
  };
  hourly: {
    time: string;
    temperature: number;
    condition: string;
    precipitationProbability: number;
  }[];
  daily: {
    date: string;
    minTemp: number;
    maxTemp: number;
    condition: string;
    precipitationProbability: number;
    uvIndex: number;
  }[];
}

function mapWMOCodeToCondition(code: number): string {
  if (code === 0) return "Clear";
  if (code === 1 || code === 2 || code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 56 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 66 && code <= 67) return "Rain";
  if (code >= 71 && code <= 75) return "Snow";
  if (code === 77) return "Snow";
  if (code >= 80 && code <= 82) return "Shower";
  if (code >= 85 && code <= 86) return "Snow";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Unknown";
}

export async function fetchWeatherData(location: string, date: string): Promise<WeatherData> {
  // 1. Geocoding
  const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
  const geoData = await geoRes.json();
  
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`Location "${location}" not found.`);
  }
  
  const { latitude, longitude, name, country } = geoData.results[0];
  const locationName = country ? `${name}, ${country}` : name;

  // 2. Weather Forecast
  const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,uv_index&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=auto`);
  const weatherData = await weatherRes.json();

  // 3. Air Quality
  let currentAqi = 0;
  try {
    const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi&timezone=auto`);
    const aqiData = await aqiRes.json();
    currentAqi = aqiData.current?.us_aqi || 0;
  } catch (e) {
    console.error("Failed to fetch AQI", e);
  }

  // 4. Map Data
  const currentCondition = mapWMOCodeToCondition(weatherData.current.weather_code);
  
  // Find current hour index to get current precipitation probability
  const currentHourStr = weatherData.current.time.slice(0, 13) + ":00";
  const currentHourIdx = weatherData.hourly.time.findIndex((t: string) => t === currentHourStr);
  const currentPrecipProb = currentHourIdx !== -1 ? weatherData.hourly.precipitation_probability[currentHourIdx] : 0;

  // Filter hourly data for the selected date
  const hourlyData = [];
  for (let i = 0; i < weatherData.hourly.time.length; i++) {
    const timeStr = weatherData.hourly.time[i]; // "YYYY-MM-DDTHH:mm"
    if (timeStr.startsWith(date)) {
      hourlyData.push({
        time: timeStr.slice(11, 16), // "HH:mm"
        temperature: weatherData.hourly.temperature_2m[i],
        condition: mapWMOCodeToCondition(weatherData.hourly.weather_code[i]),
        precipitationProbability: weatherData.hourly.precipitation_probability[i],
      });
    }
  }

  const dailyData = [];
  for (let i = 0; i < weatherData.daily.time.length; i++) {
    dailyData.push({
      date: weatherData.daily.time[i],
      minTemp: weatherData.daily.temperature_2m_min[i],
      maxTemp: weatherData.daily.temperature_2m_max[i],
      condition: mapWMOCodeToCondition(weatherData.daily.weather_code[i]),
      precipitationProbability: weatherData.daily.precipitation_probability_max[i],
      uvIndex: weatherData.daily.uv_index_max[i],
    });
  }

  return {
    locationName,
    current: {
      temperature: weatherData.current.temperature_2m,
      condition: currentCondition,
      precipitationProbability: currentPrecipProb,
      windSpeed: weatherData.current.wind_speed_10m,
      humidity: weatherData.current.relative_humidity_2m,
      uvIndex: weatherData.current.uv_index,
      aqi: currentAqi,
    },
    hourly: hourlyData,
    daily: dailyData,
  };
}
