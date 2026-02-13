# Сборка и запуск в Docker (фронт + бэкенд)

## Локально

Из корня проекта (где лежат `backend-java` и `frontend`):

```bash
docker build -t electrical-calculation .
docker run -p 8000:8000 electrical-calculation
```

Откройте http://localhost:8000 — SPA и API на порту 8000.

## Amvera Cloud

1. Репозиторий должен содержать в корне: `Dockerfile`, `amvera.yml`, папки `backend-java` и `frontend`.
2. В Amvera Cloud выберите тип сборки **Docker** (или укажите `environment: docker` в `amvera.yml`).
3. Порт контейнера: **8000** (указан в `amvera.yml` и в `Dockerfile` через `EXPOSE 8000`).
4. Деплой: `git push amvera master` (или через веб-интерфейс Amvera).

Переменная окружения `APP_STATIC_DIR=/app/frontend/dist` задаётся в образе; при необходимости её можно переопределить в настройках приложения в Amvera.
