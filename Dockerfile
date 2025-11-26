# Multi-stage build for Ekart application
# Stage 1: Build backend
FROM maven:3.9.4-openjdk-21 as backend-builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Build frontend
FROM node:18-alpine as frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Stage 3: Runtime
FROM openjdk:21-slim
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy built JAR from backend builder
COPY --from=backend-builder /app/target/*.jar app.jar

# Copy built frontend from frontend builder
COPY --from=frontend-builder /frontend/build src/main/resources/static/

# Expose ports
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Set environment
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run application
CMD ["java", "-jar", "app.jar"]
