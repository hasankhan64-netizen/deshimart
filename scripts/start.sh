#!/bin/bash
set -e
echo "🚀 Starting Marketplace..."
cd "$(dirname "$0")/.."
docker compose up -d mysql redis mongo elasticsearch rabbitmq
sleep 10
until docker exec marketplace-mysql mysqladmin ping -h localhost --silent 2>/dev/null; do echo "Waiting MySQL..."; sleep 2; done
until curl -s http://localhost:9200 >/dev/null; do echo "Waiting ES..."; sleep 2; done
echo "✅ Infrastructure ready!"
echo "Start backend: cd backend && npm run start:dev"
echo "Start frontend: cd frontend && npm run dev"
