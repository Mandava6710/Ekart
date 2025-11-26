# Multi-stage build for Ekart application
# Stage 1: Build backend
FROM maven:3.9.4-openjdk-21 as backend-builder
WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw mvnw.cmd ./
COPY src ./src
RUN mvn clean package -DskipTests -q

# Stage 2: Build frontend
FROM node:18-alpine as frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY frontend ./
RUN npm run build

# Stage 3: Runtime
FROM openjdk:21-jdk-slim
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copy built JAR from backend builder
COPY --from=backend-builder /app/target/Ekart-0.0.1-SNAPSHOT.jar app.jar

# Copy built frontend from frontend builder (if needed)
COPY --from=frontend-builder /frontend/build /frontend/build

# Expose port (Railway sets PORT env variable)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8080}/actuator/health || exit 1

# Set environment
ENV JAVA_OPTS="-Xmx512m -Xms256m -Dserver.port=${PORT:-8080}"

# Run application with port binding
CMD ["java", "-Xmx512m", "-Xms256m", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]
