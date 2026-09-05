# Dockerfile for deploying the Voice Vault FastAPI backend to Hugging Face
# Spaces (Docker SDK). Build context is voice-vault-backend/ itself.
#
# This is separate from lambda/Dockerfile, which builds the unrelated
# document-processing Lambda container image and is untouched by this file.

FROM python:3.13-slim

# System dependencies:
# - tesseract-ocr / tesseract-ocr-eng: OCR support
# - poppler-utils: PDF processing utilities
# - libjpeg62-turbo / zlib1g / libpng16-16 / libtiff6 / libwebp7: image format
#   libraries used by Pillow/image processing
# Debian's apt has tesseract-ocr as a plain installable package, so (unlike
# the Lambda's Amazon Linux 2023 base) nothing needs to be compiled from
# source here.
RUN apt-get update && apt-get install -y --no-install-recommends \
        tesseract-ocr \
        tesseract-ocr-eng \
        poppler-utils \
        libjpeg62-turbo \
        zlib1g \
        libpng16-16 \
        libtiff6 \
        libwebp7 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 7860

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
