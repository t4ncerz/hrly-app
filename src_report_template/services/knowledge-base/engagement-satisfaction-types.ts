export interface EngagementSatisfactionEntry {
  area: string;
  scale_1_level: string;
  scale_1_definition: string;
  scale_1_recommendations: string[];
  scale_2_level: string;
  scale_2_definition: string;
  scale_2_recommendations: string[];
  scale_3_level: string;
  scale_3_definition: string;
  scale_3_recommendations: string[];
  scale_4_level: string;
  scale_4_definition: string;
  scale_4_recommendations: string[];
  scale_5_level: string;
  scale_5_definition: string;
  scale_5_recommendations: string[];
  general_description: string;
  linked_indicators: string;
  area_definition: string;
}

export type EngagementSatisfactionMap = Map<
  string,
  EngagementSatisfactionEntry
>;

export interface EngagementSatisfactionAnalysis {
  level: 1 | 2 | 3 | 4 | 5;
  definition: string;
  recommendations: string[];
  linked_indicators: string;
}
