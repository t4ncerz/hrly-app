#!/bin/bash

echo "🚀 Setting up local PostgreSQL database for hrly-app..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# Local Development Environment
NODE_ENV=development

# Local PostgreSQL Database
POSTGRES_LOCAL_URL=postgresql://postgres:password@localhost:5432/hrly_dev

# Keep these for fallback (same as docker-compose.yml)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=hrly_dev
POSTGRES_HOST=localhost
POSTGRES_URL=postgresql://postgres:password@localhost:5432/hrly_dev

# Production database (leave empty for local development)
POSTGRES_SESSION_POOLER_URL=

# Authentication (Clerk) - Replace with your actual keys
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# AI Services - Replace with your actual keys
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Basic Auth
BASIC_AUTH_USERNAME=admin
BASIC_AUTH_PASSWORD=password
EOF
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local already exists"
fi

# Update docker-compose.yml environment
echo "🐳 Starting PostgreSQL container..."
docker-compose up -d db

# Wait for database to be ready
echo "⏳ Waiting for database to start..."
sleep 5

# Check if database is ready
echo "🔍 Checking database connection..."
until docker exec $(docker-compose ps -q db) pg_isready -U postgres > /dev/null 2>&1; do
    echo "⏳ Still waiting for database..."
    sleep 2
done

echo "✅ Database is ready!"

# Run migrations
echo "🔄 Running database migrations..."
npm run db:generate
npm run db:migrate

echo ""
echo "🎉 Local database setup complete!"
echo ""
echo "📋 Database info:"
echo "  Host: localhost:5432"
echo "  Database: hrly_dev"
echo "  User: postgres"
echo "  Password: password"
echo ""
echo "🛠️  Useful commands:"
echo "  npm run db:studio    - Open database viewer"
echo "  npm run db:generate  - Generate new migration"
echo "  npm run db:migrate   - Run migrations"
echo "  npm run dev          - Start development server"
echo ""
echo "⚠️  Don't forget to update .env.local with your actual API keys!" 