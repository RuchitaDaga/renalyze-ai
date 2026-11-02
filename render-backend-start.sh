#!/usr/bin/env bash
# Start command for deploying the backend (e.g. on Render). Run from the repo root.
uvicorn backend.main:app --host 0.0.0.0 --port "${PORT:-8000}"
