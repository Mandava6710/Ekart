# Use Maven 3.9 with Java 21 as base
FROM maven:3.9-eclipse-temurin-21-alpine

WORKDIR /app

# Copy entire project
COPY . .

# Show what we have
RUN echo "=== Project Structure ===" && \
    ls -la && \
    echo "" && \
    echo "=== POM File ===" && \
    head -20 pom.xml

# Build
RUN echo "=== Starting Maven Build ===" && \
    mvn clean package -DskipTests -B 2>&1 | tail -50 && \
    echo "" && \
    echo "=== Build Complete - Checking Target ===" && \
    ls -lah target/ || echo "Target directory not found!" && \
    ls -lah target/*.jar || echo "JAR file not found!"

# If JAR exists, prepare for runtime
RUN if [ -f "target/Ekart-0.0.1-SNAPSHOT.jar" ]; then \
    echo "JAR file verified!"; \
    else \
    echo "ERROR: JAR not found!"; \
    find . -name "*.jar" -type f 2>/dev/null || true; \
    exit 1; \
    fi

# Expose port
EXPOSE 8080

# Set environment and run
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

CMD ["java", "-Xmx512m", "-Xms256m", "-Dserver.port=8080", "-Dspring.profiles.active=prod", "-jar", "target/Ekart-0.0.1-SNAPSHOT.jar"]


