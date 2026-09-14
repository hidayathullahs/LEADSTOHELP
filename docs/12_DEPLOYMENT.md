# 12 — Google Cloud Run Production Deployment Guide

This document outlines the step-by-step procedure for deploying **LEADSTOHELP AI** to Google Cloud Run in full compliance with the Hack2Skill Gen AI Academy APAC Ideathon Prototype Submission criteria.

---

## Architecture Overview

```
                          ┌──────────────────────────┐
                          │   Firebase Auth Client   │
                          │   (Email / Access Keys)  │
                          └────────────┬─────────────┘
                                       │ (Verified ID Token)
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Google Cloud Run Service                        │
│                         (Port 8080 / Non-Root)                         │
│                                                                        │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │  React 18 Dashboard   │             │   FastAPI Microservice     │  │
│  │  (Vite SPA Frontend)  │────────────▶│   (Multi-Agent Engine)     │  │
│  └───────────────────────┘             └─────────────┬──────────────┘  │
└──────────────────────────────────────────────────────┼─────────────────┘
                                                       │
         ┌─────────────────────────────────────────────┼─────────────────────────┐
         │                                             │                         │
         ▼                                             ▼                         ▼
┌──────────────────┐                         ┌───────────────────┐    ┌────────────────────┐
│  Secret Manager  │                         │  Cloud Firestore  │    │   Google Gen AI    │
│ (GEMINI_API_KEY) │                         │  (/users/{uid}/)  │    │  (Gemini 2.5 Flash)│
└──────────────────┘                         └───────────────────┘    └────────────────────┘
```

---

## 1. Prerequisites

1. **Google Cloud SDK (`gcloud`)** installed and authenticated:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```
2. **Firebase CLI** installed and authenticated:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
3. A Google Cloud Project with billing enabled (e.g. `hidayathullah-de22c`).
4. A Google Gemini API Key from Google AI Studio.

---

## 2. 1-Click Automated Deployment

Run the automated deployment script directly from the repository root:

```bash
chmod +x scripts/deploy_cloud_run.sh
./scripts/deploy_cloud_run.sh
```

---

## 3. Manual Step-by-Step Deployment

### Step 3.1: Configure Project & Enable GCP Services

```bash
export PROJECT_ID="hidayathullah-de22c"
export REGION="asia-south1"

# Set active project
gcloud config set project ${PROJECT_ID}

# Enable required Google Cloud APIs
gcloud services enable \
    run.googleapis.com \
    firestore.googleapis.com \
    secretmanager.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    identitytoolkit.googleapis.com
```

### Step 3.2: Secure Gemini API Key in Secret Manager

```bash
# Create secret in Secret Manager
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key \
    --data-file=- \
    --project=${PROJECT_ID}

# Grant Cloud Run Service Account permission to access secret
PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")
gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    --project=${PROJECT_ID}
```

### Step 3.3: Deploy Single-Service Full-Stack Container to Cloud Run

```bash
# Build and submit container image via Google Cloud Build
gcloud builds submit --tag gcr.io/${PROJECT_ID}/leadstohelp .

# Deploy to Cloud Run with Secret Manager environment binding
gcloud run deploy leadstohelp \
    --image gcr.io/${PROJECT_ID}/leadstohelp \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --port 8080 \
    --memory 1Gi \
    --cpu 1 \
    --timeout 300 \
    --concurrency 80 \
    --set-env-vars "ENVIRONMENT=production,DEBUG=False,FIRESTORE_MODE=cloud,GOOGLE_CLOUD_PROJECT=${PROJECT_ID},FIREBASE_PROJECT_ID=${PROJECT_ID},GEMINI_MODEL=gemini-2.5-flash,ENABLE_DEV_AUTH_BYPASS=False" \
    --set-secrets "GEMINI_API_KEY=gemini-api-key:latest"
```

### Step 3.4: Deploy Firestore Security Rules & Indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes --project ${PROJECT_ID}
```

---

## 4. Verification & Health Audit

Once deployed, verify container health and configuration:

```bash
# Get Cloud Run Service URL
SERVICE_URL=$(gcloud run services describe leadstohelp --platform managed --region ${REGION} --format="value(status.url)")
echo "Service URL: ${SERVICE_URL}"

# Health check
curl -i ${SERVICE_URL}/health

# Readiness check (requires authenticated Firebase ID token in production)
curl -i ${SERVICE_URL}/ready
```

---

## 5. Cloud Run Environment Variables & Secrets Reference

| Variable / Secret | Source | Production Setting | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Secret Manager | `gemini-api-key:latest` | Google Gen AI API credentials |
| `ENVIRONMENT` | Environment | `production` | Enables strict production security mode |
| `DEBUG` | Environment | `False` | Disables debug bypasses and stack traces |
| `ENABLE_DEV_AUTH_BYPASS` | Environment | `False` | Strictly forbids mock tokens in production |
| `FIRESTORE_MODE` | Environment | `cloud` | Enables live GCP Firestore persistence |
| `GOOGLE_CLOUD_PROJECT` | Environment | `hidayathullah-de22c` | Google Cloud Project ID |
| `FIREBASE_PROJECT_ID` | Environment | `hidayathullah-de22c` | Firebase Project ID for Auth / Firestore |
| `GEMINI_MODEL` | Environment | `gemini-2.5-flash` | Gemini model name |
| `PORT` | Cloud Run | `8080` | Container port injected by Cloud Run |
