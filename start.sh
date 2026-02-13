#!/bin/bash

echo "========================================"
echo "Запуск приложения расчёта электроснабжения"
echo "========================================"
echo ""

# Проверка Java
if ! command -v java &> /dev/null; then
    echo "[ОШИБКА] Java не установлена"
    exit 1
fi

# Проверка Maven
if ! command -v mvn &> /dev/null; then
    echo "[ОШИБКА] Maven не установлен"
    exit 1
fi

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "[ОШИБКА] Node.js не установлен"
    exit 1
fi

echo "[1/3] Проверка зависимостей frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Установка зависимостей frontend..."
    npm install
else
    echo "Зависимости frontend проверены"
fi

echo ""
echo "[2/3] Сборка frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "[ОШИБКА] Ошибка при сборке frontend"
    cd ..
    exit 1
fi
echo "Frontend собран успешно"

cd ..

echo "[3/3] Запуск backend (Java)..."
cd backend-java
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

echo "Ожидание запуска сервера (5 секунд)..."
sleep 5

echo ""
echo "========================================"
echo "Приложение запущено!"
echo "========================================"
echo "Приложение: http://localhost:8000"
echo ""
echo "PID процесса: $BACKEND_PID"
echo "Для остановки нажмите Ctrl+C"
echo ""

trap "echo 'Остановка сервера...'; kill $BACKEND_PID 2>/dev/null; exit" INT TERM
wait
