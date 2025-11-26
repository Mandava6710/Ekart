# Build stage - Compile the application
FROM maven:3.9-eclipse-temurin-21-alpine as builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:resolve -q -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -q -B && \
    ls -lah target/ && \
    ls -lah target/Ekart-0.0.1-SNAPSHOT.jar

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/Ekart-0.0.1-SNAPSHOT.jar ./app.jar

# Expose port
EXPOSE 8080

# Start the application
ENTRYPOINT ["sh", "-c", "java -Dspring.profiles.active=prod -Xmx512m -Xms256m -Dserver.port=${PORT:-8080} -jar app.jar"]

