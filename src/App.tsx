/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WeatherDashboard } from "./components/WeatherDashboard";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherDashboard />
    </QueryClientProvider>
  );
}
