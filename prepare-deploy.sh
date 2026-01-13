#!/bin/bash

# Script to prepare project for Vercel deployment
# Run: bash prepare-deploy.sh

echo "🚀 Preparing Inklusif Kerja for Vercel deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "   Please create .env.local from ENV_EXAMPLE.md"
else
    echo "✅ .env.local found"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Stage all files
echo "📝 Staging files..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "✅ No changes to commit"
else
    echo "💾 Committing changes..."
    git commit -m "Prepare for Vercel deployment"
    echo "✅ Changes committed"
fi

echo ""
echo "✨ Preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a repository on GitHub/GitLab"
echo "2. Run: git remote add origin <your-repo-url>"
echo "3. Run: git push -u origin main"
echo "4. Go to vercel.com and import your repository"
echo "5. Set environment variables in Vercel dashboard"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"
