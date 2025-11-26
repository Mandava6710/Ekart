# Ekart Deployment Guide

## Quick Start Deployment Options

### 1. **Docker Compose (Recommended for Production)**

#### Prerequisites
- Docker & Docker Compose installed
- 2GB RAM minimum
- Port 80, 443 available

#### Steps
```bash
# Clone the repository
git clone https://github.com/Mandava6710/Ekart.git
cd Ekart

# Create environment file
cat > .env << EOF
DB_USER=ekart_user
DB_PASSWORD=secure_password_here
DB_NAME=ekart_db
SHOW_SQL=false
EOF

# Build and start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

#### Access Application
- Frontend: http://localhost
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

---

### 2. **Linux Server Deployment (Using deploy.sh)**

#### Prerequisites
- Ubuntu 20.04+ or CentOS 8+
- Java 21 installed
- Maven 3.9+
- Node.js 18+
- Git installed
- Sudo access

#### Steps
```bash
# SSH into your server
ssh ubuntu@your-server-ip

# Clone the repository
git clone https://github.com/Mandava6710/Ekart.git
cd Ekart

# Make deploy script executable
chmod +x deploy.sh

# Run deployment (requires sudo)
sudo ./deploy.sh
```

#### Verify Deployment
```bash
# Check service status
systemctl status ekart

# View logs
journalctl -u ekart -f

# Check if application is running
curl http://localhost:8080/actuator/health
```

---

### 3. **AWS EC2 Manual Deployment**

#### EC2 Instance Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 21
sudo apt install -y openjdk-21-jdk maven

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Create application user
sudo useradd -m ekart
```

#### Deploy Application
```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/Mandava6710/Ekart.git
sudo chown -R ekart:ekart /var/www/ekart

# Build and deploy
cd Ekart
sudo ./deploy.sh
```

---

### 4. **Heroku Deployment**

#### Prerequisites
- Heroku CLI installed
- Free Heroku account

#### Steps
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-ekart-app

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Configure database
heroku config:set SPRING_JPA_HIBERNATE_DDL_AUTO=update

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Access Application
```
https://your-ekart-app.herokuapp.com
```

---

### 5. **DigitalOcean Deployment**

#### Droplet Setup ($5/month)
```bash
# SSH into droplet
ssh root@your-droplet-ip

# Run initial setup
apt update && apt upgrade -y
apt install -y openjdk-21-jdk maven nodejs npm git nginx

# Create app directory
mkdir -p /var/www/ekart
cd /var/www/ekart

# Clone and deploy
git clone https://github.com/Mandava6710/Ekart.git .
chmod +x deploy.sh
./deploy.sh

# Setup Nginx reverse proxy
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

### 6. **GitHub Actions CI/CD Pipeline**

#### Setup
1. Go to GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:
   - `SERVER_HOST`: Your server IP
   - `SERVER_USER`: SSH username
   - `SERVER_SSH_KEY`: SSH private key content

#### Auto-Deployment on Push
```bash
# Just push to main branch
git push origin main

# GitHub Actions will automatically:
# 1. Build backend (Maven)
# 2. Build frontend (Node.js)
# 3. Deploy to your server
# 4. Restart the application
```

---

## Environment Variables

### Backend Configuration
```properties
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ekart_db
SPRING_DATASOURCE_USERNAME=ekart_user
SPRING_DATASOURCE_PASSWORD=password

# Server
SERVER_PORT=8080
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Configuration
```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_API_TIMEOUT=30000
```

---

## Production Checklist

- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Setup database backups
- [ ] Monitor application logs
- [ ] Setup health checks
- [ ] Enable auto-restart on failure
- [ ] Setup rate limiting
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Setup monitoring (e.g., Prometheus)
- [ ] Configure log rotation

---

## Troubleshooting

### Application won't start
```bash
# Check logs
journalctl -u ekart -n 50

# Check if port is in use
lsof -i :8080

# Restart service
sudo systemctl restart ekart
```

### Database connection errors
```bash
# Test database connection
psql -h localhost -U ekart_user -d ekart_db

# Check environment variables
systemctl show-environment | grep SPRING
```

### High memory usage
```bash
# Adjust JVM heap size in systemd service
# Edit: /etc/systemd/system/ekart.service
# Change: Environment="JAVA_OPTS=-Xmx1g -Xms512m"
# Restart: sudo systemctl restart ekart
```

---

## Monitoring & Logs

### View Systemd Logs
```bash
# Last 50 lines
sudo journalctl -u ekart -n 50

# Follow logs in real-time
sudo journalctl -u ekart -f

# Last hour
sudo journalctl -u ekart --since "1 hour ago"
```

### Docker Logs
```bash
# Backend logs
docker-compose logs -f backend

# Database logs
docker-compose logs -f postgres

# All logs
docker-compose logs -f
```

---

## Backup & Recovery

### Backup Database
```bash
# PostgreSQL backup
pg_dump -h localhost -U ekart_user ekart_db > backup_$(date +%Y%m%d).sql

# Docker backup
docker-compose exec postgres pg_dump -U ekart_user ekart_db > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
psql -h localhost -U ekart_user ekart_db < backup_20231126.sql
```

---

## Support & Issues

For issues and support:
- GitHub Issues: https://github.com/Mandava6710/Ekart/issues
- Email: your-email@example.com

---

**Last Updated:** November 26, 2025
**Version:** 1.0.0
