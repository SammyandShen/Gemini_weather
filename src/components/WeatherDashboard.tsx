import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import { Calendar, Droplets, MapPin, Search, Wind, CloudRain, Leaf, Sun } from "lucide-react";
import { motion } from "motion/react";

import { fetchWeatherData } from "../services/weatherService";
import { WeatherIcon } from "./WeatherIcon";
import { TemperatureChart } from "./TemperatureChart";
import { RecommendationModal } from "./RecommendationModal";

export function WeatherDashboard() {
  const [locationInput, setLocationInput] = useState("Beijing");
  const [location, setLocation] = useState("Beijing");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedDayForModal, setSelectedDayForModal] = useState<any>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["weather", location, selectedDate],
    queryFn: () => fetchWeatherData(location, selectedDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      setLocation(locationInput.trim());
    }
  };

  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(new Date(), i);
    return format(d, "yyyy-MM-dd");
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header & Search */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 p-2 rounded-xl">
              <CloudRain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">WeatherAI</h1>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Search city..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-neutral-500"
            />
          </form>
        </header>

        {/* Date Selector */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedDate === date
                  ? "bg-indigo-500 text-white"
                  : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
              }`}
            >
              {format(new Date(date), "MMM d")}
            </button>
          ))}
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : isError ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-center">
            <p>Failed to load weather data. Please try again.</p>
            <p className="text-sm opacity-80 mt-1">{(error as Error).message}</p>
          </div>
        ) : data ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            
            {/* Current Weather Card */}
            <div className="lg:col-span-1 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl p-6 flex flex-col justify-between shadow-lg shadow-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-20">
                <WeatherIcon condition={data.current.condition} className="w-64 h-64" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-indigo-100 mb-8">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{data.locationName}</span>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-7xl font-light tracking-tighter">
                    {Math.round(data.current.temperature)}°
                  </h2>
                  <p className="text-xl font-medium text-indigo-50 capitalize">
                    {data.current.condition}
                  </p>
                </div>
              </div>
              
              <div className="relative z-10 grid grid-cols-2 gap-4 mt-12 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <Wind className="w-5 h-5 text-indigo-200" />
                  <div>
                    <p className="text-xs text-indigo-200">Wind</p>
                    <p className="font-medium">{data.current.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-indigo-200" />
                  <div>
                    <p className="text-xs text-indigo-200">Humidity</p>
                    <p className="font-medium">{data.current.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5 text-indigo-200" />
                  <div>
                    <p className="text-xs text-indigo-200">UV Index</p>
                    <p className="font-medium">{data.current.uvIndex}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Leaf className="w-5 h-5 text-indigo-200" />
                  <div>
                    <p className="text-xs text-indigo-200">AQI</p>
                    <p className="font-medium">{data.current.aqi}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts & Hourly */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Temperature Trend */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Temperature Trend</h3>
                  <span className="text-sm text-neutral-400">{format(new Date(selectedDate), "MMMM d, yyyy")}</span>
                </div>
                <TemperatureChart data={data.hourly} />
              </div>

              {/* Hourly Forecast */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
                <h3 className="text-lg font-medium mb-4">Hourly Forecast</h3>
                <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
                  {data.hourly.map((hour, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 min-w-[4.5rem] p-3 rounded-2xl bg-neutral-950/50 border border-neutral-800/50">
                      <span className="text-sm text-neutral-400">{hour.time}</span>
                      <WeatherIcon condition={hour.condition} className="w-6 h-6 text-neutral-200" />
                      <span className="text-lg font-medium">{Math.round(hour.temperature)}°</span>
                      <div className="flex items-center gap-1 text-xs text-blue-400">
                        <Droplets className="w-3 h-3" />
                        {hour.precipitationProbability}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>

            {/* 7-Day Forecast */}
            <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-neutral-400" />
                <h3 className="text-lg font-medium">7-Day Forecast</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {data.daily.map((day, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedDayForModal(day)}
                    className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 p-4 rounded-2xl bg-neutral-950/50 border border-neutral-800/50 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-neutral-300 w-16 md:w-auto text-left md:text-center">
                      {idx === 0 ? "Today" : format(new Date(day.date), "EEE")}
                    </span>
                    
                    <WeatherIcon condition={day.condition} className="w-8 h-8 text-neutral-200" />
                    
                    <div className="flex items-center gap-3 w-24 md:w-auto justify-end md:justify-center">
                      <span className="text-sm font-medium">{Math.round(day.maxTemp)}°</span>
                      <span className="text-sm text-neutral-500">{Math.round(day.minTemp)}°</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-blue-400 w-12 md:w-auto justify-end md:justify-center">
                      <Droplets className="w-3 h-3" />
                      {day.precipitationProbability}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        ) : null}

        {data && (
          <RecommendationModal 
            isOpen={!!selectedDayForModal} 
            onClose={() => setSelectedDayForModal(null)} 
            dayData={selectedDayForModal} 
            currentAqi={data.current.aqi}
          />
        )}
      </div>
    </div>
  );
}
