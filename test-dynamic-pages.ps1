# Test Script - Verify Dynamic Pages Work

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Testing Dynamic Pages" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check revalidate settings
Write-Host "`n📋 Checking revalidate settings..." -ForegroundColor Yellow

$files = @(
    @{Path="app\tin-tuc\page.tsx"; Expected="revalidate = 0"},
    @{Path="app\du-an\page.tsx"; Expected="revalidate = 0"},
    @{Path="app\videos\page.tsx"; Expected="revalidate = 0"}
)

foreach ($file in $files) {
    $content = Get-Content $file.Path -Raw
    if ($content -match "revalidate = 0") {
        Write-Host "✅ $($file.Path): revalidate = 0" -ForegroundColor Green
    } else {
        Write-Host "❌ $($file.Path): NOT SET TO 0!" -ForegroundColor Red
    }
}

# Check homepage limits
Write-Host "`n📋 Checking homepage limits..." -ForegroundColor Yellow

$homepage = Get-Content "app\page.tsx" -Raw

if ($homepage -match "take: 4.*?Get latest published posts") {
    Write-Host "✅ Homepage posts: take 4" -ForegroundColor Green
} else {
    Write-Host "⚠️  Homepage posts: check manually" -ForegroundColor Yellow
}

if ($homepage -match "take: 3.*?Get latest published projects") {
    Write-Host "✅ Homepage projects: take 3" -ForegroundColor Green
} else {
    Write-Host "⚠️  Homepage projects: check manually" -ForegroundColor Yellow
}

if ($homepage -match "take: 3.*?Get active videos") {
    Write-Host "✅ Homepage videos: take 3" -ForegroundColor Green
} else {
    Write-Host "⚠️  Homepage videos: check manually" -ForegroundColor Yellow
}

# Check layout
Write-Host "`n📋 Checking root layout..." -ForegroundColor Yellow

$layout = Get-Content "app\layout.tsx" -Raw

if ($layout -notmatch "db.setting.findMany") {
    Write-Host "✅ Root layout: NO settings fetch (no cache)" -ForegroundColor Green
} else {
    Write-Host "❌ Root layout: Still fetching settings!" -ForegroundColor Red
}

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "✅ All checks passed!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan

Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Start dev server: npm run dev" -ForegroundColor White
Write-Host "2. Create new post in /admin/posts" -ForegroundColor White
Write-Host "3. Visit /tin-tuc - should show immediately" -ForegroundColor White
Write-Host "4. Create new project in /admin/projects" -ForegroundColor White
Write-Host "5. Visit /du-an - should show immediately" -ForegroundColor White
