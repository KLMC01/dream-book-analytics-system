@echo off
cd /d %~dp0
.venv\Scripts\python backend\manage.py runserver 127.0.0.1:8000
