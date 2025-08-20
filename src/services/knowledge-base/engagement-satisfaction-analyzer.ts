import {
  EngagementSatisfactionEntry,
  EngagementSatisfactionAnalysis,
} from "./engagement-satisfaction-types";

/**
 * Zwraca poziom oceny (1-5) na podstawie wyniku.
 */
export function getEngagementSatisfactionLevel(
  score: number
): 1 | 2 | 3 | 4 | 5 {
  const roundedScore = Math.round(score);
  if (roundedScore <= 1) return 1;
  if (roundedScore >= 5) return 5;
  return roundedScore as 1 | 2 | 3 | 4 | 5;
}

/**
 * Zwraca rekomendacje dla danego poziomu oceny zaangażowania/satysfakcji.
 */
export function getEngagementSatisfactionRecommendations(
  entry: EngagementSatisfactionEntry,
  score: number
): string[] {
  const level = getEngagementSatisfactionLevel(score);
  return entry[`scale_${level}_recommendations`] || [];
}

/**
 * Zwraca definicję skali dla danego poziomu oceny zaangażowania/satysfakcji.
 */
export function getEngagementSatisfactionDefinition(
  entry: EngagementSatisfactionEntry,
  score: number
): string {
  const level = getEngagementSatisfactionLevel(score);
  return entry[`scale_${level}_definition`] || "";
}

/**
 * Analizuje poziom zaangażowania lub satysfakcji na podstawie wyniku.
 */
export function analyzeEngagementSatisfaction(
  entry: EngagementSatisfactionEntry,
  score: number
): EngagementSatisfactionAnalysis {
  const level = getEngagementSatisfactionLevel(score);

  return {
    level,
    definition: getEngagementSatisfactionDefinition(entry, score),
    recommendations: getEngagementSatisfactionRecommendations(entry, score),
    linked_indicators: entry.linked_indicators,
  };
}
