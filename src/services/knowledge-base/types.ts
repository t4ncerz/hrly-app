export interface KnowledgeBaseEntry {
  factor: string;
  area: string;
  factor_definition: string;
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
  business_impact: string;
  employee_attitude: string;
  linked_indicators: string;
  recommendations: string; // This seems to be a general recommendations field
}

export type KnowledgeBaseMap = Map<string, KnowledgeBaseEntry>;
