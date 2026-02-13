@echo off
chcp 65001 >nul
echo ========================================
echo Запуск приложения расчёта электроснабжения
echo ========================================
echo.

REM Проверка Java
java -version >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Java не установлена или не найдена в PATH
    pause
    exit /b 1
)

REM Проверка Maven
call mvn -version >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Maven не установлен или не найден в PATH
    pause
    exit /b 1
)

REM Проверка Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Node.js не установлен или не найден в PATH
    pause
    exit /b 1
)

echo [1/3] Проверка зависимостей frontend...
cd frontend
if not exist "node_modules" (
    echo Установка зависимостей frontend...
    call npm install
) else (
    echo Зависимости frontend проверены
)

echo [2/3] Сборка frontend...
call npm run build
if errorlevel 1 (
    echo [ОШИБКА] Ошибка сборки frontend
    cd ..
    pause
    exit /b 1
)
cd ..

echo [3/3] Запуск backend (Java)...
start "Backend Server" cmd /k "cd /d %~dp0backend-java && mvn spring-boot:run"

echo Ожидание запуска сервера (5 секунд)...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Приложение запущено!
echo ========================================
echo Приложение: http://localhost:8000
echo.
echo Для остановки закройте окно сервера.
echo.
pause
