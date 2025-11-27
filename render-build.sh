#!/bin/sh
# Build script for Render.com deployment

echo "🔧 Installing dependencies..."
npm ci --legacy-peer-deps

echo "🗄️ Generating Prisma Client..."
npx prisma generate

echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
