# Расчёт электроснабжения производственного цеха

Клиент-серверное приложение для автоматизации расчёта электроснабжения производственного цеха по методическим указаниям.

## Технологии

**Backend:**
- Java 17
- Spring Boot 3
- Maven

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios

## Структура проекта

```
light_final_app/
├── backend-java/           # Java backend (Spring Boot)
│   ├── src/main/java/com/electrical/calculation/
│   │   ├── dto/            # Модели запроса/ответа
│   │   ├── tables/         # Справочные таблицы
│   │   ├── service/        # Логика расчётов
│   │   ├── controller/     # REST API и статика
│   │   └── config/
│   ├── pom.xml
│   └── README.md
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── start.bat / start.ps1 / start.sh
└── README.md
```

## Быстрый запуск

### Автоматический запуск (рекомендуется)

**Требования:** Java 17+, Maven, Node.js (для сборки frontend).

**Windows:**
```bash
start.bat
```
или
```bash
powershell -ExecutionPolicy Bypass -File start.ps1
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

Скрипты:
- Проверяют наличие Java, Maven и Node.js
- Устанавливают зависимости frontend и собирают статику (`frontend/dist`)
- Запускают backend (Spring Boot), который раздаёт frontend и API

Приложение: **http://localhost:8000**

## Ручной запуск

### Backend (Java)

1. Соберите frontend (один раз):
```bash
cd frontend
npm install
npm run build
cd ..
```

2. Запустите backend:
```bash
cd backend-java
mvn spring-boot:run
```

Сервер: http://localhost:8000 (приложение и API).

### Только frontend (режим разработки)

```bash
cd frontend
npm install
npm run dev
```

Откройте http://localhost:3000. Backend должен быть запущен на порту 8000.

## Использование

1. Запустите приложение (скрипт или вручную).
2. Откройте http://localhost:8000.
3. Заполните форму и нажмите «Рассчитать».
4. Результаты отображаются во вкладках: Освещение, Розетки, ЭП, Трансформатор, Проводники, Автоматы, КЗ, Заземление.

## Реализованные расчёты

- Освещение (высота, индекс помещения, η, световой поток, число светильников, аварийное освещение)
- Розеточная сеть (мощности, ток, коэффициент спроса)
- Электроприёмники (расчёт по каждому ЭП, суммарные мощности, ток группы)
- Трансформатор (выбор по мощности, категория, R_tr, X_tr)
- Проводники (сечения по току и потере напряжения, питающие кабели)
- Автоматические выключатели (номинал по току)
- Короткие замыкания (две точки: ТП и ЭП, токи КЗ, ударный ток, S_min)
- Заземление (ток замыкания, сопротивление, проверка по ПУЭ)

## API

- **POST /api/calculate** — расчёт по входным данным (JSON), ответ — полный `CalculationResult`.
- **GET /api/health** — проверка работы API (`{"status":"ok"}`).

Формат входных данных и ответа совпадает с описанием в разделе «Справочные таблицы» и формулами методички.

## Разработка

- Новые расчёты: логика в `backend-java/.../service/CalculationService.java`, справочники в `tables/Tables.java`, DTO в `dto/`.
- Frontend: компоненты в `frontend/src/components/`, типы в `types.ts`, API в `api.ts`.

## Лицензия

Проект создан для учебных целей.
