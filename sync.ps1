# CYBEREMPIRE Auto-Sync Script
# Watches for changes and pushes to GitHub every 60 seconds

Write-Host "🚀 Starting Neural Sync... Press Ctrl+C to stop." -ForegroundColor Cyan

while($true) {
    $status = git status --porcelain
    if ($status) {
        Write-Host "📡 Changes detected. Synchronizing Matrix..." -ForegroundColor Yellow
        git add .
        git commit -m "🧠 Matrix Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git push origin main
        Write-Host "✅ Sync Complete. Matrix is up to date." -ForegroundColor Green
    }
    Start-Sleep -Seconds 60
}
