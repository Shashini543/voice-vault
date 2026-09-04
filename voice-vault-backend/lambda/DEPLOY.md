# Deploying voice-vault-document-processor as a container image

Run these yourself from `voice-vault-backend/` (build context matters — the Dockerfile
`COPY`s `app/` from one level above `lambda/`). Replace `<...>` placeholders. Nothing
here touches your `.env` values except reading `DATABASE_URL` to set as a Lambda
env var — do that from your own terminal so it never appears in any log I can see.

## 0. Capture what the existing function has, before deleting it

Package type is fixed at creation, so getting to a container image means delete +
recreate with the same name. Grab the execution role ARN first — you'll need it to
recreate the function with the same permissions (S3 read / CloudWatch / Bedrock):

```powershell
aws lambda get-function --function-name voice-vault-document-processor `
  --query "Configuration.Role" --output text
```

Save that ARN. Also note the account id and region you're already using:
`079740174907`, `us-east-1` (from your S3 bucket name).

## 1. Create an ECR repository (one-time)

```powershell
aws ecr create-repository --repository-name voice-vault-document-processor --region us-east-1
```

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

## 3. Delete and recreate the function

```powershell
aws lambda delete-function --function-name voice-vault-document-processor

aws lambda create-function `
  --function-name voice-vault-document-processor `
  --package-type Image `
  --code ImageUri=079740174907.dkr.ecr.us-east-1.amazonaws.com/voice-vault-document-processor:latest `
  --role <EXECUTION_ROLE_ARN_FROM_STEP_0> `
  --timeout 300 `
  --memory-size 1536 `
  --environment "Variables={DATABASE_URL=<YOUR_DATABASE_URL>}"
```

Use the exact `DATABASE_URL` value from your `.env` — pasted directly into your own
terminal, not shared with me.

## 4. Re-grant S3 permission to invoke the function

This does **not** survive delete+recreate and must be redone or every S3 trigger
will fail with AccessDenied:

```powershell
aws lambda add-permission `
  --function-name voice-vault-document-processor `
  --statement-id s3-invoke `
  --action lambda:InvokeFunction `
  --principal s3.amazonaws.com `
  --source-arn arn:aws:s3:::voice-vault-shashini-2026-079740174907-us-east-1-an `
  --source-account 079740174907
```

## 5. Re-check the S3 → Lambda trigger

In the S3 console → your bucket → Properties → Event notifications, confirm the
`notes/` prefix trigger still lists `voice-vault-document-processor` as the
destination (the ARN is stable across a same-name recreate, so this is usually
already fine — just worth a look after step 3).

## 6. Smoke test

Upload a `.txt` file through the app (Upload page, or `POST /notes/upload`), then:

```powershell
aws logs tail /aws/lambda/voice-vault-document-processor --follow
```

and check the note's `status` flips from `PROCESSING` to `READY` (or `FAILED`,
with `processing_error` set — check the CloudWatch output above for the traceback).
