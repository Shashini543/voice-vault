---
title: Voice Vault Backend
emoji: 🎙️
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 7860
---

# Voice Vault Backend

FastAPI backend for Voice Vault — handles authentication (email/password and
Google Sign-In), note upload/management, and audio metadata/delivery. Served
via Docker on port 7860 for this Space.

Document processing (text extraction, OCR, Gemini study notes/script
generation, and Amazon Polly audio synthesis) runs separately in AWS Lambda,
triggered by S3 uploads — see `lambda/` in this repository. This Space only
runs the API server; it does not run the Lambda pipeline.

## Configuration

All configuration is via environment variables (set as Space secrets, never
committed) — see `.env.example` for the full list required to run this
service, including database, AWS, JWT, Gemini, SES, Google OAuth, and CORS
settings.
