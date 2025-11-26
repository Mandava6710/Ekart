#!/bin/sh
# Railway entrypoint script

# Set default port if not provided
PORT=${PORT:-8080}

echo "Starting Ekart application..."
echo "Port: $PORT"
echo "Profile: prod"
echo ""

# Run Java with proper port configuration
exec java \
  -Xmx512m \
  -Xms256m \
  -Dserver.port=$PORT \
  -Dspring.profiles.active=prod \
  -jar /app/target/Ekart-0.0.1-SNAPSHOT.jar
