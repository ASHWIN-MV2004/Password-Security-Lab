@echo off
echo ==========================================
echo Starting Password Security Lab Web App
echo ==========================================
echo.

:: Start Backend
echo Starting Flask backend on port 5000...
cd backend
start "Backend Server" cmd /k "venv\Scripts\python api.py"
cd ..

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Start Frontend
echo Starting React frontend on port 3000...
cd frontend
start "Frontend Server" cmd /k "npm start"
cd ..

echo.
echo ==========================================
echo [V] Servers started in new windows!
echo ==========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close the new windows to stop the servers.
echo.
pause
