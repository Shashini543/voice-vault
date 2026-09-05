# 🎙️ Voice Vault

> AI-powered study notes-to-audio platform that transforms lecture materials into structured study notes, conversational study scripts, and audio for easier learning.

## 📌 Overview

Voice Vault is an AI-powered learning platform designed to help university students convert their study materials into easy-to-understand and listenable content.

Students can upload lecture notes in **PDF, image, or text format**. Voice Vault extracts the content, processes it using AI, generates structured study notes and a conversational study script, and converts the script into audio using **Amazon Polly**.

The platform allows students to review their AI-generated study notes, read the conversational script, and listen to or download the generated audio.

---

## ✨ Key Features

### 📄 Multi-format Note Upload
- Upload PDF, image, or text-based study materials.
- Supports digital PDFs and scanned documents.
- Image and scanned PDF content can be processed using OCR.

### 🤖 AI Study Notes
- Converts extracted content into structured, student-friendly study notes.
- Preserves important concepts, definitions, explanations, examples, and relationships.
- Simplifies difficult concepts while maintaining the original meaning.

### 🗣️ AI Study Script
- Converts study notes into a natural conversational script.
- Designed to sound like an educational discussion rather than a textbook.
- Maintains logical flow and important information from the study notes.

### 🔊 AI Audio Generation
- Converts the AI-generated script into speech using Amazon Polly.
- Supports long scripts through automatic text chunking.
- Generated audio is stored securely in Amazon S3.
- Students can play or download the generated audio.

### 🔐 Authentication & Security
- User registration and login.
- Secure password hashing.
- JWT-based authentication.
- Google Sign-In using OAuth 2.0.
- Protected user-specific resources.



---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      Student         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Next.js Frontend   │
                    │   React + TypeScript  │
                    └──────────┬───────────┘
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │    FastAPI Backend   │
                    │      Python          │
                    └──────┬───────┬───────┘
                           │       │
              ┌────────────┘       └─────────────┐
              ▼                                  ▼
     ┌──────────────────┐              ┌──────────────────┐
     │ Neon PostgreSQL  │              │    Amazon S3     │
     │                  │              │                  │
     │ Users            │              │ Uploaded Notes   │
     │ Notes            │              │ Generated Audio  │
     │ Audio            │              │                  │
     └──────────────────┘              └────────┬─────────┘
                                                │
                                                ▼
                                      ┌──────────────────┐
                                      │   AWS Lambda     │
                                      │ Document Process │
                                      └────────┬─────────┘
                                               │
                                  ┌────────────┼────────────┐
                                  ▼            ▼            ▼
                            ┌──────────┐ ┌──────────┐ ┌──────────┐
                            │  OCR     │ │ Gemini   │ │  Polly   │
                            │Tesseract │ │   AI     │ │  Speech  │
                            └──────────┘ └──────────┘ └──────────┘
