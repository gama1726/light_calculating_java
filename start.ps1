# PowerShell скрипт для запуска приложения
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Запуск приложения расчёта электроснабжения" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка Java
try {
    $javaVersion = java -version 2>&1
    Write-Host "[OK] Java найдена" -ForegroundColor Green
} catch {
    Write-Host "[ОШИБКА] Java не установлена или не найдена в PATH" -ForegroundColor Red
    exit 1
}

# Проверка Maven
try {
    $mvnVersion = mvn -version 2>&1
    Write-Host "[OK] Maven найден" -ForegroundColor Green
} catch {
    Write-Host "[ОШИБКА] Maven не установлен или не найден в PATH" -ForegroundColor Red
    exit 1
}

# Проверка Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "[OK] Node.js найден: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ОШИБКА] Node.js не установлен или не найден в PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[1/3] Проверка зависимостей frontend..." -ForegroundColor Yellow
Set-Location frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "Установка зависимостей frontend..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "Зависимости frontend проверены" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/3] Сборка frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ОШИБКА] Ошибка при сборке frontend" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "Frontend собран успешно" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "[3/3] Запуск backend (Java)..." -ForegroundColor Yellow
$backendScript = @"
cd `"$PWD\backend-java`"
mvn spring-boot:run
"@
$backendScript | Out-File -FilePath "$env:TEMP\start_backend_java.bat" -Encoding ASCII
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "$env:TEMP\start_backend_java.bat" -PassThru -WindowStyle Normal

Write-Host "Ожидание запуска сервера (5 секунд)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Приложение запущено!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Приложение: http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Для остановки закройте окно сервера." -ForegroundColor Yellow
Write-Host ""

$openBrowser = Read-Host "Открыть браузер? (y/n)"
if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
    Start-Process "http://localhost:8000"
}

Write-Host "Нажмите любую клавишу для выхода..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
