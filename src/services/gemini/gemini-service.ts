import { ExaminationTable, ReportContent } from "@/drizzle/schema";
import {
  GoogleGenerativeAI,
  GenerationConfig,
  GenerativeModel,
} from "@google/generative-ai";
import { env } from "@/data/env/server";
import {
  SurveyRespondent,
  DetailedAreaData,
  StatisticsResult,
  InitialAnalysisResult,
  OverallContentResult,
  DetailedAreaContent,
  LeaderGuideline,
  ApiResponse,
  KnowledgeBase,
} from "./types";

// --- KROK 1: NOWA, ZAHARDKODOWANA I SZCZEGÓŁOWA BAZA WIEDZY ---
function getKnowledgeBase(): KnowledgeBase {
  // Ta funkcja zawiera teraz zagnieżdżoną strukturę Obszar -> Czynnik -> Dane
  return {
    "Środowisko Pracy i Kultura organizacyjna": {
      "Komfort psychiczny w pracy": {
        "1": {
          description:
            "Pracownicy odczuwają silny stres i niechęć do pracy. Brak poczucia bezpieczeństwa paraliżuje inicjatywę i prowadzi do wypalenia zawodowego.",
          recommendations: [
            "Natychmiastowa interwencja HR w celu diagnozy i rozwiązania problemów.",
            "Szkolenia dla menedżerów z budowania bezpieczeństwa psychologicznego.",
            "Wprowadzenie anonimowych kanałów zgłaszania nieprawidłowości.",
          ],
        },
        "2": {
          description:
            "Pracownicy czują się niepewnie, a atmosfera jest napięta. Boją się popełniać błędy i unikać otwartej komunikacji.",
          recommendations: [
            "Warsztaty z komunikacji i rozwiązywania konfliktów.",
            "Regularne spotkania 1:1 menedżerów z pracownikami.",
            "Promowanie kultury otwartego feedbacku.",
          ],
        },
        "3": {
          description:
            "Atmosfera jest neutralna, ale brakuje poczucia pełnego bezpieczeństwa. Pracownicy wykonują obowiązki, ale bez entuzjazmu.",
          recommendations: [
            "Inicjatywy integracyjne budujące zaufanie w zespołach.",
            "Wprowadzenie programów wellbeingowych.",
            "Jasne zdefiniowanie wartości firmy i zasad współpracy.",
          ],
        },
        "4": {
          description:
            "Pracownicy czują się w większości bezpiecznie i komfortowo. Są otwarci na współpracę i dzielenie się pomysłami.",
          recommendations: [
            "Wzmacnianie pozytywnych praktyk przez liderów.",
            "Organizowanie wydarzeń firmowych celebrujących sukcesy.",
            "Włączenie pracowników w działania employer brandingowe.",
          ],
        },
        "5": {
          description:
            "Pracownicy czują się w pełni bezpiecznie, są szanowani i doceniani. Firma jest miejscem, gdzie można być sobą i rozwijać swój potencjał.",
          recommendations: [
            "Uczynienie z komfortu psychicznego filaru kultury organizacyjnej.",
            "Promowanie firmy jako wzoru do naśladowania.",
            "Programy mentorskie i wsparcia dla pracowników.",
          ],
        },
        businessImpact:
          "Niski komfort psychiczny prowadzi do wzrostu absencji, rotacji i spadku produktywności. Wysoki komfort buduje lojalność i innowacyjność.",
      },
      "Relacje z przełożonymi": {
        "1": {
          description:
            "Pracownicy nie ufają swoim przełożonym, komunikacja jest bardzo słaba lub konfliktowa. Brak wsparcia i jasnych oczekiwań.",
          recommendations: [
            "Pilne szkolenia dla menedżerów z umiejętności liderskich.",
            "Wprowadzenie oceny 360 stopni dla kadry zarządzającej.",
            "Mediacje w zespołach o najwyższym poziomie konfliktu.",
          ],
        },
        "2": {
          description:
            "Relacje są formalne i zdystansowane. Pracownicy otrzymują niewiele wsparcia, a feedback jest rzadki i często negatywny.",
          recommendations: [
            "Wdrożenie regularnych spotkań 1:1 (one-on-one).",
            "Szkolenia dla menedżerów z udzielania konstruktywnego feedbacku (np. model FUKO).",
            "Jasne zdefiniowanie celów i oczekiwań.",
          ],
        },
        "3": {
          description:
            "Relacje są poprawne, ale powierzchowne. Przełożeni koncentrują się na zadaniach, a nie na rozwoju i motywacji pracowników.",
          recommendations: [
            "Programy coachingowe i mentoringowe dla menedżerów.",
            "Wprowadzenie indywidualnych planów rozwoju dla pracowników.",
            "Inicjatywy integrujące menedżerów z zespołami.",
          ],
        },
        "4": {
          description:
            "Pracownicy ufają swoim przełożonym i czują ich wsparcie. Komunikacja jest otwarta, a cele są jasno komunikowane.",
          recommendations: [
            "Delegowanie większej odpowiedzialności i autonomii pracownikom.",
            "Promowanie liderów jako mentorów i coachów.",
            "Wspólne celebrowanie sukcesów zespołowych.",
          ],
        },
        "5": {
          description:
            "Przełożeni są postrzegani jako inspirujący liderzy i partnerzy. Budują zaufanie, motywują do rozwoju i tworzą znakomitą atmosferę.",
          recommendations: [
            "Programy rozwoju liderskiego dla najlepszych menedżerów.",
            "Uczynienie z jakości przywództwa kluczowego elementu strategii firmy.",
            "Wykorzystanie liderów w procesach employer brandingowych.",
          ],
        },
        businessImpact:
          "Słabe relacje z przełożonymi są główną przyczyną dobrowolnych odejść z pracy. Dobre przywództwo bezpośrednio przekłada się na zaangażowanie i wyniki zespołu.",
      },
      "Atmosfera w zespole": {
        "1": {
          description:
            "W zespole panują konflikty, brak jest współpracy i zaufania. Pracownicy rywalizują ze sobą zamiast wspierać.",
          recommendations: [
            "Interwencja facylitatora lub mediatora w zespole.",
            "Warsztaty z komunikacji i współpracy.",
            "Jasne określenie ról, celów i zasad współpracy w zespole.",
          ],
        },
        "2": {
          description:
            "Współpraca jest ograniczona do minimum. Brakuje integracji i poczucia wspólnego celu. Pojawiają się podgrupy i plotki.",
          recommendations: [
            "Organizacja warsztatów integracyjnych i team-buildingowych.",
            "Wprowadzenie wspólnych celów zespołowych i systemów nagród.",
            "Regularne spotkania zespołowe w celu poprawy komunikacji.",
          ],
        },
        "3": {
          description:
            "Atmosfera jest neutralna. Pracownicy są dla siebie uprzejmi, ale brakuje silniejszych więzi i ducha zespołowego.",
          recommendations: [
            "Inicjowanie nieformalnych spotkań i aktywności integracyjnych.",
            "Tworzenie wspólnych przestrzeni do relaksu i interakcji.",
            "Projekty międzydziałowe w celu budowania relacji w całej firmie.",
          ],
        },
        "4": {
          description:
            "W zespole panuje dobra, wspierająca atmosfera. Pracownicy chętnie sobie pomagają i dzielą się wiedzą.",
          recommendations: [
            "Wzmacnianie dobrych praktyk poprzez publiczne docenianie współpracy.",
            "Dawanie zespołowi większej autonomii w podejmowaniu decyzji.",
            "Celebrowanie sukcesów zespołowych.",
          ],
        },
        "5": {
          description:
            "Zespół jest doskonale zintegrowany, panuje w nim atmosfera zaufania, otwartości i synergii. To siła napędowa firmy.",
          recommendations: [
            "Wykorzystanie zespołu jako wzoru do naśladowania dla innych.",
            "Angażowanie zespołu w proces wdrażania nowych pracowników (buddy system).",
            "Inwestowanie w dalszy rozwój kompetencji zespołowych.",
          ],
        },
        businessImpact:
          "Zła atmosfera w zespole obniża produktywność i innowacyjność. Dobra atmosfera zwiększa retencję, satysfakcję i efektywność pracy.",
      },
    },
    // Można tutaj dodać kolejne OBSZARY i CZYNNIKI
  };
}

// --- KROK 2: KONFIGURACJA MODELU Z NOWĄ BAZĄ WIEDZY ---
const KNOWLEDGE_BASE = getKnowledgeBase();

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const systemInstruction = `
Jesteś ekspertem i konsultantem strategicznym HR z 15-letnim doświadczeniem. Twoim zadaniem jest analiza wyników badania satysfakcji i zaangażowania pracowników oraz generowanie na tej podstawie szczegółowego raportu. Zawsze korzystaj z poniższej bazy wiedzy do interpretacji wyników i formułowania rekomendacji. Baza jest ustrukturyzowana jako: Obszar -> Czynnik -> Poziom Oceny (1-5). Twoje analizy muszą być syntezą wniosków z poszczególnych czynników. Twoje odpowiedzi MUSZĄ być w formacie JSON, zgodnie ze strukturą wymaganą w promptach.

=== POCZĄTEK BAZY WIEDZY ===
${JSON.stringify(KNOWLEDGE_BASE, null, 2)}
=== KONIEC BAZY WIEDZY ===
`;

const MODEL_CONFIG: GenerationConfig = {
  responseMimeType: "application/json",
  temperature: 0.1,
  maxOutputTokens: 8192,
};

const model: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  generationConfig: MODEL_CONFIG,
  systemInstruction: systemInstruction,
});

// --- KROK 3: GŁÓWNA FUNKCJA I ZAKTUALIZOWANE FUNKCJE POMOCNICZE ---

export async function generateReport(
  examinations: (typeof ExaminationTable.$inferSelect)[]
): Promise<ReportContent> {
  try {
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
      surveyData as SurveyRespondent[]
    );
    const departments = analysisData.departments || [];

    const resolvedDetailedAreas: DetailedAreaContent[] = [];
    for (const areaData of analysisData.detailed_areas) {
      console.log(`Rozpoczynam generowanie dla obszaru: ${areaData.area_name}`);
      const content = await generateDetailedAreaContent(areaData, departments);
      resolvedDetailedAreas.push(content);
      console.log(`Zakończono generowanie dla obszaru: ${areaData.area_name}`);
    }
    // Przekazujemy `resolvedDetailedAreas` wzbogacone o `factor_scores`
    const leaderGuidelines = await generateLeaderGuidelines(
      resolvedDetailedAreas,
      departments
    );

    const overallContent = await generateOverallContent(
      analysisData.overall_analysis,
      resolvedDetailedAreas,
      departments,
      surveyData.length
    );

    const mergedOverallAnalysis = {
      ...analysisData.overall_analysis,
      engagement: {
        ...analysisData.overall_analysis.engagement,
        ...overallContent.engagement,
        businessImpact: overallContent.engagement.business_impact,
      },
      satisfaction: {
        ...analysisData.overall_analysis.satisfaction,
        ...overallContent.satisfaction,
        businessImpact: overallContent.satisfaction.business_impact,
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

async function makeApiCall(prompt: string): Promise<ApiResponse> {
  try {
    console.log("--- PROMPT DO API ---", prompt.substring(0, 400), "...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawResponse = response.text();
    const finishReason = response.candidates?.[0]?.finishReason;
    console.log(`📋 API Finish Reason: ${finishReason}`);

    if (finishReason === "MAX_TOKENS")
      throw new Error("Odpowiedź API została obcięta z powodu limitu tokenów.");
    if (finishReason !== "STOP" && finishReason !== "FINISH_REASON_UNSPECIFIED")
      throw new Error(
        `Generowanie zostało zatrzymane z powodu: ${finishReason}`
      );

    const cleanedResponse = rawResponse
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();
    return JSON.parse(cleanedResponse);
  } catch (e) {
    console.error("❌ Błąd wywołania API lub parsowania JSON:", e);
    throw e;
  }
}

async function getInitialAnalysis(
  surveyData: SurveyRespondent[]
): Promise<InitialAnalysisResult> {
  const stats = calculateStatistics(surveyData);
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
      },
      satisfaction: {
        overall_score: stats.satisfaction,
        title: "Poziom satysfakcji w całej organizacji",
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

async function generateOverallContent(
  overallData: InitialAnalysisResult["overall_analysis"],
  detailedAreas: DetailedAreaContent[],
  departments: string[],
  respondentCount: number
): Promise<OverallContentResult> {
  const prompt = `
      Na podstawie podanych danych z badania, stwórz wartościową analizę strategiczną.
      
      === KONTEKST BADANIA ===
      Liczba respondentów: ${respondentCount}
      Działy w firmie: ${departments.join(", ")}
      
      === WYNIKI OGÓLNE ===
      ${JSON.stringify(overallData, null, 2)}
      
      === WYNIKI SZCZEGÓŁOWE (ŚREDNIE CZYNNIKÓW) ===
      ${JSON.stringify(
        detailedAreas.map((a) => ({
          area: a.area_name,
          factors: a.factor_scores,
        })),
        null,
        2
      )}
            
      === TWOJE ZADANIE ===
      Twoim zadaniem jest stworzenie ogólnego podsumowania, agregując wnioski z poszczególnych czynników.
      1.  **ENGAGEMENT (Zaangażowanie):** Przeanalizuj wyniki czynników składających się na obszar "Uznanie i docenianie". Na tej podstawie znajdź w BAZIE WIEDZY odpowiedni opis, zidentyfikuj kluczowe problemy (najniżej ocenione czynniki) i wygeneruj konkretny 'business_impact'.
      2.  **SATISFACTION (Satysfakcja):** Zrób to samo dla satysfakcji, analizując czynniki z obszaru "Środowisko Pracy i Kultura organizacyjna".
      3.  **TOP SCORES INSIGHT:** Przeanalizuj TOP 3 najniższe i najwyższe **obszary**. Wskaż, które **czynniki** w tych obszarach miały największy wpływ na wynik. Zaproponuj 2-3 priorytety strategiczne oparte na analizie czynników.

      Zwróć TYLKO JSON o strukturze:
      {
        "engagement": { "main_description": "", "attitude_points": [], "duties_points": [], "loyalty_points": [], "business_impact": "" },
        "satisfaction": { "main_description": "", "attitude_points": [], "duties_points": [], "loyalty_points": [], "business_impact": "" },
        "top_scores_insights": { "lowest_insight": "", "highest_insight": "" }
      }
  `;
  return makeApiCall(prompt) as unknown as Promise<OverallContentResult>;
}

async function generateDetailedAreaContent(
  areaData: DetailedAreaData,
  departments: string[]
): Promise<DetailedAreaContent> {
  const prompt = `
      Jako ekspert HR, stwórz rozdział raportu dla obszaru: "${
        areaData.area_name
      }".
      Średnia ocena dla całego obszaru: ${areaData.overall_average}.
      
      Wyniki dla poszczególnych CZYNNIKÓW w tym obszarze:
      ${JSON.stringify(areaData.factor_scores, null, 2)}
      
      Wyniki dla poszczególnych DZIAŁÓW w tym obszarze:
      ${JSON.stringify(areaData.team_scores, null, 2)}
      
      Zadania (korzystając z BAZY WIEDZY):
      1.  **company_summary**: Stwórz syntetyczny paragraf podsumowujący. W kluczowych wnioskach wskaż 2-3 najważniejsze czynniki (najwyżej i najniżej ocenione) i wyjaśnij, co ich kombinacja oznacza dla firmy.
      2.  **team_breakdown**: Dla KAŻDEGO działu z listy (${departments.join(
        ", "
      )}) stwórz zwięzłą interpretację na podstawie description z bazy wiedzy i 2-4 najważniejsze rekomendacje, bazując na ich specyficznych wynikach i najsłabszych czynnikach.
      3.  **organizational_recommendations**: Wygeneruj 2-4 bloki ogólnych rekomendacji dla całej organizacji, które wynikają z analizy wszystkich czynników w tym obszarze. Skup się na tych o największym potencjale do poprawy.
      4.  **business_impact**: Zsyntetyzuj informacje o wpływie na biznes z BAZY WIEDZY dla najistotniejszych (najniżej ocenionych) czynników w tym obszarze.

      Zwróć TYLKO JSON, zachowując poniższą strukturę:
      {
        "company_summary": { "title": "Cała firma i zespoły", "overall_average_text": "Średnia ocena ogólna: ${
          areaData.overall_average
        } (skala 1-5)", "sub_areas_breakdown": [], "key_findings_header": "Kluczowe Wnioski", "key_findings_points": [], "summary_header": "Podsumowanie", "summary_paragraph": "" },
        "team_breakdown": { "title": "Omówienie wyników w zespołach", "table_headers": ["Dział", "Wynik", "Interpretacja", "Jak poprawić wynik?"], "data": [] },
        "organizational_recommendations": { "title": "Rekomendacje dla całej organizacji", "recommendation_blocks": [{ "title": "", "points": [] }] },
        "business_impact": { "title": "Jak to wpływa na biznes?", "points": [] }
      }`;
  const content = (await makeApiCall(prompt)) as unknown as DetailedAreaContent;
  // Dołączamy oryginalne dane, aby można było z nich korzystać w kolejnych krokach
  return { ...areaData, ...content };
}

async function generateLeaderGuidelines(
  detailedAreas: DetailedAreaContent[],
  departments: string[]
): Promise<LeaderGuideline[]> {
  const leaderData = departments.map((dept) => {
    const scores = detailedAreas
      .map((area) => {
        // Znajdź najsłabszy czynnik dla danego działu w tym obszarze
        let weakest_factor = "brak danych";
        let lowest_score = 6;

        if (area.factor_scores) {
          for (const factor in area.factor_scores) {
            const score = area.factor_scores[factor];
            // Potrzebujemy wyników per czynnik per dział, które nie są bezpośrednio w tej strukturze.
            // Dla uproszczenia, użyjemy ogólnego najsłabszego czynnika w obszarze
            if (score !== undefined && score < lowest_score) {
              lowest_score = score;
              weakest_factor = factor;
            }
          }
        }

        return {
          area: area.area_name,
          score: area.team_scores?.[dept] || 0,
          weakest_factor: weakest_factor,
        };
      })
      .sort((a, b) => a.score - b.score);

    return {
      department: dept,
      lowest_areas: scores.slice(0, 2),
      highest_areas: scores.slice(-2).reverse(),
    };
  });

  const prompt = `
      Jesteś coachem dla managerów. Stwórz praktyczne wskazówki dla liderów każdego z działów.

      Dane analityczne (najlepsze i najgorsze obszary dla każdego działu oraz ich najsłabsze czynniki): 
      ${JSON.stringify(leaderData, null, 2)}
      
      Zadania (dla każdego działu osobno):
      1. Na podstawie najsłabszych OBSZARÓW i wskazanych w nich najsłabszych CZYNNIKÓW, sformułuj konkretne porady w formacie START, STOP, CONTINUE, WELCOME, korzystając z BAZY WIEDZY.
      2. 'Start' musi zawierać rekomendacje z BAZY WIEDZY dla najsłabszych czynników.
      3. 'Stop' musi opisywać negatywne zachowania wynikające z niskich ocen.
      4. 'Continue' musi opisywać pozytywne praktyki wynikające z wysokich ocen.
      5. 'Welcome' musi zawierać innowacyjne, aspiracyjne pomysły na przyszłość.

      Zwróć TYLKO JSON, który jest tablicą obiektów dla każdego działu z listy: ${departments.join(
        ", "
      )}
      [{ "department": "Nazwa działu", "start": [], "stop": [], "continue": [], "welcome": [] }]
  `;
  return makeApiCall(prompt) as unknown as Promise<LeaderGuideline[]>;
}
