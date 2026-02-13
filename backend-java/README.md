# Backend Java — расчёт электроснабжения цеха

Spring Boot 3, Java 17. API совместим с фронтендом (те же эндпоинты и JSON).

## Сборка и запуск

```bash
# из корня проекта
cd backend-java
./mvnw spring-boot:run
```

Либо из корня проекта (чтобы статика `frontend/dist` подхватывалась):

```bash
cd backend-java
./mvnw spring-boot:run -Dspring-boot.run.arguments="--app.static-dir=../frontend/dist"
```

Приложение: http://localhost:8000  
API: POST /api/calculate, GET /api/health

## Сборка JAR

```bash
./mvnw package -DskipTests
java -jar target/electrical-calculation-1.0.0.jar
```
