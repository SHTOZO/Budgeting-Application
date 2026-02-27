#!/bin/bash
# Quick start script - run from project root

echo "=== Budgeting App Setup ==="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please download from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing root dependencies..."
npm install

echo ""
echo "📦 Installing server dependencies..."
cd server && npm install && cd ..

echo ""
echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Copy server/.env.example to server/.env"
echo "2. Update server/.env with your MongoDB URI and JWT Secret"
echo "3. Run: npm run dev"
echo ""
echo "The app will be available at http://localhost:3000"
