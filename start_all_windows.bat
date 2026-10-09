@echo off
cd /d %~dp0
start "Dream Book Shop - Django" cmd /k call "%~dp0run_backend.bat"
start "Dream Book Shop - React" cmd /k call "%~dp0run_frontend.bat"
echo Backend and frontend terminals opened.
echo After Vite starts, open http://localhost:5173
pause
