import React from "react";
import { X, Shirt, ShieldAlert, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { getClothingRecommendation } from "../lib/recommendations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dayData: any;
  currentAqi: number;
}

export function RecommendationModal({ isOpen, onClose, dayData, currentAqi }: Props) {
  if (!dayData) return null;

  const rec = getClothingRecommendation(
    dayData.minTemp,
    dayData.maxTemp,
    dayData.condition,
    dayData.precipitationProbability,
    dayData.uvIndex,
    currentAqi
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 z-50 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-neutral-100">
                Recommendations for {format(new Date(dayData.date), "MMM d, yyyy")}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                  <Shirt className="w-5 h-5" />
                  <h3 className="font-medium">Clothing</h3>
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed">{rec.outfit}</p>
              </div>

              {rec.accessories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-amber-400 mb-2">
                    <Sun className="w-5 h-5" />
                    <h3 className="font-medium">Accessories</h3>
                  </div>
                  <ul className="list-disc list-inside text-neutral-300 text-sm space-y-1">
                    {rec.accessories.map((acc, i) => (
                      <li key={i}>{acc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {rec.warning && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">{rec.warning}</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
