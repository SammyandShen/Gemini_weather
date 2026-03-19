export interface Recommendation {
  outfit: string;
  accessories: string[];
  warning?: string;
}

export function getClothingRecommendation(
  minTemp: number,
  maxTemp: number,
  condition: string,
  precipProb: number,
  uvIndex: number,
  aqi: number
): Recommendation {
  let outfit = "";
  const accessories: string[] = [];
  let warning = undefined;

  const avgTemp = (minTemp + maxTemp) / 2;

  if (maxTemp >= 28) {
    outfit = "Light, breathable clothing like t-shirts, shorts, or summer dresses. Linen or cotton fabrics are ideal.";
  } else if (maxTemp >= 20) {
    outfit = "Short sleeves or light long sleeves with jeans or trousers. A light jacket might be needed for the evening.";
  } else if (maxTemp >= 10) {
    outfit = "Layers are key. A long-sleeve shirt with a sweater or a medium-weight jacket. Long pants are recommended.";
  } else if (maxTemp >= 0) {
    outfit = "Warm clothing. A heavy coat, sweater, and thermal innerwear if you'll be outside for long.";
  } else {
    outfit = "Extreme cold gear. Heavy winter coat, thermal layers, insulated pants.";
  }

  if (precipProb > 40 || condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("shower")) {
    accessories.push("Umbrella or raincoat");
    accessories.push("Water-resistant shoes");
  }

  if (uvIndex >= 6) {
    accessories.push("Sunglasses");
    accessories.push("Sunscreen (SPF 30+)");
    accessories.push("Wide-brimmed hat");
  } else if (uvIndex >= 3) {
    accessories.push("Sunscreen");
  }

  if (minTemp < 10) {
    accessories.push("Scarf and light gloves for the morning/evening");
  }
  if (minTemp < 0) {
    accessories.push("Warm gloves, winter hat, and thick socks");
  }

  if (aqi > 150) {
    warning = "Air quality is unhealthy. Consider wearing an N95 mask outdoors and limit prolonged outdoor exertion.";
  } else if (aqi > 100) {
    warning = "Air quality is unhealthy for sensitive groups. Reduce prolonged outdoor exertion if you are sensitive.";
  }

  return { outfit, accessories, warning };
}
