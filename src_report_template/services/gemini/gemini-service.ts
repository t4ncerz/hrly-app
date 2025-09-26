import { ExaminationTable, ReportContent } from "@/drizzle/schema";
import {
  SurveyRespondent,
  DetailedAreaData,
  StatisticsResult,
  InitialAnalysisResult,
  OverallContentResult,
  DetailedAreaContent,
  LeaderGuideline,
} from "./types";
import { getKnowledgeBaseProviderAsync } from "../knowledge-base/provider";
import { KnowledgeBaseMap, KnowledgeBaseEntry } from "../knowledge-base/types";
import { getEngagementSatisfactionProviderAsync } from "../knowledge-base/engagement-satisfaction-provider";
import { analyzeEngagementSatisfaction } from "../knowledge-base/engagement-satisfaction-analyzer";

// --- KROK 1: POBRANIE BAZY WIEDZY ---
let KB: KnowledgeBaseMap | null = null;

async function ensureKnowledgeBase(
  baseUrl?: string
): Promise<KnowledgeBaseMap> {
  if (!KB) {
    KB = await getKnowledgeBaseProviderAsync(baseUrl);
  }
  return KB;
}

// --- KROK 2: FUNKCJE POMOCNICZE ---

/**
 * Normalizuje tekst do porównywania (małe litery, bez polskich znaków, 1 spacja).
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Znajduje wpis KB po nazwie czynnika z tolerancją na diakrytyki i spacje.
 */
function findEntryByFactorName(
  factorName: string
): KnowledgeBaseEntry | undefined {
  if (!KB) return undefined;
  const direct = KB.get(factorName);
  if (direct) return direct;
  const target = normalize(factorName);
  for (const [key, entry] of KB.entries()) {
    if (normalize(key) === target) return entry;
  }
  return undefined;
}

/**
 * Zwraca poziom oceny (1-5) na podstawie wyniku.
 */
function getScoreLevel(score: number): 1 | 2 | 3 | 4 | 5 {
  const roundedScore = Math.round(score);
  if (roundedScore <= 1) return 1;
  if (roundedScore >= 5) return 5;
  return roundedScore as 1 | 2 | 3 | 4 | 5;
}

/**
 * Zwraca rekomendacje dla danego poziomu oceny.
 */
function getRecommendationsForLevel(
  entry: KnowledgeBaseEntry,
  score: number
): string[] {
  const level = getScoreLevel(score);
  const recs = entry[`scale_${level}_recommendations`] || [];
  if (recs.length > 0) return recs;
  // Fallback: jeśli brak rekomendacji poziomu, użyj ogólnych (jeśli są)
  if (entry.recommendations) {
    return entry.recommendations
      .split(/\n+|;\s*|\d\.\s+/)
      .map((r) => r.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Zwraca definicję skali dla danego poziomu oceny.
 */
function getDefinitionForLevel(
  entry: KnowledgeBaseEntry,
  score: number
): string {
  const level = getScoreLevel(score);
  return entry[`scale_${level}_definition`] || entry.factor_definition || "";
}

/**
 * Sortuje czynniki według wyniku.
 */
function sortFactors(
  factorScores: { [key: string]: number },
  direction: "asc" | "desc" = "asc"
): [string, number][] {
  return Object.entries(factorScores).sort(([, scoreA], [, scoreB]) =>
    direction === "asc" ? scoreA - scoreB : scoreB - scoreA
  );
}

// --- KROK 3: GŁÓWNA LOGIKA GENEROWANIA RAPORTU ---

export async function generateReport(
  examinations: (typeof ExaminationTable.$inferSelect)[],
  opts?: { baseUrl?: string }
): Promise<ReportContent> {
  try {
    // Ensure KB is loaded (via fetch on Vercel)
    await ensureKnowledgeBase(opts?.baseUrl);

    const surveyData =
      examinations.length > 0
        ? examinations.map((e) => e.sourceData).flat()
        : null;
    if (!surveyData || surveyData.length === 0) {
      throw new Error(
        "Brak danych źródłowych (sourceData) w obiekcie badania."
      );
    }

    const analysisData = await getInitialAnalysis(
      surveyData as SurveyRespondent[],
      opts
    );
    const departments = analysisData.departments || [];

    const resolvedDetailedAreas: DetailedAreaContent[] =
      analysisData.detailed_areas.map((areaData) => {
        console.log(
          `Rozpoczynam generowanie dla obszaru: ${areaData.area_name}`
        );
        const content = generateDetailedAreaContent(areaData, departments);
        console.log(
          `Zakończono generowanie dla obszaru: ${areaData.area_name}`
        );
        return content;
      });

    const leaderGuidelines = generateLeaderGuidelines(
      resolvedDetailedAreas,
      departments
    );

    const overallContent = generateOverallContent(
      analysisData.overall_analysis,
      resolvedDetailedAreas
    );

    const mergedOverallAnalysis = {
      ...analysisData.overall_analysis,
      engagement: {
        ...analysisData.overall_analysis.engagement,
        ...overallContent.engagement,
        businessImpact: overallContent.engagement.business_impact,
        recommendations:
          analysisData.overall_analysis.engagement.recommendations || [],
      },
      satisfaction: {
        ...analysisData.overall_analysis.satisfaction,
        ...overallContent.satisfaction,
        businessImpact: overallContent.satisfaction.business_impact,
        recommendations:
          analysisData.overall_analysis.satisfaction.recommendations || [],
      },
      top_scores: {
        ...analysisData.overall_analysis.top_scores,
        lowest: {
          ...analysisData.overall_analysis.top_scores.lowest,
          insight: overallContent.top_scores_insights?.lowest_insight || "",
        },
        highest: {
          ...analysisData.overall_analysis.top_scores.highest,
          insight: overallContent.top_scores_insights?.highest_insight || "",
        },
      },
    };

    const finalReport: ReportContent = {
      title_page: analysisData.title_page,
      table_of_contents: analysisData.table_of_contents,
      overall_analysis: mergedOverallAnalysis,
      detailed_areas: resolvedDetailedAreas,
      leader_guidelines: leaderGuidelines,
    };

    return finalReport;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Wystąpił krytyczny błąd podczas generowania raportu: ${errorMessage}`
    );
  }
}

function calculateStatistics(surveyData: SurveyRespondent[]): StatisticsResult {
  const departments = [
    ...new Set(
      surveyData
        .map((r) => r.details?.department)
        .filter((d): d is string => !!d)
    ),
  ];
  const stats: {
    [area: string]: {
      [factor: string]: {
        scores: number[];
        team_scores: { [dept: string]: number[] };
      };
    };
  } = {};

  surveyData.forEach((respondent) => {
    const department = respondent.details?.department;
    respondent.scores.forEach((item) => {
      if (item.score === null || !item.area_name_pl || !item.factor_name_pl)
        return;

      const { area_name_pl: area, factor_name_pl: factor } = item;
      let score = Number(item.score);
      // Normalizacja skali 0-10 do 1-5
      if (score > 5) score = (score / 10) * 5;

      if (!stats[area]) stats[area] = {};
      if (!stats[area][factor]) {
        stats[area][factor] = { scores: [], team_scores: {} };
        departments.forEach((dept) => {
          if (stats[area] && stats[area][factor]) {
            stats[area][factor].team_scores[dept] = [];
          }
        });
      }

      stats[area][factor].scores.push(score);
      if (department && stats[area][factor].team_scores[department]) {
        stats[area][factor].team_scores[department].push(score);
      }
    });
  });

  const detailed_areas: DetailedAreaData[] = [];
  const areaAverages: { [area: string]: number } = {};

  for (const area in stats) {
    const factor_scores: { [factor: string]: number } = {};
    const team_scores: { [dept: string]: number } = {};
    let areaTotalScores: number[] = [];

    for (const factor in stats[area]) {
      const factorData = stats[area][factor];
      if (factorData && factorData.scores.length > 0) {
        const factorAvg =
          factorData.scores.reduce((a, b) => a + b, 0) /
          factorData.scores.length;
        factor_scores[factor] = Math.round(factorAvg * 100) / 100;
        areaTotalScores = areaTotalScores.concat(factorData.scores);
      }
    }

    departments.forEach((dept) => {
      let deptTotalScores: number[] = [];
      for (const factor in stats[area]) {
        const factorData = stats[area][factor];
        const teamScores = factorData?.team_scores[dept];
        if (teamScores && teamScores.length > 0) {
          deptTotalScores = deptTotalScores.concat(teamScores);
        }
      }
      team_scores[dept] =
        deptTotalScores.length > 0
          ? Math.round(
              (deptTotalScores.reduce((a, b) => a + b, 0) /
                deptTotalScores.length) *
                100
            ) / 100
          : 0;
    });

    const overall_average =
      areaTotalScores.length > 0
        ? Math.round(
            (areaTotalScores.reduce((a, b) => a + b, 0) /
              areaTotalScores.length) *
              100
          ) / 100
        : 0;
    if (overall_average > 0) {
      // Tylko dodaj obszary z wynikami
      areaAverages[area] = overall_average;
      detailed_areas.push({
        area_name: area,
        overall_average,
        factor_scores,
        team_scores,
      });
    }
  }

  const sortedAreas = Object.entries(areaAverages).sort(
    ([, a], [, b]) => a - b
  );
  const lowest3 = sortedAreas.slice(0, 3).map(([area, average]) => ({
    area,
    average: Number(average.toFixed(2)),
    range: "1-5",
  }));
  const highest3 = sortedAreas
    .slice(-3)
    .reverse()
    .map(([area, average]) => ({
      area,
      average: Number(average.toFixed(2)),
      range: "1-5",
    }));

  // Użyj średnich z obszarów do obliczenia zaangażowania i satysfakcji
  const engagement = areaAverages["Uznanie i docenianie"]
    ? Number(areaAverages["Uznanie i docenianie"].toFixed(2))
    : 0;
  const satisfaction = areaAverages["Środowisko Pracy i Kultura organizacyjna"]
    ? Number(
        areaAverages["Środowisko Pracy i Kultura organizacyjna"].toFixed(2)
      )
    : 0;

  return {
    engagement,
    satisfaction,
    lowest3,
    highest3,
    detailed_areas,
    departments,
  };
}

async function getInitialAnalysis(
  surveyData: SurveyRespondent[],
  opts?: { baseUrl?: string }
): Promise<InitialAnalysisResult> {
  const stats = calculateStatistics(surveyData);

  // Pobierz bazę danych zaangażowania i satysfakcji (async)
  const engagementSatisfactionBase =
    await getEngagementSatisfactionProviderAsync(opts?.baseUrl);

  // Analizuj poziom zaangażowania
  const engagementEntry = engagementSatisfactionBase.get("Zaangażowanie");
  const engagementAnalysis = engagementEntry
    ? analyzeEngagementSatisfaction(engagementEntry, stats.engagement)
    : null;

  // Analizuj poziom satysfakcji
  const satisfactionEntry = engagementSatisfactionBase.get("Satysfakcja");
  const satisfactionAnalysis = satisfactionEntry
    ? analyzeEngagementSatisfaction(satisfactionEntry, stats.satisfaction)
    : null;

  return {
    title_page: {
      company_name: "HRLY",
      report_title: "ANALIZA HR I REKOMENDACJE STRATEGICZNE DLA BIZNESU",
    },
    table_of_contents: {
      title: "Co znajdziesz w raporcie?",
      items: [
        "POZIOM ZAANGAŻOWANIA I SATYSFAKCJI W FIRMIE",
        "KORELACJE POZIOMU SATYSFAKCJI I ZAANGAŻOWANIA NA BIZNES",
        "OMÓWIENIE OBSZARÓW BADAWCZYCH",
        "REKOMENDACJE DO KAŻDEGO OBSZARU BADAWCZEGO",
        "REKOMENDACJE DLA MANAGERÓW POSZCZEGÓLNYCH DZIAŁÓW",
      ],
    },
    overall_analysis: {
      engagement: {
        overall_score: stats.engagement,
        title: "Poziom zaangażowania w całej organizacji",
        level: engagementAnalysis?.level,
        definition: engagementAnalysis?.definition,
        recommendations: engagementAnalysis?.recommendations,
        linked_indicators: engagementAnalysis?.linked_indicators,
      },
      satisfaction: {
        overall_score: stats.satisfaction,
        title: "Poziom satysfakcji w całej organizacji",
        level: satisfactionAnalysis?.level,
        definition: satisfactionAnalysis?.definition,
        recommendations: satisfactionAnalysis?.recommendations,
        linked_indicators: satisfactionAnalysis?.linked_indicators,
      },
      top_scores: {
        lowest: {
          title: "TOP 3 z najniższymi wynikami",
          data: stats.lowest3,
          insight: "",
        },
        highest: {
          title: "TOP 3 z najwyższymi wynikami",
          data: stats.highest3,
          insight: "",
        },
      },
    },
    detailed_areas: stats.detailed_areas,
    departments: stats.departments,
  };
}

function generateOverallContent(
  overallData: InitialAnalysisResult["overall_analysis"],
  detailedAreas: DetailedAreaContent[]
): OverallContentResult {
  const engagementAreaName = "Uznanie i docenianie";
  const satisfactionAreaName = "Środowisko Pracy i Kultura organizacyjna";

  const findArea = (name: string) =>
    detailedAreas.find((a) => a.area_name === name);

  const getAreaProperty = (
    areaName: string,
    property: keyof KnowledgeBaseEntry
  ): string => {
    const area = findArea(areaName);
    if (!area) return "Brak danych.";

    const sortedFactors = sortFactors(area.factor_scores, "asc");
    const lowestFactorName = sortedFactors[0]?.[0];

    if (!lowestFactorName) return "Brak danych o czynnikach.";
    const entry = findEntryByFactorName(lowestFactorName);
    return (entry?.[property] as string) || `Brak danych dla '${property}'.`;
  };

  const generateTopInsights = (
    areas: { area: string; average: number }[],
    type: "lowest" | "highest"
  ): string => {
    return areas
      .map((areaData) => {
        const areaDetails = findArea(areaData.area);
        if (!areaDetails)
          return `Brak szczegółowych danych dla obszaru ${areaData.area}.`;

        const sortedFactors = sortFactors(
          areaDetails.factor_scores,
          type === "lowest" ? "asc" : "desc"
        );
        const keyFactorName = sortedFactors[0]?.[0];
        if (!keyFactorName)
          return `Brak czynników dla obszaru ${areaData.area}.`;

        const entry = findEntryByFactorName(keyFactorName);
        if (!entry)
          return `Brak danych w bazie wiedzy dla czynnika ${keyFactorName}.`;

        const definition = getDefinitionForLevel(entry, areaData.average);
        const prefix =
          type === "lowest"
            ? "Kluczowym wyzwaniem jest"
            : "Największą siłą jest";
        return `Obszar "${areaData.area}" (${areaData.average.toFixed(
          2
        )}): ${prefix} "${keyFactorName}". ${definition}`;
      })
      .join(" ");
  };

  return {
    engagement: {
      main_description: getAreaProperty(
        engagementAreaName,
        "factor_definition"
      ),
      attitude_points: [],
      duties_points: [],
      loyalty_points: [],
      business_impact: getAreaProperty(engagementAreaName, "business_impact"),
    },
    satisfaction: {
      main_description: getAreaProperty(
        satisfactionAreaName,
        "factor_definition"
      ),
      attitude_points: [],
      duties_points: [],
      loyalty_points: [],
      business_impact: getAreaProperty(satisfactionAreaName, "business_impact"),
    },
    top_scores_insights: {
      lowest_insight: generateTopInsights(
        overallData.top_scores.lowest.data,
        "lowest"
      ),
      highest_insight: generateTopInsights(
        overallData.top_scores.highest.data,
        "highest"
      ),
    },
  };
}

function generateDetailedAreaContent(
  areaData: DetailedAreaData,
  departments: string[]
): DetailedAreaContent {
  const { factor_scores, team_scores, overall_average } = areaData;

  const sortedFactors = sortFactors(factor_scores, "asc");
  const lowestFactor = sortedFactors[0];

  const allRecommendations = Object.entries(factor_scores)
    .flatMap(([factorName, score]) => {
      const entry = findEntryByFactorName(factorName);
      return entry ? getRecommendationsForLevel(entry, score) : [];
    })
    .filter((value, index, self) => self.indexOf(value) === index); // Unique

  let summary_paragraph = "";
  let business_impact_points: string[] = [];
  if (lowestFactor) {
    const entry = findEntryByFactorName(lowestFactor[0]);
    if (entry) {
      summary_paragraph = entry.factor_definition;
      business_impact_points = [entry.business_impact];
    }
  }

  return {
    ...areaData,
    company_summary: {
      title: "Cała firma i zespoły",
      overall_average_text: `Średnia ocena ogólna: ${overall_average.toFixed(
        2
      )} (skala 1-5)`,
      sub_areas_breakdown: [],
      key_findings_header: "",
      key_findings_points: [],
      summary_header: "Podsumowanie",
      summary_paragraph,
    },
    team_breakdown: {
      title: "Omówienie wyników w zespołach",
      table_headers: ["Dział", "Wynik", "Interpretacja", "Jak poprawić wynik?"],
      data: departments.map((dept) => {
        const team_score = team_scores[dept] || 0;
        let interpretation = `Średni wynik dla działu ${dept} to ${team_score.toFixed(
          2
        )}.`;
        let team_recommendations: string[] = [
          "Brak szczegółowych rekomendacji.",
        ];

        if (lowestFactor) {
          const weakestFactorEntry = findEntryByFactorName(lowestFactor[0]);
          if (weakestFactorEntry) {
            interpretation = getDefinitionForLevel(
              weakestFactorEntry,
              team_score
            );
            team_recommendations = getRecommendationsForLevel(
              weakestFactorEntry,
              team_score
            );
          }
        }

        return {
          Dział: dept,
          Wynik: team_score.toFixed(2),
          Interpretacja: interpretation,
          "Jak poprawić wynik?": team_recommendations,
        };
      }),
    },
    organizational_recommendations: {
      title: "Rekomendacje dla całej organizacji",
      recommendation_blocks:
        allRecommendations.length > 0
          ? [
              {
                title: `Rekomendacje dla obszaru: ${areaData.area_name}`,
                points: allRecommendations,
              },
            ]
          : [],
    },
    business_impact: {
      title: "Jak to wpływa na biznes?",
      points: business_impact_points,
    },
  };
}

function generateLeaderGuidelines(
  detailedAreas: DetailedAreaContent[],
  departments: string[]
): LeaderGuideline[] {
  return departments.map((dept) => {
    const departmentScoresByArea = detailedAreas
      .map((area) => ({
        area_name: area.area_name,
        score: area.team_scores[dept] || 0,
        factor_scores: area.factor_scores,
      }))
      .sort((a, b) => a.score - b.score);

    const lowestAreas = departmentScoresByArea.slice(0, 2);
    const highestAreas = departmentScoresByArea.slice(-2).reverse();

    const startRecommendations = lowestAreas
      .flatMap((area) => {
        const sortedFactors = sortFactors(area.factor_scores, "asc");
        const weakestFactorName = sortedFactors[0]?.[0];
        if (!weakestFactorName) return [];

        const entry = findEntryByFactorName(weakestFactorName);
        const score = area.factor_scores[weakestFactorName];
        return entry && score !== undefined
          ? getRecommendationsForLevel(entry, score)
          : [];
      })
      .filter((value, index, self) => self.indexOf(value) === index); // Unique

    const continueActions = highestAreas.map(
      (area) => `Kontynuujcie dobre praktyki w obszarze: ${area.area_name}.`
    );

    return {
      department: dept,
      start: startRecommendations,
      stop: [],
      continue: continueActions,
      welcome: [],
    };
  });
}
