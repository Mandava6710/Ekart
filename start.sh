#!/bin/bash
set -e

echo "=== Ekart Build & Deploy Script ==="
echo "Starting build process..."

# Show environment
echo "Java version:"
java -version

echo "Maven version:"
mvn -version

# Clean and build
echo "Building Maven project..."
mvn clean package -DskipTests -B -V

# Verify JAR exists
if [ ! -f "target/Ekart-0.0.1-SNAPSHOT.jar" ]; then
    echo "ERROR: JAR file not found after build!"
    echo "Contents of target directory:"
    ls -la target/
    exit 1
fi

echo "JAR file created successfully:"
ls -lh target/Ekart-0.0.1-SNAPSHOT.jar

# Start application
echo "Starting application..."
exec java -Dspring.profiles.active=prod \
    -Xmx512m \
    -Xms256m \
    -Dserver.port=${PORT:-8080} \
    -jar target/Ekart-0.0.1-SNAPSHOT.jar
