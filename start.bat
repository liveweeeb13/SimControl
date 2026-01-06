@echo off

echo Starting SimControl...

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

:: Check if pip is available
python -m pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo pip is not available.
    echo Please reinstall Python with pip included.
    pause
    exit /b 1
)

echo Installing requirements...
python -m pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo Failed to install requirements.
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

cls

echo Starting SimControl server...

python ./app.py

pause