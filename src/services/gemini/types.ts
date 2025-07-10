// Types for Gemini service

export interface SurveyDataItem {
  area_id: string;
  area_name_pl: string;
  area_name_en: string;
  factor_id: string;
  factor_name_pl: string;
  factor_name_en: string;
  question: string;
  score: number;
}

export interface SurveyRespondent {
  id: string;
  details: {
    department?: string;
    [key: string]: string | number | undefined;
  };
  scores: SurveyDataItem[];
}

export interface AreaStatistics {
  overall: number[];
  departments: { [key: string]: number[] };
}

export interface DetailedAreaData {
  area_name: string;
  overall_average: number;
  factor_scores: { [key: string]: number };
  team_scores: { [key: string]: number };
}

export interface StatisticsResult {
  engagement: number;
  satisfaction: number;
  lowest3: Array<{
    area: string;
    average: number;
    range: string;
  }>;
  highest3: Array<{
    area: string;
    average: number;
    range: string;
  }>;
  detailed_areas: DetailedAreaData[];
  departments: string[];
}

export interface InitialAnalysisResult {
  title_page: {
    company_name: string;
    report_title: string;
  };
  table_of_contents: {
    title: string;
    items: string[];
  };
  overall_analysis: {
    engagement: {
      overall_score: number;
      title: string;
    };
    satisfaction: {
      overall_score: number;
      title: string;
    };
    top_scores: {
      lowest: {
        title: string;
        data: Array<{
          area: string;
          average: number;
          range: string;
        }>;
        insight: string;
      };
      highest: {
        title: string;
        data: Array<{
          area: string;
          average: number;
          range: string;
        }>;
        insight: string;
      };
    };
  };
  detailed_areas: DetailedAreaData[];
  departments: string[];
}

export interface KnowledgeBaseLevel {
  description: string;
  recommendations: string[];
}

export interface KnowledgeBaseFactor {
  "1": KnowledgeBaseLevel;
  "2": KnowledgeBaseLevel;
  "3": KnowledgeBaseLevel;
  "4": KnowledgeBaseLevel;
  "5": KnowledgeBaseLevel;
  businessImpact: string;
}

export interface KnowledgeBaseArea {
  [factorName: string]: KnowledgeBaseFactor;
}

export interface KnowledgeBase {
  [areaName: string]: KnowledgeBaseArea;
}

export interface OverallContentResult {
  engagement: {
    main_description: string;
    attitude_points: string[];
    duties_points: string[];
    loyalty_points: string[];
    business_impact: string;
  };
  satisfaction: {
    main_description: string;
    attitude_points: string[];
    duties_points: string[];
    loyalty_points: string[];
    business_impact: string;
  };
  top_scores_insights: {
    lowest_insight: string;
    highest_insight: string;
  };
}

export interface DetailedAreaContent extends DetailedAreaData {
  company_summary: {
    title: string;
    overall_average_text: string;
    sub_areas_breakdown: Array<{
      name: string;
      value: string;
      score: string;
    }>;
    key_findings_header: string;
    key_findings_points: string[];
    summary_header: string;
    summary_paragraph: string;
  };
  team_breakdown: {
    title: string;
    table_headers: string[];
    data: Array<{
      [key: string]: string | string[];
    }>;
  };
  organizational_recommendations: {
    title: string;
    recommendation_blocks: Array<{
      title: string;
      points: string[];
    }>;
  };
  business_impact: {
    title: string;
    points: string[];
  };
}

export interface LeaderGuideline {
  department: string;
  start: string[];
  stop: string[];
  continue: string[];
  welcome: string[];
}

export interface ApiResponse {
  [key: string]: unknown;
}
