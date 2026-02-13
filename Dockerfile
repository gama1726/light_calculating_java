# ========== Stage 1: сборка фронта ==========
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ========== Stage 2: сборка бэкенда (образ с Maven + Java 17) ==========
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY backend-java/pom.xml ./
RUN mvn -B dependency:go-offline -DskipTests
COPY backend-java/ ./
RUN mvn -B package -DskipTests

# ========== Stage 3: итоговый образ ==========
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/electrical-calculation-1.0.0.jar app.jar
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
EXPOSE 8000
ENV APP_STATIC_DIR=/app/frontend/dist
ENTRYPOINT ["java", "-jar", "app.jar"]
