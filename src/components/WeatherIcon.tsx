import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun } from "lucide-react";

export function WeatherIcon({ condition, className }: { condition: string; className?: string }) {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes("sunny") || lowerCondition.includes("clear")) {
    return <Sun className={className} />;
  }
  if (lowerCondition.includes("rain") || lowerCondition.includes("shower")) {
    return <CloudRain className={className} />;
  }
  if (lowerCondition.includes("drizzle")) {
    return <CloudDrizzle className={className} />;
  }
  if (lowerCondition.includes("snow")) {
    return <CloudSnow className={className} />;
  }
  if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) {
    return <CloudLightning className={className} />;
  }
  if (lowerCondition.includes("fog") || lowerCondition.includes("mist")) {
    return <CloudFog className={className} />;
  }
  
  return <Cloud className={className} />;
}
