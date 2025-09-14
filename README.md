# HRLY App

HR Analytics aplikacja zbudowana w Next.js z TypeScript, PostgreSQL i Drizzle ORM.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker i Docker Compose
- Git

### 1. Konfiguracja lokalnej bazy danych

```bash
# Uruchom automatyczny setup lokalnej bazy danych
npm run db:setup
```

Ten skrypt:

- Sprawdzi czy Docker jest uruchomiony
- Utworzy plik `.env.local` z konfiguracją lokalnej bazy
- Uruchomi kontener PostgreSQL
- Wygeneruje i uruchomi migracje bazy danych

### 2. Konfiguracja zmiennych środowiskowych

Po uruchomieniu `npm run db:setup`, edytuj plik `.env.local` i uzupełnij prawdziwe klucze API:

```env
# Authentication (Clerk)
CLERK_SECRET_KEY=twój_prawdziwy_klucz_clerk
CLERK_WEBHOOK_SECRET=twój_prawdziwy_webhook_secret

# AI Services
OPENAI_API_KEY=twój_prawdziwy_klucz_openai
GEMINI_API_KEY=twój_prawdziwy_klucz_gemini
```

### 3. Uruchom aplikację

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

## 📊 Zarządzanie bazą danych

### Podstawowe komendy

```bash
# Uruchom setup lokalnej bazy (pierwszy raz)
npm run db:setup

# Uruchom/zatrzymaj bazę danych
npm run db:start
npm run db:stop

# Otwórz interfejs bazy danych w przeglądarce
npm run db:studio

# Generuj nową migrację po zmianach w schema
npm run db:generate

# Uruchom migracje
npm run db:migrate

# Resetuj bazę danych (usuwa wszystkie dane!)
npm run db:reset
```

### Konfiguracja środowiska

Aplikacja automatycznie przełącza się między bazami danych:

- **Development** (`NODE_ENV=development`): Używa lokalnej bazy PostgreSQL (`POSTGRES_LOCAL_URL`)
- **Production**: Używa produkcyjnej bazy (`POSTGRES_SESSION_POOLER_URL`)

### Informacje o lokalnej bazie

- **Host**: localhost:5432
- **Database**: hrly_dev
- **User**: postgres
- **Password**: password

## 🏗️ Architektura

- **Frontend**: Next.js 15 z App Router
- **Database**: PostgreSQL z Drizzle ORM
- **Authentication**: Clerk
- **AI**: OpenAI + Google Gemini
- **Styling**: Tailwind CSS
- **Containerization**: Docker

## 📁 Struktura projektu

```
src/
├── app/                 # Next.js App Router
├── components/          # React komponenty
├── drizzle/            # Database schema i migracje
│   ├── schema/         # Definicje tabel
│   ├── migrations/     # Migracje bazy
│   └── db.ts          # Konfiguracja połączenia
├── features/           # Logika biznesowa
└── services/           # Zewnętrzne serwisy
```

## 🔧 Development

```bash
# Zainstaluj zależności
npm install

# Uruchom w trybie deweloperskim
npm run dev

# Zbuduj dla produkcji
npm run build

# Uruchom serwer produkcyjny
npm start
```

## 📝 Dodatkowe informacje

- Konfiguracja TypeScript: `tsconfig.json`
- Konfiguracja ESLint: `eslint.config.mjs`
- Database schema: `src/drizzle/schema/`
- Environment variables: `.env.local` (development), `.env` (production)

## 🚨 Ważne uwagi

1. **Nigdy nie commituj** `.env.local` do repozytorium
2. **Backup bazy danych** przed uruchomieniem `npm run db:reset`
3. **Aktualizuj API keys** w `.env.local` po pierwszym setupie
