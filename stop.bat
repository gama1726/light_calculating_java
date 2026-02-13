@echo off
echo Остановка серверов...
echo.

REM Остановка процессов Python (backend)
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM uvicorn.exe /T 2>nul

REM Остановка процессов Node.js (frontend)
taskkill /F /IM node.exe /T 2>nul

echo Серверы остановлены.
pause






