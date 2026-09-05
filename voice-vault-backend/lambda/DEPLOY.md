# Deploying voice-vault-document-processor as a container image

Run these yourself from `voice-vault-backend/`. The function already exists as a
container image (from the earlier delete+recreate), so this is a rebuild-and-update,
not a recreate. Replace `<...>` placeholders.

## 1. Get a Gemini API key (one-time, if you don't have one yet)

Create one at https://aistudio.google.com/apikey, then add it to your local `.env`
as `GEMINI_API_KEY=...` so local testing can use it too. Never paste the value
anywhere I can see it — this file only tells you the variable name to set.

## 2. Build and push the image

```powershell
cd voice-vault-backend

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 079740174907.dkr.ecr.us-east-1.amazonaws.com

docker build -f lambda/Dockerfile -t voice-vault-document-processor .

docker tag voice-vault-document-processor:latest 079740174907.dkr.ecr.us-east-1.amazonaws.com/voice-vault-document-processor:latest

docker push 079740174907.dkr.ecr.us-east-1.amazonaws.com/voice-vault-document-processor:latest
```

(The Tesseract build stage compiles from source — expect several minutes the first
time; Docker layer caching makes later rebuilds much faster as long as the
Dockerfile's early layers don't change.)

## 3. Point the function at the new image

```powershell
aws lambda update-function-code `
  --function-name voice-vault-document-processor `
  --image-uri 079740174907.dkr.ecr.us-east-1.amazonaws.com/voice-vault-document-processor:latest
```

## 4. Add GEMINI_API_KEY to the function's environment variables

This **replaces** the whole `Variables` map, so include `DATABASE_URL` again too —
don't drop it:

```powershell
aws lambda update-function-configuration `
  --function-name voice-vault-document-processor `
  --environment "Variables={DATABASE_URL=<YOUR_DATABASE_URL>,GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>}"
```

Paste both values directly into your own terminal from your own `.env` — I never see them.

The Lambda's execution role still has `bedrock:InvokeModel` attached from the earlier
setup; that's now unused but harmless, and untouched per "don't change AWS config"
beyond what's explicitly needed here. No IAM changes are required for Gemini — it's
called over plain HTTPS with the API key, not an AWS-permission-gated call.

## 5. Smoke test

Upload a `.txt` file through the app (Upload page, or `POST /notes/upload`), then:

```powershell
aws logs tail /aws/lambda/voice-vault-document-processor --follow
```

and check the note's `status` flips from `PROCESSING` to `READY` (or `FAILED`,
with `processing_error` set — check the CloudWatch output above for the traceback).
