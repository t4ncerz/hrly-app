"use server";

import {
  insertExamination,
  getExaminations as getExaminationsFromDb,
} from "../db/examination";
import { randomUUID } from "node:crypto";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { FormValues } from "../components/examination-upload-form";
import {
  GoogleGenerativeAI,
  GenerationConfig,
  GenerativeModel,
} from "@google/generative-ai";
import { env } from "@/data/env/server";

// --- TYPE DEFINITIONS ---
interface ParsedData {
  [key: string]: string | number | boolean | null;
}

interface EmployeeDetails {
  [key: string]: string | number;
}

interface ScoreData {
  area_id: string;
  area_name_pl: string;
  area_name_en: string;
  factor_id: string;
  factor_name_pl: string;
  factor_name_en: string;
  question: string;
  score: number;
}

interface EmployeeResponse {
  id: string;
  details: EmployeeDetails;
  scores: ScoreData[];
}

interface FactorDetails {
  area_id: string;
  area_name_pl: string;
  area_name_en: string;
  factor_id: string;
  factor_name_pl: string;
  factor_name_en: string;
}

// --- KONFIGURACJA AI ---
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const MODEL_CONFIG: GenerationConfig = {
  responseMimeType: "application/json",
  temperature: 0.1,
};
const model: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  generationConfig: MODEL_CONFIG,
});

// --- NOWA, HIERARCHICZNA BAZA WIEDZY (WYGENEROWANA Z CSV) ---
// Ta struktura zastępuje starą MAPPING_KNOWLEDGE_BASE.
// Zapewnia dwupoziomowe mapowanie: Pytanie -> Czynnik -> Obszar.
const HIERARCHICAL_MAPPING_KNOWLEDGE_BASE = {
  compensation_and_benefits: {
    namePl: "Wynagrodzenie i benefity",
    nameEn: "Compensation and Benefits",
    factors: {
      base_salary: {
        namePl: "Wynagrodzenie podstawowe",
        nameEn: "Base Salary",
        exampleQuestions: [
          "W jakim stopniu jesteś zadowolony/a z wysokości swojego wynagrodzenia podstawowego?",
          "Jak oceniasz swoje wynagrodzenie w porównaniu do innych osób na podobnych stanowiskach w branży?",
        ],
      },
      premiums_and_bonuses: {
        namePl: "Premie i bonusy",
        nameEn: "Premiums and Bonuses",
        exampleQuestions: [
          "Jak często otrzymujesz premie lub bonusy za swoją pracę?",
          "W jakim stopniu system premiowy motywuje Cię do lepszej pracy?",
        ],
      },
      non_wage_benefits: {
        namePl: "Benefity pozapłacowe",
        nameEn: "Non-wage Benefits",
        exampleQuestions: [
          "Które z oferowanych przez firmę benefitów pozapłacowych są dla Ciebie najbardziej wartościowe?",
          "Jak oceniasz pakiet benefitów oferowany przez Twoją firmę w porównaniu do innych pracodawców?",
        ],
      },
      material_rewards: {
        namePl: "Nagrody rzeczowe",
        nameEn: "Material Rewards",
        exampleQuestions: [
          "Jak często otrzymujesz nagrody rzeczowe za swoją pracę?",
          "Jak oceniasz atrakcyjność nagród rzeczowych oferowanych w Twojej firmie?",
        ],
      },
    },
  },
  impact_and_meaning_of_work: {
    namePl: "Wpływ i znaczenie pracy",
    nameEn: "Impact and Meaning of Work",
    factors: {
      sense_of_impact_on_the_environment: {
        namePl: "Poczucie wpływu na otoczenie",
        nameEn: "Sense of Impact on the Environment",
        exampleQuestions: [
          "W jakim stopniu czujesz, że Twoja praca ma wpływ na sukces firmy?",
          "Jak często widzisz pozytywne efekty swojej pracy?",
        ],
      },
      alignment_of_personal_and_organizational_goals: {
        namePl: "Zgodność celów osobistych z organizacyjnymi",
        nameEn: "Alignment of Personal and Organizational Goals",
        exampleQuestions: [
          "W jakim stopniu Twoje cele osobiste są zgodne z celami organizacji?",
          "Jak często czujesz, że realizując cele firmy, realizujesz również swoje własne cele?",
        ],
      },
      opportunity_to_submit_ideas: {
        namePl: "Możliwość zgłaszania pomysłów",
        nameEn: "Opportunity to Submit Ideas",
        exampleQuestions: [
          "Jak często masz możliwość zgłaszania własnych pomysłów?",
          "W jakim stopniu Twoje pomysły są brane pod uwagę i wdrażane?",
        ],
      },
    },
  },
  recognition_and_appreciation: {
    namePl: "Uznanie i docenianie",
    nameEn: "Recognition and Appreciation",
    factors: {
      verbal_praise: {
        namePl: "Pochwały ustne",
        nameEn: "Verbal Praise",
        exampleQuestions: [
          "Jak często otrzymujesz pochwały ustne od swojego przełożonego?",
          "W jakim stopniu pochwały ustne motywują Cię do lepszej pracy?",
        ],
      },
      public_recognition_of_achievements: {
        namePl: "Publiczne uznanie osiągnięć",
        nameEn: "Public Recognition of Achievements",
        exampleQuestions: [
          "Czy Twoje osiągnięcia są publicznie uznawane w firmie?",
          "W jakim stopniu publiczne uznanie wpływa na Twoje zaangażowanie w pracę?",
        ],
      },
      constructive_feedback: {
        namePl: "Konstruktywny feedback",
        nameEn: "Constructive Feedback",
        exampleQuestions: [
          "Jak często otrzymujesz konstruktywny feedback od swojego przełożonego?",
          "W jakim stopniu otrzymywany feedback pomaga Ci w poprawie Twojej pracy?",
        ],
      },
    },
  },
  technology_and_work_tools: {
    namePl: "Technologia i narzędzia pracy",
    nameEn: "Technology and Work Tools",
    factors: {
      modern_work_tools: {
        namePl: "Nowoczesne narzędzia pracy",
        nameEn: "Modern Work Tools",
        exampleQuestions: [
          "Jak oceniasz nowoczesność narzędzi pracy, które masz do dyspozycji?",
          "W jakim stopniu dostępne narzędzia pracy ułatwiają Ci wykonywanie obowiązków?",
        ],
      },
      it_systems_supporting_work: {
        namePl: "Systemy IT wspierające pracę",
        nameEn: "IT Systems Supporting Work",
        exampleQuestions: [
          "Jak oceniasz jakość systemów IT wspierających Twoją pracę?",
          "W jakim stopniu systemy IT ułatwiają Ci wykonywanie codziennych zadań?",
        ],
      },
    },
  },
  work_environment_and_organizational_culture: {
    namePl: "Środowisko Pracy i Kultura organizacyjna",
    nameEn: "Work Environment and Organizational Culture",
    factors: {
      team_atmosphere: {
        namePl: "Atmosfera w zespole",
        nameEn: "Team Atmosphere",
        exampleQuestions: [
          "Jak oceniasz atmosferę panującą w Twoim zespole?",
          "W jakim stopniu atmosfera w zespole wpływa na Twoją chęć przychodzenia do pracy?",
        ],
      },
      support_from_colleagues: {
        namePl: "Wsparcie ze strony współpracowników",
        nameEn: "Support from Colleagues",
        exampleQuestions: [
          "Jak często otrzymujesz wsparcie od swoich współpracowników?",
          "W jakim stopniu możesz polegać na swoich kolegach z pracy w trudnych sytuacjach?",
        ],
      },
      relationships_with_superiors: {
        namePl: "Relacje z przełożonymi",
        nameEn: "Relationships with Superiors",
        exampleQuestions: [
          "Jak oceniasz swoje relacje z bezpośrednim przełożonym?",
          "W jakim stopniu czujesz, że możesz otwarcie komunikować się ze swoim przełożonym?",
        ],
      },
      alignment_with_personal_values: {
        namePl: "Zgodność z wartościami osobistymi",
        nameEn: "Alignment with Personal Values",
        exampleQuestions: [
          "W jakim stopniu wartości firmy są zgodne z Twoimi osobistymi wartościami?",
          "Jak często masz możliwość realizowania swoich osobistych wartości w pracy?",
        ],
      },
      management_style_of_superiors: {
        namePl: "Styl zarządzania przełożonych",
        nameEn: "Management Style of Superiors",
        exampleQuestions: [
          "Jak oceniasz styl zarządzania swojego bezpośredniego przełożonego?",
          "W jakim stopniu styl zarządzania Twojego przełożonego motywuje Cię do pracy?",
        ],
      },
      vision_and_mission_of_the_organization: {
        namePl: "Wizja i misja organizacji",
        nameEn: "Vision and Mission of the Organization",
        exampleQuestions: [
          "W jakim stopniu rozumiesz wizję i misję swojej organizacji?",
          "Jak często Twoje codzienne zadania są powiązane z realizacją wizji i misji firmy?",
        ],
      },
      organizational_values: {
        namePl: "Wartości organizacyjne",
        nameEn: "Organizational Values",
        exampleQuestions: [
          "W jakim stopniu identyfikujesz się z wartościami swojej organizacji?",
          "Jak często widzisz, że wartości organizacyjne są realizowane w praktyce?",
        ],
      },
      workplace_ergonomics: {
        namePl: "Ergonomia miejsca pracy",
        nameEn: "Workplace Ergonomics",
        exampleQuestions: [
          "Jak oceniasz ergonomię swojego stanowiska pracy?",
          "W jakim stopniu ergonomia miejsca pracy wpływa na Twoją produktywność?",
        ],
      },
      physical_security: {
        namePl: "Bezpieczeństwo fizyczne",
        nameEn: "Physical Security",
        exampleQuestions: [
          "Jak oceniasz poziom bezpieczeństwa fizycznego w swoim miejscu pracy?",
          "W jakim stopniu czujesz się bezpiecznie wykonując swoje obowiązki zawodowe?",
        ],
      },
      psychological_comfort_at_work: {
        namePl: "Komfort psychiczny w pracy",
        nameEn: "Psychological Comfort at Work",
        exampleQuestions: [
          "Jak często czujesz się komfortowo psychicznie w swoim miejscu pracy?",
          "W jakim stopniu atmosfera w pracy wpływa na Twój komfort psychiczny?",
        ],
      },
      identification_with_the_employer_brand: {
        namePl: "Identyfikacja z marką pracodawcy",
        nameEn: "Identification with the Employer Brand",
        exampleQuestions: [
          "W jakim stopniu identyfikujesz się z marką swojego pracodawcy?",
          "Jak często polecasz swoją firmę jako dobrego pracodawcę?",
        ],
      },
      innovation_in_the_workplace: {
        namePl: "Innowacyjność w miejscu pracy",
        nameEn: "Innovation in the Workplace",
        exampleQuestions: [
          "Jak oceniasz poziom innowacyjności w Twojej organizacji?",
          "W jakim stopniu masz możliwość wprowadzania innowacyjnych rozwiązań w swojej pracy?",
        ],
      },
      equality_and_inclusivity_policy: {
        namePl: "Polityka równości i inkluzywności",
        nameEn: "Equality and Inclusivity Policy",
        exampleQuestions: [
          "Jak oceniasz politykę równości i inkluzywności w Twojej firmie?",
          "W jakim stopniu czujesz, że wszyscy pracownicy są traktowani równo i sprawiedliwie?",
        ],
      },
      companys_csr_activities: {
        namePl: "Działania CSR firmy",
        nameEn: "Company's CSR Activities",
        exampleQuestions: [
          "Jak oceniasz działania CSR (Społecznej Odpowiedzialności Biznesu) Twojej firmy?",
          "W jakim stopniu działania CSR firmy wpływają na Twoją opinię o pracodawcy?",
        ],
      },
      sense_of_fair_treatment: {
        namePl: "Poczucie sprawiedliwego traktowania",
        nameEn: "Sense of Fair Treatment",
        exampleQuestions: [
          "W jakim stopniu czujesz, że jesteś sprawiedliwie traktowany/a w swojej organizacji?",
          "Jak często obserwujesz przypadki nierównego traktowania pracowników w firmie?",
        ],
      },
    },
  },
  work_life_balance: {
    namePl: "Równowaga praca-życie",
    nameEn: "Work-Life Balance",
    factors: {
      flexible_working_hours: {
        namePl: "Elastyczne godziny pracy",
        nameEn: "Flexible Working Hours",
        exampleQuestions: [
          "W jakim stopniu masz możliwość dostosowania godzin pracy do swoich potrzeb?",
          "Jak elastyczność godzin pracy wpływa na Twoją równowagę między życiem zawodowym a prywatnym?",
        ],
      },
      remote_work_possibility: {
        namePl: "Możliwość pracy zdalnej",
        nameEn: "Remote Work Possibility",
        exampleQuestions: [
          "Jak często masz możliwość pracy zdalnej?",
          "W jakim stopniu możliwość pracy zdalnej wpływa na Twoją efektywność?",
        ],
      },
      work_life_balance_support: {
        namePl: "Wsparcie work-life balance",
        nameEn: "Work-Life Balance Support",
        exampleQuestions: [
          "W jakim stopniu firma wspiera Twoją równowagę między życiem zawodowym a prywatnym?",
          "Jak często czujesz, że praca koliduje z Twoim życiem prywatnym?",
        ],
      },
      employee_assistance_programs: {
        namePl: "Programy wsparcia pracowniczego",
        nameEn: "Employee Assistance Programs",
        exampleQuestions: [
          "Czy korzystasz z programów wsparcia pracowniczego oferowanych przez firmę?",
          "W jakim stopniu programy wsparcia pracowniczego pomagają Ci w radzeniu sobie z wyzwaniami zawodowymi i osobistymi?",
        ],
      },
    },
  },
  professional_development_and_career: {
    namePl: "Rozwój zawodowy i kariera",
    nameEn: "Professional Development and Career",
    factors: {
      job_security: {
        namePl: "Stabilność zatrudnienia",
        nameEn: "Job Security",
        exampleQuestions: [
          "Jak oceniasz stabilność swojego zatrudnienia w obecnej firmie?",
          "W jakim stopniu poczucie stabilności zatrudnienia wpływa na Twoją satysfakcję z pracy?",
        ],
      },
      clarity_of_career_path: {
        namePl: "Jasność ścieżki kariery",
        nameEn: "Clarity of Career Path",
        exampleQuestions: [
          "Czy masz jasno określoną ścieżkę kariery w swojej firmie?",
          "W jakim stopniu rozumiesz, co musisz zrobić, aby awansować w swojej organizacji?",
        ],
      },
      trainings_and_courses: {
        namePl: "Szkolenia i kursy",
        nameEn: "Trainings and Courses",
        exampleQuestions: [
          "Jak często masz możliwość uczestniczenia w szkoleniach lub kursach?",
          "W jakim stopniu szkolenia, w których uczestniczysz, są przydatne w Twojej pracy?",
        ],
      },
      mentoring_and_coaching: {
        namePl: "Mentoring i coaching",
        nameEn: "Mentoring and Coaching",
        exampleQuestions: [
          "Czy masz dostęp do mentora lub coacha w swojej organizacji?",
          "W jakim stopniu wsparcie mentora/coacha pomaga Ci w rozwoju zawodowym?",
        ],
      },
      promotion_opportunities: {
        namePl: "Możliwości awansu",
        nameEn: "Promotion Opportunities",
        exampleQuestions: [
          "Jak oceniasz swoje szanse na awans w obecnej firmie?",
          "W jakim stopniu możliwości awansu wpływają na Twoje zaangażowanie w pracę?",
        ],
      },
      development_programs: {
        namePl: "Programy rozwojowe",
        nameEn: "Development Programs",
        exampleQuestions: [
          "Jak często korzystasz z programów rozwojowych oferowanych przez firmę?",
          "W jakim stopniu programy rozwojowe wpływają na Twój rozwój zawodowy?",
        ],
      },
      job_rotation: {
        namePl: "Rotacja stanowisk",
        nameEn: "Job Rotation",
        exampleQuestions: [
          "Czy masz możliwość rotacji stanowisk w swojej organizacji?",
          "W jakim stopniu rotacja stanowisk wpływa na Twój rozwój zawodowy?",
        ],
      },
      opportunity_to_participate_in_projects: {
        namePl: "Możliwość uczestnictwa w projektach",
        nameEn: "Opportunity to Participate in Projects",
        exampleQuestions: [
          "Jak często masz możliwość uczestniczenia w nowych projektach?",
          "W jakim stopniu udział w projektach wpływa na Twoje zaangażowanie w pracę?",
        ],
      },
      regular_employee_appraisals: {
        namePl: "Regularne oceny pracownicze",
        nameEn: "Regular Employee Appraisals",
        exampleQuestions: [
          "Jak często odbywają się formalne oceny Twojej pracy?",
          "W jakim stopniu oceny pracownicze pomagają Ci w rozwoju zawodowym?",
        ],
      },
    },
  },
  prospects_and_stability_of_the_organization: {
    namePl: "Perspektywy i stabilność organizacji",
    nameEn: "Prospects and Stability of the Organization",
    factors: {
      financial_condition_of_the_company: {
        namePl: "Kondycja finansowa firmy",
        nameEn: "Financial Condition of the Company",
        exampleQuestions: [
          "Jak oceniasz obecną kondycję finansową firmy?",
          "W jakim stopniu kondycja finansowa firmy wpływa na Twoje poczucie bezpieczeństwa zatrudnienia?",
        ],
      },
      organizations_development_prospects: {
        namePl: "Perspektywy rozwoju organizacji",
        nameEn: "Organization's Development Prospects",
        exampleQuestions: [
          "Jak oceniasz perspektywy rozwoju Twojej organizacji?",
          "W jakim stopniu perspektywy rozwoju firmy wpływają na Twoje plany zawodowe?",
        ],
      },
      employers_image_on_the_market: {
        namePl: "Wizerunek pracodawcy na rynku",
        nameEn: "Employer's Image on the Market",
        exampleQuestions: [
          "Jak oceniasz wizerunek swojego pracodawcy na rynku pracy?",
          "W jakim stopniu wizerunek pracodawcy wpływa na Twoją dumę z pracy w tej firmie?",
        ],
      },
    },
  },
  workload_and_stress: {
    namePl: "Obciążenie pracą i stres",
    nameEn: "Workload and Stress",
    factors: {
      amount_of_work: {
        namePl: "Ilość pracy",
        nameEn: "Amount of Work",
        exampleQuestions: [
          "Jak często czujesz, że masz zbyt dużo pracy do wykonania?",
          "W jakim stopniu ilość przydzielanych Ci zadań wpływa na jakość Twojej pracy?",
        ],
      },
      task_complexity: {
        namePl: "Złożoność zadań",
        nameEn: "Task Complexity",
        exampleQuestions: [
          "Jak oceniasz poziom trudności zadań, które wykonujesz w pracy?",
          "W jakim stopniu złożoność Twoich zadań wpływa na Twoje zaangażowanie w pracę?",
        ],
      },
      time_pressure: {
        namePl: "Presja czasu",
        nameEn: "Time Pressure",
        exampleQuestions: [
          "Jak często pracujesz pod presją czasu?",
          "W jakim stopniu presja czasu wpływa na Twoją efektywność w pracy?",
        ],
      },
      emotional_exhaustion: {
        namePl: "Emocjonalne wyczerpanie",
        nameEn: "Emotional Exhaustion",
        exampleQuestions: [
          "Jak często czujesz się emocjonalnie wyczerpany/a po dniu pracy?",
          "W jakim stopniu praca wpływa na Twój poziom energii w życiu prywatnym?",
        ],
      },
      depersonalization: {
        namePl: "Depersonalizacja",
        nameEn: "Depersonalization",
        exampleQuestions: [
          "Czy zauważasz u siebie obojętność wobec problemów klientów/współpracowników?",
          "Jak często czujesz, że traktujesz innych w pracy w sposób bezosobowy?",
        ],
      },
      reduced_sense_of_personal_accomplishment: {
        namePl: "Obniżone poczucie dokonań osobistych",
        nameEn: "Reduced Sense of Personal Accomplishment",
        exampleQuestions: [
          "W jakim stopniu czujesz, że Twoja praca ma znaczenie?",
          "Jak często masz poczucie, że osiągasz swoje cele zawodowe?",
        ],
      },
      stress_management_in_the_organization: {
        namePl: "Zarządzanie stresem w organizacji",
        nameEn: "Stress Management in the Organization",
        exampleQuestions: [
          "Jak oceniasz działania firmy w zakresie zarządzania stresem pracowników?",
          "W jakim stopniu czujesz, że firma pomaga Ci w radzeniu sobie ze stresem zawodowym?",
        ],
      },
    },
  },
  communication_and_information_flow: {
    namePl: "Komunikacja i przepływ informacji",
    nameEn: "Communication and Information Flow",
    factors: {
      process_transparency: {
        namePl: "Transparentność procesów",
        nameEn: "Process Transparency",
        exampleQuestions: [
          "Jak oceniasz poziom transparentności procesów w Twojej organizacji?",
          "W jakim stopniu rozumiesz, jak Twoja praca wpływa na ogólne procesy w firmie?",
        ],
      },
      access_to_information: {
        namePl: "Dostęp do informacji",
        nameEn: "Access to Information",
        exampleQuestions: [
          "Jak oceniasz swój dostęp do informacji potrzebnych do wykonywania pracy?",
          "W jakim stopniu czujesz się poinformowany/a o ważnych sprawach w firmie?",
        ],
      },
      internal_communication_channels: {
        namePl: "Kanały komunikacji wewnętrznej",
        nameEn: "Internal Communication Channels",
        exampleQuestions: [
          "Jak oceniasz efektywność kanałów komunikacji wewnętrznej w Twojej firmie?",
          "W jakim stopniu istniejące kanały komunikacji ułatwiają Ci wykonywanie pracy?",
        ],
      },
      clarity_of_expectations: {
        namePl: "Jasność oczekiwań",
        nameEn: "Clarity of Expectations",
        exampleQuestions: [
          "Jak jasno są określone oczekiwania wobec Twojej pracy?",
          "W jakim stopniu rozumiesz, co jest potrzebne, aby odnieść sukces w Twojej roli?",
        ],
      },
    },
  },
  autonomy_and_decision_making: {
    namePl: "Autonomia i podejmowanie decyzji",
    nameEn: "Autonomy and Decision-Making",
    factors: {
      ability_to_make_decisions: {
        namePl: "Możliwość podejmowania decyzji",
        nameEn: "Ability to Make Decisions",
        exampleQuestions: [
          "W jakim stopniu masz swobodę w podejmowaniu decyzji dotyczących swojej pracy?",
          "Jak często Twoje pomysły są brane pod uwagę przy podejmowaniu decyzji w zespole?",
        ],
      },
      freedom_in_performing_tasks: {
        namePl: "Swoboda w wykonywaniu zadań",
        nameEn: "Freedom in Performing Tasks",
        exampleQuestions: [
          "W jakim stopniu masz swobodę w wyborze sposobu wykonywania swoich zadań?",
          "Jak często możesz samodzielnie planować swój dzień pracy?",
        ],
      },
      participation_in_decision_making: {
        namePl: "Udział w podejmowaniu decyzji",
        nameEn: "Participation in Decision-Making",
        exampleQuestions: [
          "Jak często masz możliwość udziału w podejmowaniu ważnych decyzji w firmie?",
          "W jakim stopniu Twój udział w podejmowaniu decyzji wpływa na Twoje zaangażowanie w pracę?",
        ],
      },
      consultations_with_employees: {
        namePl: "Konsultacje z pracownikami",
        nameEn: "Consultations with Employees",
        exampleQuestions: [
          "Jak często kierownictwo konsultuje z pracownikami ważne decyzje?",
          "W jakim stopniu czujesz, że Twoja opinia jest brana pod uwagę podczas konsultacji?",
        ],
      },
    },
  },
} as const;

// --- FILE PARSING FUNCTIONS ---

/**
 * Determines file type based on file name extension
 */
function getFileType(fileName: string): "csv" | "excel" | "unknown" {
  const extension = fileName.toLowerCase().split(".").pop();

  if (extension === "csv") {
    return "csv";
  } else if (extension === "xls" || extension === "xlsx") {
    return "excel";
  }

  return "unknown";
}

/**
 * Parses CSV file and returns data with headers
 */
async function parseCSV(
  file: File
): Promise<{ data: ParsedData[]; headers: string[] }> {
  const csvText = await file.text();
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (result.errors.length > 0) {
    throw new Error(`Błąd parsowania CSV: ${result.errors[0]?.message}`);
  }

  const headers = result.meta.fields;
  if (!headers) {
    throw new Error("Nie udało się odczytać nagłówków z pliku CSV.");
  }

  return {
    data: result.data as ParsedData[],
    headers,
  };
}

/**
 * Parses Excel file and returns data with headers
 */
async function parseExcel(
  file: File
): Promise<{ data: ParsedData[]; headers: string[] }> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  // Get the first worksheet
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error("Nie udało się odczytać nazwy arkusza z pliku Excel.");
  }
  const worksheet = workbook.Sheets[firstSheetName];

  if (!worksheet) {
    throw new Error("Nie udało się odczytać arkusza z pliku Excel.");
  }

  // Convert worksheet to JSON with header row
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
  }) as (string | number | boolean | null)[][];

  if (jsonData.length === 0) {
    throw new Error("Plik Excel jest pusty.");
  }

  // First row contains headers
  const firstRow = jsonData[0];
  if (!firstRow) {
    throw new Error("Plik Excel nie zawiera nagłówków.");
  }
  const headers = firstRow.map((header) => String(header || ""));

  // Convert remaining rows to objects
  const data: ParsedData[] = jsonData
    .slice(1)
    .map((row) => {
      const rowData: ParsedData = {};
      headers.forEach((header, colIndex) => {
        if (header && row && Array.isArray(row) && colIndex < row.length) {
          rowData[header] = row[colIndex] ?? null;
        }
      });
      return rowData;
    })
    .filter((row) =>
      Object.values(row).some((value) => value !== null && value !== "")
    );

  return { data, headers };
}

/**
 * Generic file parser that handles both CSV and Excel files
 */
async function parseFile(
  file: File
): Promise<{ data: ParsedData[]; headers: string[] }> {
  const fileType = getFileType(file.name);

  switch (fileType) {
    case "csv":
      return parseCSV(file);
    case "excel":
      return parseExcel(file);
    default:
      throw new Error(
        `Nieobsługiwany typ pliku. Obsługiwane formaty: CSV (.csv), Excel (.xls, .xlsx)`
      );
  }
}

/**
 * Prosi AI o zmapowanie każdego pytania z ankiety na konkretny CZYNNIK z bazy wiedzy.
 */
async function getAiMapping(
  headers: string[],
  sampleRows: ParsedData[]
): Promise<Record<string, string | null>> {
  const prompt = `
        Jesteś inteligentnym asystentem do mapowania danych z ankiet pracowniczych. Twoim zadaniem jest precyzyjne przypisanie każdego pytania (nagłówka kolumny) z ankiety do jednego, konkretnego CZYNNIKA (faktora) z naszej bazy wiedzy.

        Oto nagłówki z pliku użytkownika, które reprezentują pytania ankietowe:
        ${JSON.stringify(headers)}

        Oto kilka przykładowych wierszy dla kontekstu, abyś lepiej zrozumiał(a) zawartość kolumn:
        ${JSON.stringify(sampleRows, null, 2)}
        
        Oto nasza nowa, hierarchiczna BAZA WIEDZY. Zawiera ona OBSZARY, które dzielą się na szczegółowe CZYNNIKI. Każdy czynnik ma ID, nazwy i listę przykładowych pytań, które pomogą Ci w dopasowaniu:
        --- POCZĄTEK BAZY WIEDZY ---
        ${JSON.stringify(HIERARCHICAL_MAPPING_KNOWLEDGE_BASE, null, 2)}
        --- KONIEC BAZY WIEDZY ---

        Twoje zadanie:
        Stwórz obiekt JSON, w którym kluczem jest każdy nagłówek z pliku użytkownika, a wartością jest ID najlepiej pasującego CZYNNIKA (np. "fair_pay_perception") z bazy wiedzy.
        - Dla każdego nagłówka znajdź jeden, najlepiej pasujący czynnik. Analizuj zarówno treść nagłówka, jak i przykładowe pytania dla każdego czynnika w bazie wiedzy.
        - Jeśli dla danego nagłówka absolutnie nie możesz znaleźć pasującego czynnika, przypisz mu wartość 'null'.
        - Zmapuj również kolumny demograficzne. Jeśli znajdziesz kolumnę, która wygląda jak staż pracy, przypisz jej ID "tenure_years". Jeśli znajdziesz dział, przypisz jej ID "department".

        Zwróć odpowiedź WYŁĄCZNIE jako obiekt JSON. Przykład formatu wyjściowego:
        {
          "W którym dziale pracujesz?": "department",
          "Staż pracy (w latach)": "tenure_years",
          "Czy czujesz, że Twoja praca jest dobrze wynagradzana?": "fair_pay_perception",
          "Ocena benefitów pozapłacowych": "benefits_satisfaction",
          "Czy Twoje zadania są interesujące?": "task_interest",
          "Kolumna_bez_znaczenia": null
        }
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text());
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Błąd podczas uzyskiwania mapowania od AI: ${errorMessage}`
    );
  }
}

/**
 * Pomocnicza funkcja do wyszukiwania szczegółów obszaru i czynnika na podstawie ID czynnika.
 */
function getDetailsFromFactorId(factorId: string): FactorDetails | null {
  for (const areaId in HIERARCHICAL_MAPPING_KNOWLEDGE_BASE) {
    const area =
      HIERARCHICAL_MAPPING_KNOWLEDGE_BASE[
        areaId as keyof typeof HIERARCHICAL_MAPPING_KNOWLEDGE_BASE
      ];

    if (factorId in area.factors) {
      const factor = area.factors[factorId as keyof typeof area.factors] as {
        namePl: string;
        nameEn: string;
        exampleQuestions: string[];
      };

      return {
        area_id: areaId,
        area_name_pl: area.namePl,
        area_name_en: area.nameEn,
        factor_id: factorId,
        factor_name_pl: factor.namePl,
        factor_name_en: factor.nameEn,
      };
    }
  }
  return null;
}

/**
 * Transformuje surowe dane na ustrukturyzowany format kanoniczny na podstawie mapowania AI.
 */
function transformData(
  rawData: ParsedData[],
  aiMapping: Record<string, string | null> // format: { "CSV Header": "factor_id", ... }
): EmployeeResponse[] {
  const transformed: EmployeeResponse[] = [];

  rawData.forEach((rawRow, rowIndex) => {
    const employeeResponse: EmployeeResponse = {
      id: `respondent_${rowIndex + 1}`,
      details: {},
      scores: [],
    };

    for (const originalHeader in rawRow) {
      if (Object.prototype.hasOwnProperty.call(rawRow, originalHeader)) {
        const mappedId = aiMapping[originalHeader]; // To jest nasz factor_id, "department", "tenure_years" lub null
        const value = rawRow[originalHeader];

        if (!mappedId) {
          continue; // Pomiń niezmapowane kolumny
        }

        if (mappedId === "department" || mappedId === "tenure_years") {
          employeeResponse.details[mappedId] = value as string | number;
        } else {
          // To jest ID czynnika. Pobierzmy wszystkie szczegóły (obszar + czynnik).
          const details = getDetailsFromFactorId(mappedId);

          if (details) {
            employeeResponse.scores.push({
              ...details,
              question: originalHeader, // Oryginalne pytanie z pliku użytkownika
              score: Number(value),
            });
          }
        }
      }
    }

    if (
      Object.keys(employeeResponse.details).length > 0 ||
      employeeResponse.scores.length > 0
    ) {
      transformed.push(employeeResponse);
    }
  });

  return transformed;
}

// --- GŁÓWNA FUNKCJA UPLOADU ---

export async function uploadExamination(formData: FormValues) {
  // Parse the file (CSV or Excel)
  const { data: rawData, headers } = await parseFile(formData.file);

  const sampleRows = rawData.slice(0, 3);

  // Krok 1: Uzyskaj mapowanie od AI { "Pytanie z pliku": "id_czynnika" }
  const aiMapping = await getAiMapping(headers, sampleRows);

  // W przyszłości tutaj może być krok weryfikacji mapowania przez użytkownika
  const finalMapping = aiMapping;

  console.log("Final AI Mapping:", finalMapping);

  // Krok 2: Przetwórz dane na podstawie nowego, szczegółowego mapowania
  const structuredData = transformData(rawData, finalMapping);

  // Logowanie przykładowego wyniku transformacji dla weryfikacji
  // console.log("Transformed Structured Data Example:", JSON.stringify(structuredData.slice(0,1), null, 2));

  const examination = await insertExamination({
    id: randomUUID(),
    name: formData.name,
    description: formData.description,
    type: "ENGAGEMENT",
    sourceData: structuredData, // Zapisz nowe, wzbogacone dane
  });

  return examination;
}

export async function getExaminations() {
  const examinations = await getExaminationsFromDb();
  return examinations;
}
