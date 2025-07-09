import { ExaminationTable, ReportContent } from "@/drizzle/schema";
import {
  GoogleGenerativeAI,
  GenerationConfig,
  GenerativeModel,
} from "@google/generative-ai";
import { env } from "@/data/env/server";
import {
  SurveyRespondent,
  SurveyDataItem,
  DetailedAreaData,
  StatisticsResult,
  InitialAnalysisResult,
  KnowledgeBase,
  OverallContentResult,
  DetailedAreaContent,
  LeaderGuideline,
  ApiResponse,
} from "./types";

// --- KONFIGURACJA ---
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const MODEL_CONFIG: GenerationConfig = {
  responseMimeType: "application/json",
  temperature: 0.1,
  maxOutputTokens: 8192,
};

const model: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  generationConfig: MODEL_CONFIG,
});

function getKnowledgeBase(): KnowledgeBase {
  return {
    "Wynagrodzenie i benefity": {
      "1": {
        description:
          "Pracownicy, którzy uważają, że ich zarobki są niewystarczające, często tracą zapał do pracy. Frustracja wynikająca z niespełnionych oczekiwań finansowych prowadzi do spadku motywacji, przez co wykonywane obowiązki stają się jedynie rutyną, a nie polem do wykazywania kreatywności. W efekcie firma traci nie tylko zaangażowanie swoich pracowników, ale także potencjalne innowacje, które mogłyby przyczynić się do jej rozwoju. Długofalowo taki stan rzeczy negatywnie wpływa na efektywność całej organizacji. Stres i frustracja, spadek motywacji, spóźnienia, obniżenie kreatywności, poszukiwanie alternatywnych możliwości zatrudnienia.",
        recommendations: [
          "Przeprowadzenie indywidualnych rozmów z pracownikami w celu zrozumienia przyczyn ich niezadowolenia",
          "Dokonanie przeglądu i ewentualnej korekty wynagrodzeń, aby zapewnić ich konkurencyjność na rynku",
          "Wprowadzenie przejrzystego systemu komunikacji dotyczącego polityki wynagrodzeń i możliwości rozwoju w firmie",
          "Opracowanie planu rozwoju zawodowego dla każdego pracownika, pokazującego ścieżkę kariery i możliwości wzrostu wynagrodzenia",
          "Wdrożenie programów wellbeing, które pomogą w redukcji stresu i frustracji związanych z pracą",
          "Rozważenie wprowadzenia elastycznych form pracy, które mogą częściowo zrekompensować niezadowolenie z wynagrodzenia",
        ],
        businessImpact:
          "Niski poziom zaangażowania i produktywności; obniżona jakość pracy oraz duże koszty ukryte; wyższa rotacja; rotacja kluczowych pracowników.",
      },
      "2": {
        description:
          "Pracownicy na tym poziomie odczuwają znaczące niezadowolenie z otrzymywanego wynagrodzenia i pakietu benefitów, ale nie w stopniu tak skrajnym jak na poziomie 1. Ich motywacja jest niska, co przekłada się na obniżoną wydajność i zaangażowanie w pracę. Pracownicy mogą czuć się niedoceniani i rozważać zmianę pracy, ale nie podejmują jeszcze aktywnych działań w tym kierunku.",
        recommendations: [
          "Przeprowadzenie analizy rynku wynagrodzeń i dostosowanie płac do średnich stawek w branży",
          "Wprowadzenie systemu kafeteryjnego, pozwalającego pracownikom na wybór benefitów najlepiej dopasowanych do ich potrzeb",
          "Stworzenie programów szkoleniowych i rozwojowych, które zwiększą kompetencje pracowników i ich wartość na rynku pracy",
          "Wdrożenie systemu regularnych feedbacków i ocen pracowniczych, które pozwolą na szybkie reagowanie na problemy i frustracje",
          "Poprawę komunikacji wewnętrznej, szczególnie w zakresie celów firmy i roli pracowników w ich osiąganiu",
          "Wprowadzenie programów uznaniowych i nagród za osiągnięcia, które mogą częściowo zrekompensować niezadowolenie z podstawowego wynagrodzenia",
        ],
        businessImpact:
          "Niskie/niedoszacowane wynagrodzenie i benefity zmniejszają satysfakcję, zwiększają rotację i odpychają talenty. Pracownicy NIEczujący się docenieni finansowo są MNIEJ zmotywowani.",
      },
      "3": {
        description:
          "Pracownicy na tym poziomie nie są ani szczególnie zadowoleni, ani niezadowoleni ze swojego wynagrodzenia i benefitów. Uznają, że ich zarobki są wystarczające do zaspokojenia podstawowych potrzeb, ale nie stanowią źródła dodatkowej motywacji. Ich podejście do pracy jest raczej neutralne - wykonują swoje obowiązki bez szczególnego entuzjazmu, ale też bez wyraźnej niechęci.",
        recommendations: [
          "Wdrożenie innowacyjnych rozwiązań w zakresie benefitów, takich jak personalizowane pakiety świadczeń dostępne przez aplikacje mobilne",
          "Wprowadzenie elastycznych form pracy, które pozwolą na lepsze dostosowanie życia zawodowego do prywatnego",
          "Stworzenie programów rozwojowych i edukacyjnych, które pokażą pracownikom możliwości awansu i rozwoju w firmie",
          "Implementację holistycznych programów wellbeing, obejmujących zarówno fizyczne, jak i psychiczne aspekty zdrowia",
          "Zwiększenie zaangażowania pracowników poprzez włączenie ich w procesy decyzyjne i dawanie większej autonomii w wykonywaniu zadań",
          "Regularne badanie satysfakcji pracowników i szybkie reagowanie na zidentyfikowane problemy",
        ],
        businessImpact:
          "Pracownicy mają neutralne nastawienie do celów i wartości firmy. Pracownicy nie angażują się głębiej, ograniczają inicjatywę. To często moment 'zatrzymania rozwoju', który negatywnie wpływa na innowacyjność i retencję młodych talentów. Potencjał do poprawy wydajności przy odpowiedniej motywacji.",
      },
      "4": {
        description:
          "Pracownicy na tym poziomie są generalnie zadowoleni ze swojego wynagrodzenia i pakietu benefitów. Uważają, że ich praca jest doceniana i sprawiedliwie wynagradzana, co przekłada się na pozytywne nastawienie do wykonywanych obowiązków. Są zmotywowani do dobrej pracy i wykazują się inicjatywą, choć wciąż widzą przestrzeń do poprawy w niektórych aspektach swojego wynagrodzenia.",
        recommendations: [
          "Kontynuację i rozszerzenie programów doceniania i nagradzania pracowników za ich wkład i osiągnięcia",
          "Oferowanie zaawansowanych możliwości rozwoju, takich jak indywidualne ścieżki kariery czy programy mentoringowe",
          "Zwiększenie autonomii pracowników w zakresie podejmowania decyzji i realizacji projektów",
          "Wdrożenie programów innowacyjności, zachęcających pracowników do proponowania i wdrażania nowych rozwiązań",
          "Stworzenie możliwości udziału w projektach międzynarodowych lub rotacji stanowisk, co może dodatkowo motywować i rozwijać pracowników",
          "Oferowanie dodatkowych benefitów związanych z work-life balance, takich jak dodatkowe dni wolne czy wsparcie w realizacji pasji pozazawodowych",
        ],
        businessImpact:
          "Obszar realnie wspiera strategię biznesową. Pracownicy są zmotywowani, procesy działają płynnie, a zespoły współpracują efektywnie. To często koreluje z wysokim NPS pracowniczym i zadowoleniem klientów.",
      },
      "5": {
        description:
          "Pracownicy, którzy czują się sprawiedliwie wynagradzani, wykazują wyższy poziom motywacji i lojalności wobec swojego pracodawcy. Dzięki temu ich zaangażowanie w wykonywane obowiązki wzrasta, a cele firmy stają się dla nich równie ważne, jak ich własne. Dostrzegając wyraźny związek między włożonym wysiłkiem a uzyskiwanymi korzyściami, zyskują dodatkową energię do działania i chęć dalszego rozwoju.",
        recommendations: [
          "Stworzenie programów ambasadorskich, w których zadowoleni pracownicy mogą dzielić się swoimi pozytywnymi doświadczeniami i przyciągać nowe talenty",
          "Oferowanie możliwości udziału w strategicznych projektach firmy i wpływania na kierunki jej rozwoju",
          "Wprowadzenie programów dzielenia się wiedzą, gdzie doświadczeni pracownicy mogą mentorować młodszych kolegów",
          "Stworzenie indywidualnych pakietów benefitów, które będą odpowiadać specyficznym potrzebom i aspiracjom najbardziej wartościowych pracowników",
          "Oferowanie udziałów w firmie lub programów partycypacji w zyskach, co jeszcze bardziej zwiąże pracowników z sukcesem organizacji",
          "Wspieranie inicjatyw pracowniczych związanych z odpowiedzialnością społeczną i zrównoważonym rozwojem, co może dodatkowo wzmocnić ich poczucie sensu i satysfakcji z pracy",
        ],
        businessImpact:
          "Obszar jest wyróżnikiem kultury organizacyjnej. Firma zyskuje przewagę konkurencyjną dzięki stabilnym, zmotywowanym zespołom. Poziom ten przekłada się na wzrost efektywności, sprzedaży i utrzymania klientów.",
      },
    },
    "Wpływ i znaczenie pracy": {
      "1": {
        description:
          "Pracownicy, którzy nie widzą sensu w swojej pracy, szybko tracą zaangażowanie i motywację. Stają się apatyczni, co prowadzi do obniżenia ich produktywności oraz jakości wykonywanych zadań. Brak poczucia sensu rodzi frustrację i negatywne emocje, które łatwo przenoszą się na pozostałych członków zespołu, wpływając na atmosferę w miejscu pracy. W efekcie firma traci nie tylko efektywność, ale również możliwość realizacji nowych pomysłów i projektów.",
        recommendations: [
          "Przeprowadzenie indywidualnych rozmów z pracownikami w celu zrozumienia przyczyn braku poczucia sensu w pracy",
          "Wdrożenie programu komunikacji wewnętrznej, który jasno przedstawi cele firmy i rolę każdego pracownika w ich osiąganiu",
          "Organizacja warsztatów z zakresu zarządzania stresem i budowania odporności psychicznej",
          "Wprowadzenie systemu rotacji stanowisk, aby pracownicy mogli poznać różne aspekty działalności firmy i znaleźć obszar, który będzie dla nich bardziej znaczący",
          "Stworzenie programu mentoringu, w którym bardziej doświadczeni i zaangażowani pracownicy będą wspierać tych z niskim poczuciem wpływu i znaczenia",
          "Regularne badanie satysfakcji pracowników i szybkie reagowanie na zidentyfikowane problemy",
        ],
        businessImpact:
          "Negatywny wpływ na produktywność, innowacyjność i atmosferę w zespole; Wysoka rotacja; Osłabiona jakość obsługi klienta i większa liczba błędów operacyjnych.",
      },
      "2": {
        description:
          "Pracownicy na tym poziomie mają bardzo ograniczone poczucie wpływu i znaczenia swojej pracy. Mogą wykonywać swoje obowiązki, ale bez przekonania o ich istotności. Ich zaangażowanie jest minimalne, a motywacja opiera się głównie na czynnikach zewnętrznych, takich jak wynagrodzenie.",
        recommendations: [
          "Opracowanie systemu regularnych feedbacków, podkreślających wpływ pracy każdego pracownika na cele organizacji",
          "Wprowadzenie programu rozwoju osobistego, pomagającego pracownikom odkryć swoje mocne strony i pasje zawodowe",
          "Organizacja spotkań zespołowych, podczas których pracownicy mogą dzielić się swoimi sukcesami i wyzwaniami, budując poczucie wspólnoty",
          "Wdrożenie systemu sugestii pracowniczych, zachęcającego do proponowania usprawnień i innowacji",
          "Stworzenie ścieżek kariery, pokazujących możliwości rozwoju w organizacji",
          "Wprowadzenie elementów grywalizacji do codziennej pracy, aby zwiększyć zaangażowanie i motywację",
        ],
        businessImpact:
          "Potencjalne problemy z retencją pracowników; cicha rezygnacja pracowników ('quiet quitting') z powodu poczucia bycia trybikiem w maszynie, które może eskalować do jawnej frustracji i rezygnacji.",
      },
      "3": {
        description:
          "Pracownicy na tym poziomie dostrzegają pewien wpływ i znaczenie swojej pracy, ale nie jest to dla nich głównym źródłem motywacji. Wykonują swoje obowiązki sumiennie, ale bez szczególnego entuzjazmu czy zaangażowania wykraczającego poza podstawowe wymagania.",
        recommendations: [
          "Organizacja warsztatów z zakresu job craftingu, pozwalających pracownikom na dostosowanie swoich ról do osobistych preferencji i mocnych stron",
          "Wprowadzenie programu uznaniowego, doceniającego nie tylko wyniki, ale także zaangażowanie i inicjatywę",
          "Stworzenie możliwości udziału w projektach międzydziałowych, poszerzających perspektywę pracowników",
          "Regularne sesje informacyjne na temat strategii firmy i jej wpływu na otoczenie, aby wzmocnić poczucie sensu pracy",
          "Wdrożenie programu wolontariatu pracowniczego, pozwalającego na realizację ważnych społecznie celów",
        ],
        businessImpact:
          "Stabilne, ale przeciętne wyniki; potencjał zespołu nie jest wykorzystywany w pełni",
      },
      "4": {
        description:
          "Pracownicy na tym poziomie wyraźnie dostrzegają wpływ i znaczenie swojej pracy. Są zaangażowani w swoje obowiązki i często wychodzą poza podstawowe wymagania. Identyfikują się z celami firmy i aktywnie przyczyniają się do ich realizacji.",
        recommendations: [
          "Stworzenie programu ambasadorów wewnętrznych, gdzie zaangażowani pracownicy mogą inspirować innych",
          "Oferowanie możliwości udziału w konferencjach branżowych i szkoleniach zewnętrznych, poszerzających horyzonty",
          "Wprowadzenie systemu mentoringu odwróconego, gdzie młodsi pracownicy dzielą się swoją wiedzą z bardziej doświadczonymi kolegami",
          "Organizacja hackathonów lub konkursów innowacji, dających przestrzeń do kreatywnego rozwiązywania problemów",
          "Stworzenie programu wymiany pracowników między oddziałami lub partnerskimi firmami",
          "Włączenie pracowników w procesy decyzyjne dotyczące strategicznych kierunków rozwoju firmy",
        ],
        businessImpact:
          "Wyższa efektywność zespołowa; wzrost satysfakcji klienta i rekomendacje oraz wyższy poziom utrzymania klientów",
      },
      "5": {
        description:
          "Pracownicy, którzy wierzą, że ich praca ma realny wpływ na otoczenie, wykazują większe zaangażowanie i dumę z osiąganych rezultatów. Tacy ludzie stają się ambasadorami firmy, promując jej wartości i aktywnie poszukując innowacyjnych rozwiązań. Dzięki temu organizacja zyskuje lojalnych pracowników, którzy nie tylko przyczyniają się do jej sukcesu, ale również inspirują innych do działania. Silne poczucie sensu w pracy wzmacnia więź między firmą a jej pracownikami, co pozytywnie wpływa na rozwój całego zespołu.",
        recommendations: [
          "Stworzenie programu liderów transformacji, gdzie najbardziej zaangażowani pracownicy mogą inicjować i prowadzić kluczowe projekty zmian w organizacji",
          "Oferowanie możliwości udziału w zarządzaniu firmą poprzez programy akcjonariatu pracowniczego",
          "Stworzenie platformy do dzielenia się wiedzą i najlepszymi praktykami w całej organizacji",
          "Organizacja cyklicznych spotkań z zarządem, podczas których pracownicy mogą prezentować swoje wizje rozwoju firmy",
          "Wprowadzenie programu sabbatical, umożliwiającego pracownikom realizację osobistych projektów rozwojowych",
          "Stworzenie funduszu innowacji, z którego pracownicy mogą pozyskiwać środki na realizację własnych pomysłów biznesowych w ramach organizacji",
        ],
        businessImpact:
          "Wzrost efektywności o 20–30%; wyższy poziom lojalności klienta; pozytywny employer branding; utrzymanie talentów powyżej 90%; firma zyskuje oddanych pracowników, którzy aktywnie dążą do realizacji celów i wnoszą istotny wkład w jej sukces; pracownicy stają się ambasadorami firmy, aktywnie poszukując nowych rozwiązań i możliwości rozwoju",
      },
    },
    "Uznanie i docenianie": {
      "1": {
        description:
          "Brak uznania dla wysiłków pracowników może prowadzić do poważnych konsekwencji zarówno dla nich, jak i dla firmy. Pracownicy, którzy nie czują się doceniani, stopniowo tracą motywację i zaangażowanie w swoje obowiązki. Poczucie niedocenienia rodzi frustrację, a w dłuższej perspektywie może skłonić ich do poszukiwania nowego miejsca zatrudnienia, gdzie ich praca zostanie odpowiednio zauważona. Dla firmy oznacza to nie tylko utratę doświadczonych pracowników, ale również dodatkowe koszty związane z procesami rekrutacji, wdrożeniem nowych osób oraz potencjalnym spadkiem efektywności zespołu.",
        recommendations: [
          "Przeprowadzenie szkoleń dla kadry zarządzającej na temat znaczenia uznania i efektywnych metod doceniania pracowników",
          "Wdrożenie formalnego programu uznania, który zapewni regularne i systematyczne docenianie pracowników",
          "Wprowadzenie narzędzi do monitorowania zaangażowania pracowników i ich satysfakcji z pracy, np. regularne ankiety lub rozmowy one-on-one",
          "Stworzenie kultury otwartej komunikacji, zachęcającej pracowników do dzielenia się swoimi potrzebami i oczekiwaniami",
          "Implementacja systemu peer-to-peer recognition, umożliwiającego pracownikom wzajemne docenianie się",
          "Organizacja warsztatów dla pracowników na temat budowania poczucia własnej wartości i radzenia sobie z brakiem uznania",
        ],
        businessImpact:
          "Wyższa rotacja; utrata talentów i pogorszenie relacji z klientami",
      },
      "2": {
        description:
          "Na tym poziomie pracownicy doświadczają okazjonalnego uznania, ale jest ono nieregularne i często niewystarczające. Mogą czuć się doceniani tylko za wyjątkowe osiągnięcia, podczas gdy ich codzienny wysiłek pozostaje niezauważony.",
        recommendations: [
          "Opracowanie jasnych kryteriów uznania, aby zapewnić bardziej regularne i sprawiedliwe docenianie pracowników",
          "Wprowadzenie cotygodniowych lub comiesięcznych sesji uznania w zespołach, podczas których liderzy i współpracownicy mogą wyrazić swoje docenianie",
          "Stworzenie programu nagród za małe sukcesy, aby doceniać nie tylko duże osiągnięcia, ale także codzienne wysiłki pracowników",
          "Implementacja systemu punktowego, w którym pracownicy mogą zbierać punkty za różne osiągnięcia i wymieniać je na nagrody",
          "Organizacja szkoleń dla menedżerów na temat efektywnego i regularnego udzielania feedbacku",
          'Wprowadzenie "ściany chwały" (fizycznej lub wirtualnej), gdzie można publicznie doceniać osiągnięcia pracowników',
        ],
        businessImpact:
          "Brak kultury feedbacku obniża efektywność i jakość pracy zespołowej; cicha rezygnacja oraz brak lojalności wobec pracodawcy; odejście zaangażowanych pracowników; pogorszenie wizerunku wewnętrznego.",
      },
      "3": {
        description:
          "Pracownicy na tym poziomie doświadczają regularnego, ale podstawowego uznania. Ich praca jest zauważana, ale docenianie może być powierzchowne lub schematyczne.",
        recommendations: [
          "Personalizacja metod uznania poprzez poznanie indywidualnych preferencji pracowników (np. publiczne vs. prywatne docenianie)",
          "Wdrożenie programu mentoringu, w ramach którego bardziej doświadczeni pracownicy mogą wspierać i doceniać młodszych kolegów",
          "Organizacja regularnych wydarzeń integracyjnych, podczas których można celebrować sukcesy zespołu i indywidualne osiągnięcia",
          "Wprowadzenie systemu nominacji pracowniczych do nagród, aby zwiększyć zaangażowanie w proces doceniania",
          "Stworzenie newslettera firmowego lub sekcji w intranecie, gdzie regularnie prezentowane są osiągnięcia pracowników",
          "Implementacja programu rozwoju kariery, który pozwoli pracownikom zobaczyć, jak ich wysiłki przekładają się na możliwości awansu i rozwoju w firmie",
        ],
        businessImpact:
          "Neutralne nastawienie do długoterminowej kariery w firmie.",
      },
      "4": {
        description:
          "Na tym poziomie pracownicy regularnie doświadczają znaczącego uznania za swoją pracę. Ich wysiłki są doceniane zarówno przez przełożonych, jak i współpracowników.",
        recommendations: [
          "Wdrożenie zaawansowanego systemu uznania, który łączy różne formy doceniania (np. finansowe, rozwojowe, społeczne)",
          "Stworzenie programu ambasadorów kultury doceniania, gdzie wyróżniający się pracownicy promują dobre praktyki w całej organizacji",
          "Organizacja warsztatów kreatywności, gdzie pracownicy mogą prezentować i być doceniani za innowacyjne pomysły",
          "Wprowadzenie systemu rotacji stanowisk lub projektów, aby pracownicy mogli zdobywać nowe doświadczenia i być doceniani w różnych kontekstach",
          "Implementacja programu dzielenia się sukcesami, gdzie pracownicy regularnie prezentują swoje osiągnięcia przed szerszym gronem",
          "Stworzenie funduszu innowacji, z którego pracownicy mogą otrzymać środki na realizację własnych projektów, będących formą uznania ich kreatywności",
        ],
        businessImpact:
          "Większa lojalność i wzrost rekomendacji jako pracodawca",
      },
      "5": {
        description:
          "Regularne docenianie pracowników ma niezwykle pozytywny wpływ na ich postawy i relacje z firmą. Doceniani pracownicy czują się wartościowi i potrzebni, co wzmacnia ich poczucie własnej wartości oraz lojalność wobec organizacji. Tworzy to kulturę wzajemnego szacunku i wsparcia, która przekłada się na lepszą atmosferę w pracy oraz wyższe wyniki całego zespołu. Pracownicy, którzy wiedzą, że ich wysiłki są zauważane i doceniane, są bardziej zmotywowani do działania, co pomaga firmie osiągać ambitne cele i budować trwałą przewagę na rynku.",
        recommendations: [
          "Wdrożenie kompleksowego programu well-being, który uznaje i wspiera całościowy rozwój pracowników (zawodowy, osobisty, zdrowotny)",
          "Stworzenie programu wymiany międzynarodowej lub międzydziałowej, umożliwiającego pracownikom zdobywanie nowych doświadczeń jako forma uznania ich wartości dla firmy",
          "Implementacja systemu partycypacji pracowniczej w zarządzaniu firmą, np. poprzez udział w radach doradczych czy komitetach strategicznych",
          "Organizacja corocznej gali uznania, podczas której wyróżniani są najlepsi pracownicy w różnych kategoriach",
          "Wprowadzenie programu sabbatical dla długoletnich pracowników, umożliwiającego im realizację osobistych projektów lub dalszą edukację",
          "Stworzenie fundacji firmowej, w której doceniani pracownicy mogą angażować się w projekty społeczne wspierane przez organizację",
        ],
        businessImpact:
          "Wyższa produktywność, spójność kultury, niższa rotacja, większa liczba poleceń rekrutacyjnych. Pracownicy inspirują siebie nawzajem.",
      },
    },
    "Technologia i narzędzia pracy": {
      "1": {
        description:
          "Praca na przestarzałym sprzęcie może być źródłem frustracji dla pracowników, którzy muszą poświęcać więcej czasu na realizację swoich zadań. Powolne działanie technologii i brak nowoczesnych narzędzi obniżają efektywność, a także jakość wykonywanej pracy. Pracownicy czują się zniechęceni, co negatywnie wpływa na ich motywację i zaangażowanie. W efekcie firma nie tylko traci na wydajności, ale również na konkurencyjności, gdyż nie jest w stanie sprostać szybko zmieniającym się wymaganiom rynku.",
        recommendations: [
          "Przeprowadzenie kompleksowej analizy obecnej infrastruktury technologicznej i identyfikacja kluczowych obszarów wymagających natychmiastowej modernizacji",
          "Opracowanie planu stopniowej wymiany przestarzałego sprzętu, priorytetyzując narzędzia mające największy wpływ na produktywność pracowników",
          "Wdrożenie podstawowych narzędzi do współpracy online, takich jak platformy do komunikacji i zarządzania projektami, aby poprawić efektywność pracy zespołowej",
          "Przeprowadzenie szkoleń dla pracowników z zakresu efektywnego wykorzystania dostępnych narzędzi, nawet jeśli są one ograniczone",
          "Zbieranie regularnego feedbacku od pracowników na temat największych wyzwań technologicznych, z jakimi się borykają, aby lepiej ukierunkować przyszłe inwestycje",
          "Rozważenie wdrożenia polityki BYOD (Bring Your Own Device), aby pracownicy mogli korzystać z własnych, bardziej nowoczesnych urządzeń, jeśli firma nie może natychmiast zainwestować w nowy sprzęt",
        ],
        businessImpact:
          "Spadek wydajności nawet o 30%, wzrost liczby błędów, spowolnienie obsługi klienta. Wzrost kosztów operacyjnych i strat wynikających z opóźnień.",
      },
      "2": {
        description:
          "Na tym poziomie technologie i narzędzia pracy są funkcjonalne, ale ograniczone w możliwościach. Pracownicy mają dostęp do podstawowych narzędzi, które pozwalają im wykonywać swoje obowiązki, ale nie oferują żadnych dodatkowych udogodnień czy możliwości zwiększenia efektywności.",
        recommendations: [
          "Przeprowadzenie audytu wykorzystania obecnych narzędzi i identyfikacja obszarów, gdzie małe ulepszenia mogą przynieść znaczące korzyści",
          "Wdrożenie chmurowych rozwiązań do przechowywania i udostępniania danych, co może znacząco poprawić współpracę bez konieczności dużych inwestycji w sprzęt",
          "Wprowadzenie programu pilotażowego dla wybranych, bardziej zaawansowanych narzędzi w kluczowych działach, aby ocenić ich wpływ na produktywność",
          "Organizacja warsztatów i szkoleń mających na celu maksymalizację wykorzystania dostępnych narzędzi i odkrycie ich mniej znanych funkcji",
          "Opracowanie strategii cyfrowej transformacji firmy, uwzględniającej stopniowe wprowadzanie bardziej zaawansowanych technologii",
          "Zachęcanie pracowników do dzielenia się pomysłami na usprawnienie procesów przy użyciu dostępnych narzędzi, co może prowadzić do innowacyjnych rozwiązań bez dużych nakładów finansowych",
        ],
        businessImpact:
          "Zwiększony czas obsługi, obniżenie jakości doświadczenia klienta, brak płynności operacyjnej. Niższa jakość danych.",
      },
      "3": {
        description:
          "Technologie i narzędzia pracy na tym poziomie są aktualne i wystarczające do wykonywania codziennych zadań. Pracownicy mają dostęp do standardowych rozwiązań, które pozwalają im pracować efektywnie, ale bez szczególnych udogodnień czy możliwości znaczącego zwiększenia produktywności.",
        recommendations: [
          "Przeprowadzenie benchmarkingu technologicznego w porównaniu z konkurencją, aby zidentyfikować obszary potencjalnej przewagi",
          "Wdrożenie zaawansowanych narzędzi analitycznych, które pomogą w podejmowaniu decyzji opartych na danych",
          "Eksperymentowanie z nowymi technologiami poprzez krótkoterminowe licencje lub okresy próbne, aby ocenić ich potencjalny wpływ na produktywność",
          "Stworzenie programu ambasadorów technologii wśród pracowników, którzy będą testować i promować nowe narzędzia w swoich zespołach",
          "Inwestycja w szkolenia z zakresu zaawansowanych funkcji obecnie używanych narzędzi, aby maksymalizować ich wykorzystanie",
          'Wprowadzenie regularnych "hackatonów" lub sesji innowacji, podczas których pracownicy mogą eksperymentować z nowymi technologiami i proponować usprawnienia',
        ],
        businessImpact:
          "Zwiększone koszty czasu pracy (nadgodziny, powtórzenia). Ograniczone tempo rozwoju firmy, niska automatyzacja.",
      },
      "4": {
        description:
          "Na tym poziomie pracownicy mają dostęp do nowoczesnych technologii i narzędzi, które znacząco ułatwiają ich pracę i zwiększają efektywność. Narzędzia te oferują zaawansowane funkcje i możliwości, które pozwalają na optymalizację procesów i zwiększenie produktywności.",
        recommendations: [
          "Wdrożenie zaawansowanych narzędzi do automatyzacji procesów biznesowych (RPA), aby dalej zwiększyć efektywność i uwolnić czas pracowników na bardziej strategiczne zadania",
          "Inwestycja w narzędzia do personalizacji doświadczeń pracowników, takie jak inteligentne asystenty AI czy spersonalizowane dashboardy",
          "Wprowadzenie programu innowacji wewnętrznych, zachęcającego pracowników do proponowania i rozwijania nowych narzędzi i rozwiązań technologicznych",
          "Organizacja regularnych sesji wymiany wiedzy między działami, aby promować najlepsze praktyki w wykorzystaniu zaawansowanych narzędzi",
          "Wdrożenie zaawansowanych systemów bezpieczeństwa i prywatności danych, aby zapewnić bezpieczne korzystanie z nowoczesnych technologii",
          "Stworzenie ścieżek rozwoju kariery związanych z technologią, aby motywować pracowników do ciągłego podnoszenia swoich umiejętności technologicznych",
        ],
        businessImpact:
          "Wyższa produktywność, niższe koszty operacyjne, wyższa jakość danych i lepsze decyzje biznesowe.",
      },
      "5": {
        description:
          "Dostęp do nowoczesnych technologii znacząco poprawia komfort pracy i pozwala pracownikom działać wydajniej oraz bardziej efektywnie. Dzięki lepszym narzędziom ich obowiązki stają się prostsze i przyjemniejsze, co przekłada się na wyższą produktywność oraz większą innowacyjność. Firma, która inwestuje w nowoczesny sprzęt, zyskuje zaangażowanych pracowników oraz przewagę konkurencyjną. Jest także w stanie szybciej reagować na zmieniające się potrzeby klientów i rynku, co przyczynia się do jej długofalowego sukcesu.",
        recommendations: [
          "Inwestycja w zaawansowane technologie AI i machine learning, które mogą przewidywać trendy rynkowe i optymalizować procesy biznesowe",
          "Wdrożenie platform do tworzenia aplikacji low-code/no-code, umożliwiających pracownikom samodzielne tworzenie narzędzi i automatyzacji",
          "Stworzenie laboratorium innowacji, gdzie pracownicy mogą eksperymentować z najnowszymi technologiami, takimi jak VR/AR czy IoT, w kontekście biznesowym",
          "Nawiązanie partnerstw z start-upami technologicznymi i instytucjami badawczymi, aby być na bieżąco z najnowszymi trendami i innowacjami",
          "Wdrożenie zaawansowanych narzędzi do współpracy w czasie rzeczywistym, które umożliwiają płynną pracę zespołów rozproszonych geograficznie",
          "Inwestycja w technologie wspierające zrównoważony rozwój i efektywność energetyczną, co może przyczynić się do innowacji w procesach biznesowych i poprawy wizerunku firmy",
        ],
        businessImpact:
          "Wyższa efektywność procesów, niższe koszty, lepsze raportowanie i przewidywanie. Firma postrzegana jako nowoczesna i przyjazna technologicznie.",
      },
    },
    "Środowisko pracy i kultura organizacyjna": {
      "1": {
        description:
          "Toksyczna atmosfera, konflikty i brak wsparcia. Pracownicy odczuwają silny stres i niechęć do przychodzenia do pracy, co prowadzi do absencji i problemów zdrowotnych.",
        recommendations: [
          "Natychmiastowa interwencja HR/mediacja w zespołach konfliktowych.",
          "Szkolenia z komunikacji i rozwiązywania konfliktów.",
          "Jasne zdefiniowanie i egzekwowanie wartości firmowych oraz polityki antymobbingowej.",
        ],
        businessImpact:
          "Wysoka rotacja, absencja i koszty prawne. Zniszczona reputacja pracodawcy, co uniemożliwia rekrutację. Spadek produktywności i morale.",
      },
      "2": {
        description:
          "Środowisko pracy jest niespójne. Występują podziały, a współpraca między działami jest słaba. Kultura firmy jest niezdefiniowana i nie wspiera celów biznesowych.",
        recommendations: [
          "Warsztaty integracyjne i budujące zaufanie.",
          "Wdrożenie projektów międzydziałowych.",
          "Zdefiniowanie i komunikacja misji oraz wizji firmy.",
        ],
        businessImpact:
          "Silosy informacyjne, spowolnione procesy decyzyjne i marnowanie zasobów. Trudności w realizacji złożonych projektów wymagających współpracy.",
      },
      "3": {
        description:
          "Atmosfera jest neutralna, ale brakuje silnych więzi i poczucia wspólnoty. Pracownicy są dla siebie mili, ale nie ma ducha zespołowego ani wzajemnego wsparcia.",
        recommendations: [
          "Inicjatywy integracyjne (formalne i nieformalne).",
          "Stworzenie wspólnych przestrzeni do relaksu i interakcji.",
          "Promowanie wspólnych celów i sukcesów.",
        ],
        businessImpact:
          "Przeciętne zaangażowanie i lojalność. Brak synergii w zespole, co ogranicza kreatywność i innowacyjność. Pracownicy mogą łatwo odejść do firmy z lepszą kulturą.",
      },
      "4": {
        description:
          "W firmie panuje dobra, wspierająca atmosfera. Pracownicy chętnie ze sobą współpracują, czują się częścią zespołu i szanują się nawzajem.",
        recommendations: [
          "Wzmacnianie obecnych pozytywnych praktyk.",
          "Włączenie pracowników w działania employer brandingowe.",
          "Organizowanie wydarzeń firmowych celebrujących sukcesy.",
        ],
        businessImpact:
          "Dobra współpraca, niska rotacja i pozytywny wizerunek pracodawcy. Zwiększona zdolność do przyciągania i zatrzymywania talentów.",
      },
      "5": {
        description:
          "Kultura organizacyjna jest wyjątkowa, oparta na zaufaniu, szacunku i współpracy. Jest to kluczowy czynnik przyciągający i zatrzymujący najlepsze talenty.",
        recommendations: [
          "Uczynienie z kultury firmy głównego elementu przewagi konkurencyjnej.",
          "Programy mentoringowe i buddy system.",
          "Promowanie firmy jako wzoru do naśladowania w zakresie kultury pracy.",
        ],
        businessImpact:
          "Silna kultura staje się legendarna i przyciąga talenty bez wysokich kosztów rekrutacji. Napędza innowacyjność, lojalność klientów i ponadprzeciętne wyniki biznesowe.",
      },
    },
    "Równowaga praca-życie": {
      "1": {
        description:
          "Ciągłe nadgodziny, presja dostępności po godzinach i brak możliwości odpoczynku prowadzą do chronicznego stresu i masowego wypalenia zawodowego.",
        recommendations: [
          "Audyt obciążenia pracą i realokacja zadań.",
          "Wprowadzenie rygorystycznej polityki dotyczącej nadgodzin i prawa do bycia offline.",
          "Zapewnienie profesjonalnego wsparcia psychologicznego i programów antystresowych.",
        ],
        businessImpact:
          "Wysoka absencja, spadek produktywności, wzrost kosztów opieki zdrowotnej i duża rotacja. Ryzyko wypalenia kluczowych specjalistów i kadry zarządzającej.",
      },
      "2": {
        description:
          "Pracownicy mają trudności z pogodzeniem życia zawodowego z prywatnym. Firma nie oferuje wystarczającego wsparcia ani elastyczności w tym zakresie.",
        recommendations: [
          "Wprowadzenie elastycznych godzin pracy.",
          "Zwiększenie wymiaru i elastyczności pracy zdalnej.",
          "Promowanie kultury 'odłączania się' po pracy i szacunku dla czasu wolnego.",
        ],
        businessImpact:
          "Obniżone morale i satysfakcja. Firma traci na atrakcyjności w oczach kandydatów, zwłaszcza młodszych pokoleń, dla których WLB jest priorytetem.",
      },
      "3": {
        description:
          "Firma oferuje standardowe rozwiązania (np. praca zdalna), ale nie zawsze są one wystarczające. Równowaga jest zachowana, ale z wysiłkiem ze strony pracownika.",
        recommendations: [
          "Indywidualne podejście do potrzeb pracowników w zakresie elastyczności.",
          "Programy wsparcia dla rodziców (np. elastyczny czas pracy).",
          "Dofinansowanie zajęć sportowych i rekreacyjnych (karty sportowe).",
        ],
        businessImpact:
          "Firma jest postrzegana jako 'w porządku', ale nie wyróżnia się na rynku. Umiarkowana satysfakcja, która nie przekłada się na silną lojalność.",
      },
      "4": {
        description:
          "Pracownicy są zadowoleni z możliwości godzenia pracy z życiem prywatnym. Firma aktywnie promuje work-life balance i dostarcza odpowiednich narzędzi.",
        recommendations: [
          "Utrzymanie i rozwijanie obecnych polityk.",
          "Promowanie przykładów dobrego balansu wśród liderów, aby pokazać, że jest to możliwe na każdym szczeblu.",
          "Regularne zbieranie feedbacku na temat potrzeb pracowników w zakresie WLB.",
        ],
        businessImpact:
          "Wysoka satysfakcja i lojalność. Lepsza koncentracja i efektywność w godzinach pracy. Pozytywny employer branding.",
      },
      "5": {
        description:
          "Work-life balance jest fundamentem kultury firmy. Pracownicy czują, że firma dba o ich dobrostan holistycznie, co przekłada się na ich lojalność i efektywność.",
        recommendations: [
          "Wprowadzenie dodatkowych dni wolnych na regenerację ('mental health days').",
          "Kompleksowe programy 'wellbeing' obejmujące zdrowie fizyczne, psychiczne i finansowe.",
          "Maksymalna elastyczność i praca oparta na zaufaniu i wynikach, a nie na czasie spędzonym przy biurku.",
        ],
        businessImpact:
          "Firma staje się pracodawcą z wyboru. Przyciąga najlepsze talenty, notuje minimalną rotację i cieszy się opinią organizacji dbającej o człowieka, co przekłada się na wyniki finansowe.",
      },
    },
    "Rozwój zawodowy i kariera": {
      "1": {
        description:
          "Brak jakichkolwiek perspektyw rozwoju. Pracownicy czują, że utknęli w miejscu, co prowadzi do frustracji, apatii i masowych odejść.",
        recommendations: [
          "Natychmiastowe stworzenie i zakomunikowanie podstawowych ścieżek kariery.",
          "Wprowadzenie gwarantowanego budżetu szkoleniowego dla każdego pracownika.",
          "Uruchomienie programów mentoringowych i coachingowych.",
        ],
        businessImpact:
          "Bardzo wysoka rotacja, zwłaszcza wśród ambitnych pracowników. Trudności w obsadzaniu stanowisk wewnętrznie, co zwiększa koszty rekrutacji.",
      },
      "2": {
        description:
          "Możliwości rozwoju są bardzo ograniczone i niejasne. Pracownicy nie wiedzą, co muszą zrobić, aby awansować, a procesy są nietransparentne.",
        recommendations: [
          "Zdefiniowanie i publikacja jasnych kryteriów awansu.",
          "Zwiększenie oferty szkoleń wewnętrznych i zewnętrznych.",
          "Regularne, ustrukturyzowane rozmowy rozwojowe z managerami.",
        ],
        businessImpact:
          " stagnacja kompetencji w organizacji. Pracownicy rozwijają się wolniej, co osłabia konkurencyjność firmy. Demotywacja i poczucie niesprawiedliwości.",
      },
      "3": {
        description:
          "Firma oferuje pewne możliwości rozwoju (np. pojedyncze szkolenia), ale brakuje spójnej strategii i indywidualnego podejścia do pracownika.",
        recommendations: [
          "Stworzenie indywidualnych planów rozwoju dla każdego pracownika.",
          "Wprowadzenie platformy e-learningowej z dostępem do kursów online.",
          "Aktywne promowanie awansów wewnętrznych przed rekrutacją zewnętrzną.",
        ],
        businessImpact:
          "Niewykorzystany potencjał pracowników. Inwestycje w szkolenia nie zawsze przynoszą oczekiwane rezultaty z powodu braku powiązania ze strategią i potrzebami.",
      },
      "4": {
        description:
          "Pracownicy mają jasne ścieżki rozwoju i dostęp do szerokiej gamy szkoleń. Firma jest postrzegana jako miejsce, w którym można się rozwijać.",
        recommendations: [
          "Wprowadzenie programów talentowych dla pracowników o wysokim potencjale.",
          "Możliwość udziału w projektach strategicznych i międzydziałowych.",
          "Dofinansowanie studiów podyplomowych lub prestiżowych certyfikatów.",
        ],
        businessImpact:
          "Silny employer branding, przyciąganie ambitnych kandydatów. Budowanie wewnętrznej kadry ekspertów i przyszłych liderów, co zapewnia stabilność organizacji.",
      },
      "5": {
        description:
          "Rozwój pracowników jest priorytetem strategicznym firmy. Organizacja jest postrzegana jako kuźnia talentów i lider myśli w branży.",
        recommendations: [
          "Tworzenie roli ekspertów i liderów wewnętrznych, którzy dzielą się wiedzą.",
          "Międzynarodowe programy rotacyjne i wymiany.",
          "Sponsoring udziału w prestiżowych konferencjach i programach rozwojowych na skalę światową.",
        ],
        businessImpact:
          "Firma staje się 'fabryką liderów', co zapewnia jej długoterminowy sukces i zdolność do adaptacji. Najwyższy poziom innowacyjności i zaangażowania.",
      },
    },
    "Perspektywy i stabilność organizacji": {
      "1": {
        description:
          "Pracownicy obawiają się o przyszłość firmy i stabilność swojego zatrudnienia. Panuje atmosfera niepewności i strachu, co paraliżuje działanie.",
        recommendations: [
          "Transparentna i natychmiastowa komunikacja zarządu na temat kondycji i planów firmy.",
          "Podkreślanie sukcesów i stabilności finansowej, nawet małych.",
          "Indywidualne rozmowy uspokajające z kluczowymi pracownikami i liderami opinii.",
        ],
        businessImpact:
          "Paraliż decyzyjny, spadek produktywności i masowe odejścia kluczowych pracowników, którzy nie chcą ryzykować. Negatywny wpływ na wizerunek firmy.",
      },
      "2": {
        description:
          "Brak jasnej wizji i strategii rozwoju firmy. Pracownicy nie wiedzą, w jakim kierunku zmierza organizacja, co rodzi niepewność i brak zaufania do zarządu.",
        recommendations: [
          "Opracowanie i szeroka komunikacja długoterminowej strategii firmy.",
          "Regularne spotkania 'town hall' z zarządem, podczas których omawiane są postępy i plany.",
          "Włączenie pracowników w dyskusję o przyszłości firmy poprzez warsztaty strategiczne.",
        ],
        businessImpact:
          "Brak spójności w działaniach, marnowanie zasobów na projekty niezgodne ze strategią. Trudności w motywowaniu pracowników do osiągania długoterminowych celów.",
      },
      "3": {
        description:
          "Firma jest postrzegana jako stabilna, ale jej perspektywy rozwoju są przeciętne. Brakuje dynamiki i innowacyjności, co może być nieatrakcyjne dla ambitnych pracowników.",
        recommendations: [
          "Inwestycje w nowe technologie i obiecujące obszary biznesowe.",
          "Promowanie kultury innowacji i podejmowania skalkulowanego ryzyka.",
          "Działania employer brandingowe podkreślające nowoczesność i dynamikę firmy.",
        ],
        businessImpact:
          "Ryzyko stagnacji i utraty udziału w rynku na rzecz bardziej dynamicznych konkurentów. Trudności w przyciąganiu talentów zorientowanych na innowacje.",
      },
      "4": {
        description:
          "Pracownicy wierzą w stabilność i pozytywne perspektywy rozwoju firmy. Czują się bezpiecznie, są optymistycznie nastawieni i chętnie wiążą swoją przyszłość z organizacją.",
        recommendations: [
          "Utrzymanie transparentnej i regularnej komunikacji o wynikach i planach.",
          "Publiczne dzielenie się sukcesami i świętowanie kamieni milowych.",
          "Angażowanie pracowników w budowanie wizerunku firmy na zewnątrz jako ambasadorów.",
        ],
        businessImpact:
          "Wysoka retencja, niskie koszty rekrutacji i silne zaangażowanie. Pracownicy są bardziej skłonni do inwestowania swojego czasu i energii w rozwój firmy.",
      },
      "5": {
        description:
          "Firma jest postrzegana jako niekwestionowany lider rynku z doskonałymi perspektywami. Pracownicy są dumni, że są jej częścią i aktywnie przyczyniają się do jej sukcesu.",
        recommendations: [
          "Odważna ekspansja na nowe rynki i w nowe segmenty.",
          "Znaczące inwestycje w badania i rozwój (R&D).",
          "Budowanie wizerunku firmy jako innowatora, który wyznacza trendy w całej branży.",
        ],
        businessImpact:
          "Dominująca pozycja na rynku, przyciąganie najlepszych z najlepszych. Zdolność do kształtowania przyszłości branży i osiągania ponadprzeciętnych zysków.",
      },
    },
    "Obciążenie pracą i stres": {
      "1": {
        description:
          "Chroniczne przeciążenie pracą, nierealistyczne terminy i silna presja prowadzą do masowego wypalenia, absencji i wysokiej rotacji. Zdrowie psychiczne pracowników jest zagrożone.",
        recommendations: [
          "Natychmiastowy audyt obciążenia i redystrybucja zadań.",
          "Wprowadzenie polityki 'zero tolerancji' dla mobbingu i nadmiernej presji.",
          "Zapewnienie profesjonalnego i łatwo dostępnego wsparcia psychologicznego.",
        ],
        businessImpact:
          "Wysoka absencja chorobowa, spadek produktywności, wzrost kosztów opieki zdrowotnej i duża rotacja. Ryzyko wypalenia kluczowych specjalistów i kadry zarządzającej.",
      },
      "2": {
        description:
          "Pracownicy często czują się przytłoczeni ilością pracy i stresem. Brakuje im wsparcia ze strony przełożonych w zarządzaniu obciążeniem i priorytetami.",
        recommendations: [
          "Szkolenia dla managerów z zarządzania obciążeniem zespołu.",
          "Ustalanie realistycznych terminów i priorytetów w projektach.",
          "Wprowadzenie regularnych przerw i promowanie higieny pracy cyfrowej.",
        ],
        businessImpact:
          "Obniżone morale i satysfakcja, spadek kreatywności. Wzrost liczby błędów i spadek jakości pracy z powodu zmęczenia i braku koncentracji.",
      },
      "3": {
        description:
          "Poziom stresu i obciążenia jest umiarkowany. Zdarzają się okresy wzmożonej pracy, ale są one przeplatane spokojniejszymi momentami. Brakuje jednak proaktywnych działań antystresowych.",
        recommendations: [
          "Promowanie otwartej komunikacji na temat obciążenia i trudności.",
          "Elastyczne podejście do czasu pracy w okresach wzmożonego wysiłku.",
          "Zapewnienie narzędzi do efektywnej organizacji pracy i zarządzania zadaniami.",
        ],
        businessImpact:
          "Firma funkcjonuje w 'trybie reaktywnym'. Ryzyko eskalacji problemów w okresach wzmożonego nawału pracy. Brak budowania odporności psychicznej w zespołach.",
      },
      "4": {
        description:
          "Obciążenie pracą jest na ogół na akceptowalnym poziomie. Firma dba o zapobieganie nadmiernemu stresowi poprzez dobrą organizację i wsparcie managerów.",
        recommendations: [
          "Ciągłe monitorowanie poziomu stresu w zespołach za pomocą ankiet pulsu.",
          "Promowanie zdrowych nawyków, wellbeingu i aktywności fizycznej.",
          "Docenianie efektywności i jakości pracy, a nie 'siedzenia po godzinach'.",
        ],
        businessImpact:
          "Dobra efektywność, niska absencja i pozytywna atmosfera. Pracownicy są w stanie utrzymać wysoką produktywność w długim okresie.",
      },
      "5": {
        description:
          "Firma aktywnie i strategicznie zarządza obciążeniem pracą i stresem, tworząc zdrowe, zrównoważone i wysoce efektywne środowisko. Wellbeing jest kluczowym elementem strategii biznesowej.",
        recommendations: [
          "Indywidualne programy wsparcia i coachingu dla pracowników.",
          "Kultura organizacyjna oparta na zaufaniu, autonomii i odpowiedzialności za wyniki.",
          "Liderzy jako wzór zdrowego i zrównoważonego podejścia do pracy.",
        ],
        businessImpact:
          "Najwyższy poziom zaangażowania i produktywności. Firma jest postrzegana jako pracodawca dbający o człowieka, co stanowi potężną przewagę konkurencyjną.",
      },
    },
    "Komunikacja i przepływ informacji": {
      "1": {
        description:
          "Chaos informacyjny, brak transparentności i plotki. Pracownicy nie wiedzą, co się dzieje w firmie, co prowadzi do nieufności, dezinformacji i poczucia wykluczenia.",
        recommendations: [
          "Wprowadzenie centralnego, wiarygodnego kanału komunikacji wewnętrznej (np. intranet).",
          "Polityka otwartych drzwi i regularne, szczere sesje Q&A z zarządem.",
          "Szkolenia dla managerów z kaskadowania informacji i efektywnej komunikacji.",
        ],
        businessImpact:
          "Paraliż decyzyjny, duplikacja pracy i marnowanie zasobów. Niskie zaufanie do zarządu i managerów. Wysokie ryzyko kryzysów wizerunkowych.",
      },
      "2": {
        description:
          "Komunikacja jest niespójna, często spóźniona i jednokierunkowa (od góry do dołu). Ważne informacje docierają do pracowników z opóźnieniem lub wcale.",
        recommendations: [
          "Standaryzacja kluczowych procesów komunikacyjnych (np. spotkania, raporty).",
          "Wprowadzenie regularnych newsletterów lub spotkań informacyjnych dla całej firmy.",
          "Usprawnienie i promowanie kanałów komunikacji między działami.",
        ],
        businessImpact:
          "Spowolnienie realizacji projektów z powodu braku informacji. Frustracja pracowników i poczucie bycia pomijanym w ważnych kwestiach.",
      },
      "3": {
        description:
          "Przepływ informacji jest poprawny, ale nieoptymalny. Komunikacja jest głównie formalna i brakuje w niej proaktywnego podejścia oraz zaangażowania pracowników w dialog.",
        recommendations: [
          "Wprowadzenie narzędzi do komunikacji dwustronnej (np. ankiety pulsu, fora dyskusyjne).",
          "Promowanie kultury otwartego feedbacku na wszystkich szczeblach.",
          "Angażowanie pracowników w tworzenie treści do komunikacji wewnętrznej (np. blogi, wywiady).",
        ],
        businessImpact:
          "Firma traci cenne pomysły i feedback od pracowników 'z pierwszej linii'. Utrudnione jest wczesne wykrywanie problemów i ryzyk.",
      },
      "4": {
        description:
          "Komunikacja w firmie jest transparentna, regularna i skuteczna. Pracownicy czują się dobrze poinformowani, rozumieją cele firmy i czują, że ich głos jest słyszany.",
        recommendations: [
          "Wykorzystanie nowoczesnych i angażujących formatów komunikacji (video, podcasty, infografiki).",
          "Segmentacja komunikacji w zależności od grupy docelowej, aby przekaz był bardziej trafny.",
          "Regularne mierzenie efektywności działań komunikacyjnych i ich optymalizacja.",
        ],
        businessImpact:
          "Wysokie zaufanie i spójność w działaniu. Pracownicy rozumieją strategię i swoje miejsce w niej, co przekłada się na lepszą realizację celów biznesowych.",
      },
      "5": {
        description:
          "Otwarta, szczera i wielokierunkowa komunikacja jest filarem kultury organizacyjnej. Informacje przepływają swobodnie, a dialog jest podstawą podejmowania decyzji.",
        recommendations: [
          "Włączenie przedstawicieli pracowników w podejmowanie kluczowych decyzji strategicznych.",
          "Systemy pozwalające na anonimowe zadawanie pytań i zgłaszanie sugestii bezpośrednio do zarządu.",
          "Liderzy jako wzorem i mistrzami otwartej i empatycznej komunikacji.",
        ],
        businessImpact:
          "Niezwykła zwinność organizacyjna i zdolność do szybkiej adaptacji. Kultura ciągłego doskonalenia napędzana przez feedback z całej organizacji. Najwyższy poziom zaufania i zaangażowania.",
      },
    },
    "Autonomia i podejmowanie decyzji": {
      "1": {
        description:
          "Skrajne mikrozarządzanie, brak zaufania i jakiejkolwiek swobody działania. Pracownicy czują się kontrolowani i pozbawieni odpowiedzialności, co zabija kreatywność i inicjatywę.",
        recommendations: [
          "Szkolenia dla managerów z delegowania, zaufania i zarządzania przez cele (MBO).",
          "Stopniowe, ale konsekwentne zwiększanie autonomii i odpowiedzialności pracowników.",
          "Publiczne promowanie i nagradzanie przejawów inicjatywy.",
        ],
        businessImpact:
          "Paraliż operacyjny, bardzo wolne tempo działania i ucieczka talentów. Brak jakiejkolwiek innowacyjności i proaktywności w organizacji.",
      },
      "2": {
        description:
          "Autonomia jest bardzo ograniczona. Pracownicy muszą uzyskiwać zgodę na większość działań, co spowalnia procesy, tworzy 'wąskie gardła' i demotywuje.",
        recommendations: [
          "Przejrzenie i radykalne uproszczenie procesów decyzyjnych i akceptacyjnych.",
          "Zwiększenie uprawnień i budżetów decyzyjnych pracowników na ich stanowiskach.",
          "Promowanie podejmowania inicjatywy i budowanie kultury akceptacji dla skalkulowanych błędów.",
        ],
        businessImpact:
          "Niska efektywność i frustracja pracowników. Firma nie jest w stanie szybko reagować na potrzeby klientów i zmiany na rynku.",
      },
      "3": {
        description:
          "Pracownicy mają pewien stopień autonomii w swoich codziennych zadaniach, ale kluczowe decyzje dotyczące ich pracy są podejmowane centralnie, bez konsultacji.",
        recommendations: [
          "Włączanie pracowników w procesy decyzyjne dotyczące ich pracy i projektów.",
          "Tworzenie zespołów projektowych z jasno zdefiniowanym, ale szerokim polem autonomii.",
          "Eksperymentowanie z nowymi, bardziej zwinnymi formami organizacji pracy.",
        ],
        businessImpact:
          "Niewykorzystany potencjał wiedzy i doświadczenia pracowników. Decyzje podejmowane bez konsultacji z 'pierwszą linią' mogą być nieoptymalne.",
      },
      "4": {
        description:
          "Pracownicy cieszą się dużą autonomią i zaufaniem ze strony przełożonych. Mogą samodzielnie podejmować decyzje w ramach swoich kompetencji, co zwiększa ich zaangażowanie i poczucie odpowiedzialności.",
        recommendations: [
          "Dalsze poszerzanie zakresu autonomii i delegowanie coraz bardziej złożonych decyzji.",
          "Promowanie przedsiębiorczości wewnętrznej (intraprzedsiębiorczość).",
          "Nagradzanie pracowników za odważne, innowacyjne i dobrze uzasadnione decyzje.",
        ],
        businessImpact:
          "Wysokie poczucie własności i odpowiedzialności za wyniki. Szybsze i lepsze decyzje, większa innowacyjność i zaangażowanie pracowników.",
      },
      "5": {
        description:
          "Autonomia i zaufanie są podstawą modelu operacyjnego firmy. Pracownicy mają pełną odpowiedzialność za swoje obszary i działają jak właściciele biznesu.",
        recommendations: [
          "Struktury organizacyjne oparte na samozarządzających się, w pełni autonomicznych zespołach.",
          "Kultura eksperymentowania i uczenia się na błędach.",
          "Minimalizacja hierarchii i biurokracji na rzecz zwinności i swobody działania.",
        ],
        businessImpact:
          "Maksymalna zwinność, innowacyjność i szybkość działania. Firma staje się magnesem dla najlepszych, niezależnych talentów i jest w stanie dynamicznie zdobywać przewagę konkurencyjną.",
      },
    },
  };
}

/**
 * Główna funkcja orkiestrująca, generująca raport krok po kroku.
 */
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

    const KNOWLEDGE_BASE = getKnowledgeBase();

    const analysisData = await getInitialAnalysis(
      surveyData as SurveyRespondent[]
    );

    const departments = analysisData.departments || [];

    const detailedAreasPromises = analysisData.detailed_areas.map(
      (areaData: DetailedAreaData) =>
        generateDetailedAreaContent(areaData, KNOWLEDGE_BASE, departments)
    );
    const resolvedDetailedAreas = await Promise.all(detailedAreasPromises);

    const leaderGuidelines = await generateLeaderGuidelines(
      resolvedDetailedAreas,
      KNOWLEDGE_BASE,
      departments
    );

    const overallContent = await generateOverallContent(
      analysisData.overall_analysis,
      KNOWLEDGE_BASE,
      resolvedDetailedAreas, // Dodajemy szczegółowe wyniki wszystkich obszarów
      departments, // Dodajemy informacje o działach
      surveyData.length // Dodajemy liczbę respondentów
    );

    // Ręcznie łączymy dane zachowując istniejącą strukturę top_scores
    const mergedOverallAnalysis = {
      ...analysisData.overall_analysis,
      engagement: {
        ...analysisData.overall_analysis.engagement,
        ...overallContent.engagement,
        businessImpact: overallContent.engagement.business_impact, // Mapowanie z business_impact na businessImpact
      },
      satisfaction: {
        ...analysisData.overall_analysis.satisfaction,
        ...overallContent.satisfaction,
        businessImpact: overallContent.satisfaction.business_impact, // Mapowanie z business_impact na businessImpact
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

// --- FUNKCJE POMOCNICZE ---

function calculateStatistics(surveyData: SurveyRespondent[]): StatisticsResult {
  // Mapowanie nazw obszarów z angielskiego na polski
  const areaMapping: { [key: string]: string } = {
    compensation_and_benefits: "Wynagrodzenie i benefity",
    work_impact_and_meaning: "Wpływ i znaczenie pracy",
    recognition_and_appreciation: "Uznanie i docenianie",
    technology_and_tools: "Technologia i narzędzia pracy",
    work_environment_and_organizational_culture:
      "Środowisko pracy i kultura organizacyjna",
    work_life_balance: "Równowaga praca-życie",
    professional_development_and_career: "Rozwój zawodowy i kariera",
    prospects_and_stability_of_the_organization:
      "Perspektywy i stabilność organizacji",
    workload_and_stress: "Obciążenie pracą i stres",
    communication_and_information_flow: "Komunikacja i przepływ informacji",
    autonomy_and_decision_making: "Autonomia i podejmowanie decyzji",
  };

  const areaNames = Object.values(areaMapping);

  // Dynamicznie wykrywamy wszystkie działy z danych
  const departments = Array.from(
    new Set(
      surveyData
        .map((respondent) => respondent.details?.department)
        .filter((dept): dept is string => Boolean(dept))
    )
  );

  console.log("🔍 Wykryte działy:", departments);
  console.log("📊 Liczba respondentów:", surveyData.length);

  // Inicjalizacja struktury wyników
  const areaStats: {
    [key: string]: {
      overall: number[];
      departments: { [key: string]: number[] };
    };
  } = {};

  areaNames.forEach((area) => {
    areaStats[area] = { overall: [], departments: {} };
    departments.forEach((dept) => {
      if (areaStats[area]) {
        areaStats[area].departments[dept] = [];
      }
    });
  });

  // Zbieranie danych
  surveyData.forEach((respondent) => {
    const department = respondent.details?.department || "Unknown";

    respondent.scores.forEach((scoreItem: SurveyDataItem) => {
      // Używamy area_id do znalezienia polskiej nazwy obszaru
      const areaId = scoreItem.area_id;
      const polishAreaName = areaMapping[areaId];

      if (!polishAreaName) {
        console.log(`⚠️ Skipping unknown area_id: "${areaId}"`);
        return;
      }

      let score = scoreItem.score;

      // Normalizacja skali 0-10 do 1-5 dla "Perspektywy i stabilność organizacji"
      if (scoreItem.question === "Recommend_Company_0_10") {
        score = (score * 5) / 10;
      }

      if (areaStats[polishAreaName]) {
        areaStats[polishAreaName].overall.push(score);

        // Używamy rzeczywistej nazwy działu z danych (bez mapowania)
        if (
          department !== "Unknown" &&
          areaStats[polishAreaName].departments[department]
        ) {
          areaStats[polishAreaName].departments[department].push(score);
        }
      }
    });
  });

  // Obliczanie średnich
  const results = {
    detailed_areas: [] as DetailedAreaData[],
    areaAverages: {} as { [key: string]: number },
  };

  areaNames.forEach((area) => {
    const overallScores = areaStats[area]?.overall || [];
    const overallAverage =
      overallScores.length > 0
        ? Math.round(
            (overallScores.reduce((a, b) => a + b, 0) / overallScores.length) *
              100
          ) / 100
        : 0;

    // ✅ Skip areas with no data
    if (overallScores.length === 0) {
      console.log(`⚠️ Skipping area with no data: "${area}"`);
      return;
    }

    const teamScores: { [key: string]: number } = {};
    departments.forEach((dept) => {
      const deptScores = areaStats[area]?.departments[dept] || [];
      teamScores[dept] =
        deptScores.length > 0
          ? Math.round(
              (deptScores.reduce((a, b) => a + b, 0) / deptScores.length) * 100
            ) / 100
          : 0;
    });

    results.detailed_areas.push({
      area_name: area,
      overall_average: overallAverage,
      team_scores: teamScores,
    });

    results.areaAverages[area] = overallAverage;
  });

  // Obliczanie engagement i satisfaction - tylko jeśli obszary mają dane
  const recognitionScore = results.areaAverages["Uznanie i docenianie"];
  const impactScore = results.areaAverages["Wpływ i znaczenie pracy"];
  const cultureScore =
    results.areaAverages["Środowisko pracy i kultura organizacyjna"];

  const engagement =
    recognitionScore && impactScore
      ? Math.round(((recognitionScore + impactScore) / 2) * 100) / 100
      : recognitionScore || impactScore || 0;

  const satisfaction = cultureScore || 0;

  // TOP 3 najniższe i najwyższe
  const sortedAreas = Object.entries(results.areaAverages)
    .filter(([, avg]) => avg > 0) // tylko obszary z danymi
    .sort(([, a], [, b]) => (a as number) - (b as number));

  const lowest3 = sortedAreas.slice(0, 3).map(([area, avg]) => ({
    area,
    average: avg,
    range: "1-5",
  }));

  const highest3 = sortedAreas
    .slice(-3)
    .reverse()
    .map(([area, avg]) => ({
      area,
      average: avg,
      range: avg <= 5 ? "1-5" : "0-10",
    }));

  console.log(`📊 Processed areas: ${results.detailed_areas.length}`);
  console.log(
    `📈 Areas with data:`,
    results.detailed_areas.map((a) => a.area_name)
  );

  return {
    engagement,
    satisfaction,
    lowest3,
    highest3,
    detailed_areas: results.detailed_areas,
    departments, // dodajemy listę działów
  };
}

async function makeApiCall(prompt: string): Promise<ApiResponse> {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Debug: loguj surową odpowiedź przed parsowaniem
    const rawResponse = response.text();
    console.log("🔍 Raw API Response:", rawResponse.substring(0, 2000)); // pierwsze 2000 znaków

    // Sprawdź candidates i finishReason
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const finishReason = candidates[0]?.finishReason;
      console.log("📋 Finish reason:", finishReason);

      if (finishReason === "MAX_TOKENS") {
        throw new Error(
          "Odpowiedź API została obcięta z powodu limitu tokenów. Treść jest niekompletna."
        );
      }
      if (
        finishReason === "SAFETY" ||
        finishReason === "RECITATION" ||
        finishReason === "OTHER"
      ) {
        throw new Error(
          `Generowanie zostało zablokowane z powodu: ${finishReason}`
        );
      }
    }

    // Spróbuj wyczyścić odpowiedź z ewentualnych znaczników markdown
    let cleanedResponse = rawResponse.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    }
    if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "");
    }

    console.log("🧹 Cleaned response:", cleanedResponse.substring(0, 1000));

    return JSON.parse(cleanedResponse);
  } catch (e) {
    console.error("❌ Full error details:", e);
    throw new Error(
      `Błąd wywołania API lub parsowania JSON: ${
        e instanceof Error ? e.message : String(e)
      }`
    );
  }
}

async function getInitialAnalysis(
  surveyData: SurveyRespondent[]
): Promise<InitialAnalysisResult> {
  // Obliczamy statystyki algorytmicznie dla precyzji
  const stats = calculateStatistics(surveyData);

  // Zwracamy gotowe dane bez polecania AI na obliczenia
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
    departments: stats.departments, // ✅ Dodajemy departments!
  };
}

async function generateOverallContent(
  overallData: InitialAnalysisResult["overall_analysis"],
  knowledgeBase: KnowledgeBase,
  detailedAreas: DetailedAreaContent[],
  departments: string[],
  respondentCount: number
): Promise<OverallContentResult> {
  const prompt = `
        Jesteś ekspertem konsultantem strategicznym HR z 15-letnim doświadczeniem. Analizujesz badanie satysfakcji pracowników dla firmy z ${respondentCount} respondentami i ${
    departments.length
  } działami.
        
        === KONTEKST BADANIA ===
        Liczba respondentów: ${respondentCount}
        Działy w firmie: ${departments.join(", ")}
        
        === WYNIKI OGÓLNE ===
        ${JSON.stringify(overallData, null, 2)}
        
        === NAJWAŻNIEJSZE WYNIKI ===
        TOP 3 najniższe: ${overallData.top_scores.lowest.data
          .map((item) => `${item.area}: ${item.average}`)
          .join(", ")}
        TOP 3 najwyższe: ${overallData.top_scores.highest.data
          .map((item) => `${item.area}: ${item.average}`)
          .join(", ")}
        
        === BAZA WIEDZY (dla interpretacji poziomów) ===
        Zaangażowanie (Uznanie i docenianie): ${JSON.stringify(
          knowledgeBase["Uznanie i docenianie"],
          null,
          2
        )}
        Satysfakcja (Środowisko pracy): ${JSON.stringify(
          knowledgeBase["Środowisko pracy i kultura organizacyjna"],
          null,
          2
        )}
        
        === TWOJE ZADANIE ===
        Na podstawie WSZYSTKICH danych z badania stwórz wartościową analizę strategiczną. 
        
        1. **ENGAGEMENT (Zaangażowanie):** 
           - Znajdź opis z bazy wiedzy odpowiadający poziomowi zaangażowania
           - Przeanalizuj wyniki z obszarów "Uznanie i docenianie" oraz "Wpływ i znaczenie pracy"
           - Zidentyfikuj 3 kluczowe problemy wpływające na zaangażowanie na podstawie najniższych wyników
           - Wygeneruj konkretny 'business_impact' oparty na rzeczywistych danych
        
        2. **SATISFACTION (Satysfakcja):**
           - Znajdź opis z bazy wiedzy odpowiadający poziomowi satysfakcji  
           - Przeanalizuj wyniki z obszaru "Środowisko pracy i kultura organizacyjna"
           - Zidentyfikuj główne czynniki wpływające na satysfakcję
           - Wygeneruj konkretny 'business_impact' oparty na rzeczywistych danych
        
        3. **TOP SCORES INSIGHT:**
           - Przeanalizuj TOP 3 najniższe i najwyższe obszary
           - Zidentyfikuj WZORCE między działami i obszarami
           - Wygeneruj KONKRETNE, BIZNESOWE wnioski o tym co te wyniki oznaczają dla firmy
           - Zaproponuj 2-3 najważniejsze priorytety strategiczne
        
        **WYMAGANIA JAKOŚCIOWE:**
        - Używaj konkretnych liczb i nazw obszarów z badania
        - Business impact musi być KONKRETNY i MIERZALNY (np. "ryzyko utraty 20% pracowników", "spadek produktywności o 15%")
        - Insights muszą być ACTIONABLE - konkretne działania, nie ogólniki
        - Odwołuj się do konkretnych działów i ich wyników
        
        WAŻNE: Zwróć TYLKO JSON zawierający dodatkowe pola. NIE zmieniaj istniejących struktur.
        
        Zwróć TYLKO JSON o strukturze:
        {
          "engagement": {
            "main_description": "[DOKŁADNY opis z bazy wiedzy]",
            "attitude_points": ["punkt 1", "punkt 2", "punkt 3"],
            "duties_points": ["punkt 1", "punkt 2"],  
            "loyalty_points": ["punkt 1", "punkt 2"],
            "business_impact": "[KONKRETNY wpływ z danymi liczbowymi]"
          },
          "satisfaction": {
            "main_description": "[DOKŁADNY opis z bazy wiedzy]",
            "attitude_points": ["punkt 1", "punkt 2", "punkt 3"],
            "duties_points": ["punkt 1", "punkt 2"],
            "loyalty_points": ["punkt 1", "punkt 2"], 
            "business_impact": "[KONKRETNY wpływ z danymi liczbowymi]"
          },
          "top_scores_insights": {
            "lowest_insight": "[KONKRETNA analiza problemów z nazwami obszarów i działów]",
            "highest_insight": "[KONKRETNA analiza mocnych stron z nazwami obszarów i działów]"  
          }
        }
    `;
  return makeApiCall(prompt) as unknown as Promise<OverallContentResult>;
}

async function generateDetailedAreaContent(
  areaData: DetailedAreaData,
  knowledgeBase: KnowledgeBase,
  departments: string[]
): Promise<DetailedAreaContent> {
  const departmentsList =
    departments && departments.length > 0 ? departments : ["Brak danych"];

  const prompt = `
        Jesteś ekspertem HR piszącym rozdział raportu dla obszaru: "${
          areaData.area_name
        }".
        Na podstawie danych: ${JSON.stringify(
          areaData
        )} i bazy wiedzy: ${JSON.stringify(
    knowledgeBase[areaData.area_name]
  )}, wygeneruj bogatą, merytoryczną treść zgodną ze schematem.
        
        Działy w firmie: ${JSON.stringify(departmentsList)}
        
        Zadania:
        1. Na podstawie 'overall_average', stwórz 'summary_paragraph' i 2-3 'key_findings_points'. Użyj stylu analitycznego.
        2. Wypełnij 'team_breakdown.data' dla KAŻDEGO działu z listy (${departmentsList.join(
          ", "
        )}), tworząc szczegółową 'interpretation_paragraph' na podstawie 'description' z bazy wiedzy i jeśli to moliwe to umieść tam analizę jak czynniki z danego obszaru prezentują się na podstawie description. 2-3 konkretne 'improvement_recommendations' na podstawie 'recommendations' z bazy wiedzy.
        3. Wygeneruj 2-3 bloki rekomendacji w 'organizational_recommendations'.
        4. W 'business_impact.points' umieść tekst z 'businessImpact' z bazy wiedzy.
        
        WAŻNE: W 'team_breakdown.data' stwórz wpis dla każdego działu z listy. Używaj dokładnie nazw działów z listy.
        
        Zwróć TYLKO JSON o strukturze:
        {
            "company_summary": { "title": "Cała firma I zespoły", "overall_average_text": "Średnia ocena ogólna: ${
              areaData.overall_average
            } (skala 1-5)", "sub_areas_breakdown": [], "key_findings_header": "Kluczowe Wnioski", "key_findings_points": [], "summary_header": "Podsumowanie", "summary_paragraph": "" },
            "team_breakdown": { "title": "Omówienie wyników w zespołach", "table_headers": ["Dział", "Wynik", "Interpretacja", "Jak poprawić wynik?"], "data": [] },
            "organizational_recommendations": { "title": "Rekomendacje dla całej organizacji", "recommendation_blocks": [{ "title": "", "points": [] }] },
            "business_impact": { "title": "Jak to wpływa na biznes?", "points": [] }
        }`;
  const content = (await makeApiCall(prompt)) as unknown as DetailedAreaContent;
  return { ...content, area_name: areaData.area_name };
}

async function generateLeaderGuidelines(
  detailedAreas: DetailedAreaContent[],
  knowledgeBase: KnowledgeBase,
  departments: string[]
): Promise<LeaderGuideline[]> {
  const departmentsList =
    departments && departments.length > 0 ? departments : ["Brak danych"];

  const prompt = `
        Jesteś coachem dla managerów. Stwórz praktyczne wskazówki dla liderów ${
          departmentsList.length
        } działów.
        Dane analityczne: ${JSON.stringify(detailedAreas)}
        Baza wiedzy: ${JSON.stringify(knowledgeBase)}
        Działy w firmie: ${JSON.stringify(departmentsList)}
        
        Zadania:
        1. Dla każdego działu z listy przeanalizuj jego wyniki we wszystkich 11 obszarach.
        2. Zidentyfikuj 2 najmocniejsze i 2 najsłabsze obszary dla danego działu.
        3. Na tej podstawie sformułuj konkretne porady w formacie START, STOP, CONTINUE, WELCOME.
        4. 'Start' musi zawierać rekomendacje z bazy wiedzy dla najsłabszych obszarów.
        5. 'Stop' musi opisywać negatywne zachowania wynikające z niskich ocen.
        6. 'Continue' musi opisywać pozytywne praktyki wynikające z wysokich ocen.
        7. 'Welcome' musi zawierać innowacyjne, aspiracyjne pomysły.

        Zwróć TYLKO JSON, który jest tablicą ${
          departmentsList.length
        } obiektów o strukturze:
        [{ "department": "Nazwa działu", "start": [], "stop": [], "continue": [], "welcome": [] }]
        
        UWAGA: Używaj dokładnie nazw działów z listy: ${departmentsList.join(
          ", "
        )}
    `;
  return makeApiCall(prompt) as unknown as Promise<LeaderGuideline[]>;
}
