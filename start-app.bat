@echo off
REM Ekart Application - Quick Start Script for Windows
REM This script helps you start both backend and frontend

echo.
echo =========================================
echo Ekart Application - Quick Start
echo =========================================
echo.

REM Check if PostgreSQL is running (optional - user should have it running)
echo [INFO] Starting Ekart Application...
echo.

REM Get the directory where this script is located
cd /d "%~dp0"

echo [Step 1] Checking prerequisites...
echo - Java 21: [Checking...]
java -version 2>&1 | find "21" > nul
if errorlevel 1 (
    echo [ERROR] Java 21 not found. Please install Java 21 and add to PATH.
    pause
    exit /b 1
)
echo - Java 21: [OK]

echo - Node.js: [Checking...]
node --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js and add to PATH.
    pause
    exit /b 1
)
echo - Node.js: [OK]

echo.
echo [Step 2] Starting Backend (Spring Boot)...
echo.
echo Opening new terminal for Backend...
start "Ekart Backend" cmd /k "cd /d "%~dp0" && mvnw spring-boot:run"

timeout /t 5 /nobreak
echo.
echo [INFO] Backend is starting... Please wait for "Tomcat started on port 8080"
echo.

echo [Step 3] Installing Frontend Dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies.
        pause
        exit /b 1
    )
)

echo.
echo [Step 4] Starting Frontend (React)...
echo.
echo Opening new terminal for Frontend...
start "Ekart Frontend" cmd /k "cd /d "%~dp0\frontend" && npm start"

echo.
echo =========================================
echo Application is starting!
echo =========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Please wait for both applications to fully load...
echo.
pause
