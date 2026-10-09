@echo off
setlocal
cd /d %~dp0

echo [1/4] Creating Python virtual environment...
python -m venv .venv
if errorlevel 1 goto :error

echo [2/4] Installing Django backend packages...
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\python -m pip install -r backend\requirements.txt
if errorlevel 1 goto :error

echo [3/4] Installing React frontend packages...
cd frontend
call npm install
if errorlevel 1 goto :error
cd ..

echo [4/4] Preparing Django...
.venv\Scripts\python backend\manage.py migrate
if errorlevel 1 goto :error

echo.
echo Setup complete. Open TWO terminals and run:
echo   run_backend.bat
echo   run_frontend.bat
pause
exit /b 0

:error
echo.
echo Setup failed. Read README.md and check that Python and Node.js are installed.
pause
exit /b 1
