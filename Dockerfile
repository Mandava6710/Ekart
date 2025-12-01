# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY frontend/src ./src
COPY frontend/public ./public

# Build the React app
RUN npm run build

# Stage 2: Build backend with frontend
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder

WORKDIR /app

# Copy entire project
COPY . .

# Remove old frontend build if exists
RUN rm -rf src/main/resources/static/frontend 2>/dev/null || true

# Copy built frontend to Spring Boot's static files
RUN mkdir -p src/main/resources/static/frontend
COPY --from=frontend-builder /app/frontend/build src/main/resources/static/frontend

# Verify frontend was copied
RUN echo "=== Frontend Files ===" && \
    ls -la src/main/resources/static/frontend/ && \
    echo "=== Frontend Build Complete ===" 

# Build backend with Maven
RUN echo "=== Starting Maven Build ===" && \
    mvn clean package -DskipTests -B && \
    echo "" && \
    echo "=== Build Complete - Checking Target ===" && \
    ls -lah target/Ekart-0.0.1-SNAPSHOT.jar || echo "ERROR: JAR not found!"

# Stage 3: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy JAR from builder
COPY --from=backend-builder /app/target/Ekart-0.0.1-SNAPSHOT.jar app.jar

# Verify JAR exists and is readable
RUN ls -lh app.jar && \
    jar tf app.jar BOOT-INF/lib/ | head -5 && \
    echo "JAR is valid!"

# Expose port
EXPOSE 8080

# Set environment
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

# Run the app
# Railway will use Procfile if it exists, but this is the fallback
CMD ["java", "-Xmx512m", "-Xms256m", "-Dspring.profiles.active=prod", "-jar", "app.jar"]


