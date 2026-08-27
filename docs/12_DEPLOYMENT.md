# 12 — Google Cloud Run Production Deployment Guide

## 1. Prerequisites
* Google Cloud SDK (`gcloud`) installed and logged in.
* Google Cloud Project with Billing enabled.
* Google AI Studio Gemini API Key.

---

## 2. 1-Click Deployment Commands

```bash
# Set GCP Project
gcloud config set project <YOUR_GCP_PROJECT_ID>

# Enable APIs
gcloud services enable run.googleapis.com firestore.googleapis.com secretmanager.googleapis.com cloudbuild.googleapis.com

# Store Gemini Secret
echo -n "<YOUR_GEMINI_API_KEY>" | gcloud secrets create gemini-api-key --data-file=-

# Deploy Backend Service
gcloud builds submit --tag gcr.io/<YOUR_GCP_PROJECT_ID>/leadstohelp-backend backend/

gcloud run deploy leadstohelp-backend \
    --image gcr.io/<YOUR_GCP_PROJECT_ID>/leadstohelp-backend \
    --platform managed \
    --region asia-south1 \
    --allow-unauthenticated \
    --port 8080 \
    --set-env-vars ENVIRONMENT=production,DEBUG=False,FIRESTORE_MODE=cloud,GOOGLE_CLOUD_PROJECT=<YOUR_GCP_PROJECT_ID>,GEMINI_MODEL=gemini-2.5-flash \
    --set-secrets GEMINI_API_KEY=gemini-api-key:latest

# Deploy Frontend Service
gcloud builds submit --tag gcr.io/<YOUR_GCP_PROJECT_ID>/leadstohelp-frontend frontend/

gcloud run deploy leadstohelp-frontend \
    --image gcr.io/<YOUR_GCP_PROJECT_ID>/leadstohelp-frontend \
    --platform managed \
    --region asia-south1 \
    --allow-unauthenticated \
    --port 80
```
