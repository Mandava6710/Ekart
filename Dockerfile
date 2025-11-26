# Multi-stage build for Ekart application - Optimized for Railway
# Stage 1: Build backend with Maven
FROM maven:3.9-eclipse-temurin-21-alpine as backend-builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -q -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built JAR from backend builder
COPY --from=backend-builder /build/target/Ekart-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run application - Railway provides PORT environment variable
CMD ["java", "-Xmx512m", "-Xms256m", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]
