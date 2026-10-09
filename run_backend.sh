#!/usr/bin/env bash
cd "$(dirname "$0")"
.venv/bin/python backend/manage.py runserver 127.0.0.1:8000
