#!/bin/bash

echo "Остановка серверов..."
echo ""

# Поиск и остановка процессов
pkill -f "uvicorn main:app" 2>/dev/null
pkill -f "python.*main.py" 2>/dev/null
pkill -f "vite" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null

echo "Серверы остановлены."






