Write-Output "Installing Capacitor core and Android..."
npm install @capacitor/core @capacitor/android
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output "Installing Capacitor CLI..."
npm install -D @capacitor/cli
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output "Building Next.js project..."
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output "Initializing Capacitor..."
npx cap init "Cycle Planner" "com.tham.cycleplanner" --web-dir out
# Ignoring exit code for init as it might complain if already initialized

Write-Output "Adding Android platform..."
npx cap add android

Write-Output "Syncing Capacitor..."
npx cap sync
