# PowerShell script to prepare project for Vercel deployment
# Run: .\prepare-deploy.ps1

Write-Host "🚀 Preparing Inklusif Kerja for Vercel deployment..." -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "⚠️  Warning: .env.local not found" -ForegroundColor Yellow
    Write-Host "   Please create .env.local from ENV_EXAMPLE.md" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env.local found" -ForegroundColor Green
}

# Check if node_modules exists
if (-not (Test-Path node_modules)) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Stage all files
Write-Host "📝 Staging files..." -ForegroundColor Yellow
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m "Prepare for Vercel deployment"
    Write-Host "✅ Changes committed" -ForegroundColor Green
} else {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Preparation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a repository on GitHub/GitLab"
Write-Host "2. Run: git remote add origin <your-repo-url>"
Write-Host "3. Run: git push -u origin main"
Write-Host "4. Go to vercel.com and import your repository"
Write-Host "5. Set environment variables in Vercel dashboard"
Write-Host ""
Write-Host "📚 See DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Cyan
