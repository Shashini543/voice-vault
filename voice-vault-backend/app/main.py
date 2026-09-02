from fastapi import FastAPI

app = FastAPI(
    title="Voice Vault API",
    description="Backend API for the Voice Vault application",
    version="1.0.0",
)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "Voice Vault API"
    }