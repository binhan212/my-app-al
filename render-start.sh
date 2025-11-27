#!/bin/sh
# Start script for Render.com deployment

echo "🗄️ Running database migrations..."
npx prisma db push --accept-data-loss

echo "🚀 Starting Next.js application..."
npm start
