@echo off
REM Start Backend in a separate command window
start "Ekart Backend" cmd /c "cd /d c:\Users\GANESH\Downloads\Ekart\Ekart && mvnw spring-boot:run"

REM Wait 5 seconds for backend to initialize
timeout /t 5 /nobreak

REM Start Frontend in a separate command window
start "Ekart Frontend" cmd /c "cd /d c:\Users\GANESH\Downloads\Ekart\Ekart\frontend && npm start"

echo.
echo =========================================
echo Both applications are starting!
echo =========================================
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo =========================================
echo.
pause
