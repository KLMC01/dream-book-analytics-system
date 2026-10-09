#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r backend/requirements.txt
(cd frontend && npm install)
.venv/bin/python backend/manage.py migrate
echo "Setup complete. Run ./run_backend.sh and ./run_frontend.sh in separate terminals."
