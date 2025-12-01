# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY frontend/package.json frontend/package-lock.json* ./frontend/

# Install dependencies
WORKDIR /app/frontend
RUN npm install

# Copy frontend source
COPY frontend/src ./src
COPY frontend/public ./public

# Build the React app
RUN npm run build

# Verify build output
RUN echo "=== Frontend Build Output ===" && \
    ls -la /app/frontend/build/ && \
    echo "=== Build Complete ==="

# Stage 2: Build backend with frontend
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder

WORKDIR /app

# Copy entire project
COPY . .

# Copy built frontend to Spring Boot's static files
COPY --from=frontend-builder /app/frontend/build ./src/main/resources/static/frontend

# List what was copied
RUN echo "=== Frontend files copied ===" && \
    ls -la src/main/resources/static/frontend/ && \
    echo "=== Build Complete ==="

# Build backend with Maven
RUN mvn clean package -DskipTests -B -q

# Verify JAR was created
RUN ls -lh target/Ekart-0.0.1-SNAPSHOT.jar

# Stage 3: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy JAR from builder stage
COPY --from=backend-builder /app/target/Ekart-0.0.1-SNAPSHOT.jar ./app.jar

# Verify JAR exists
RUN ls -lh /app/app.jar

# Create app directory structure
RUN mkdir -p /app/logs

# Expose port
EXPOSE 8080

# Environment variables
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Start the application
ENTRYPOINT ["sh", "-c", "java -Xmx512m -Xms256m -Dserver.port=${PORT} -Dspring.profiles.active=prod -jar /app/app.jar"]


