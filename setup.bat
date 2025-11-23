@echo off
echo ==========================================
echo Password Security Lab - Windows Setup
echo ==========================================
echo.

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Python is not installed or not in PATH.
    echo Please install Python 3.7+ from python.org
    pause
    exit /b 1
)
echo [V] Python found

:: Check for Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js is not installed or not in PATH.
    echo Please install Node.js 14+ from nodejs.org
    pause
    exit /b 1
)
echo [V] Node.js found
echo.

:: Backend Setup
echo ==========================================
echo Setting up Backend...
echo ==========================================
cd backend

if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
    echo [V] Virtual environment created
) else (
    echo [!] Virtual environment already exists
)

echo Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -q --upgrade pip
pip install -q -r requirements.txt
if %errorlevel% neq 0 (
    echo [X] Failed to install Python dependencies
    pause
    exit /b 1
)
echo [V] Python dependencies installed
call deactivate
cd ..
echo.

:: Frontend Setup
echo ==========================================
echo Setting up Frontend...
echo ==========================================
cd frontend
echo Installing Node.js dependencies...
echo (This may take a few minutes...)
call npm install --silent
if %errorlevel% neq 0 (
    echo [X] Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo [V] Node.js dependencies installed
cd ..
echo.

echo ==========================================
echo [V] Setup Complete!
echo ==========================================
echo.
echo To start the application, run: run.bat
echo.
pause
