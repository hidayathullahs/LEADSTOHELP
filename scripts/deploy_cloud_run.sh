#!/usr/bin/env bash
# =============================================================================
# LEADSTOHELP AI - Google Cloud Run Production Deployment Script
# Hack2Skill Gen AI Academy APAC Ideathon Prototype Submission
# =============================================================================
set -euo pipefail

# Configuration Parameters (Override via environment variables if desired)
PROJECT_ID="${GCP_PROJECT_ID:-hidayathullah-de22c}"
REGION="${GCP_REGION:-asia-south1}"
SERVICE_NAME="leadstohelp"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"
SECRET_NAME="gemini-api-key"

echo "======================================================================"
echo "🚀 Deploying LEADSTOHELP AI to Google Cloud Run"
echo "Project:  ${PROJECT_ID}"
echo "Region:   ${REGION}"
echo "Service:  ${SERVICE_NAME}"
echo "======================================================================"

# 1. Set Active GCP Project
echo "▶ Setting Google Cloud active project..."
gcloud config set project "${PROJECT_ID}"

# 2. Enable Required Cloud APIs
echo "▶ Enabling required Google Cloud APIs..."
gcloud services enable \
    run.googleapis.com \
    firestore.googleapis.com \
    secretmanager.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    identitytoolkit.googleapis.com

# 3. Secure Secret Manager Provisioning
echo "▶ Checking Secret Manager secret: ${SECRET_NAME}..."
if ! gcloud secrets describe "${SECRET_NAME}" --project="${PROJECT_ID}" > /dev/null 2>&1; then
    echo "⚠️ Secret '${SECRET_NAME}' not found in Secret Manager."
    if [ -n "${GEMINI_API_KEY:-}" ]; then
        echo "Creating secret from GEMINI_API_KEY environment variable..."
        echo -n "${GEMINI_API_KEY}" | gcloud secrets create "${SECRET_NAME}" --data-file=- --project="${PROJECT_ID}"
    else
        echo "Please enter your Google Gemini API Key:"
        read -s ENTERED_KEY
        echo -n "${ENTERED_KEY}" | gcloud secrets create "${SECRET_NAME}" --data-file=- --project="${PROJECT_ID}"
    fi
fi

# Grant Cloud Run Service Account access to Secret Manager
PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format="value(projectNumber)")
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
echo "▶ Granting Secret Accessor permission to ${COMPUTE_SA}..."
gcloud secrets add-iam-policy-binding "${SECRET_NAME}" \
    --member="serviceAccount:${COMPUTE_SA}" \
    --role="roles/secretmanager.secretAccessor" \
    --project="${PROJECT_ID}" || true

# 4. Build and Submit Container via Google Cloud Build
echo "▶ Building unified container image via Cloud Build..."
gcloud builds submit --tag "${IMAGE_NAME}" .

# 5. Deploy to Google Cloud Run
echo "▶ Deploying container to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
    --image "${IMAGE_NAME}" \
    --platform managed \
    --region "${REGION}" \
    --allow-unauthenticated \
    --port 8080 \
    --memory 1Gi \
    --cpu 1 \
    --timeout 300 \
    --concurrency 80 \
    --set-env-vars "ENVIRONMENT=production,DEBUG=False,FIRESTORE_MODE=cloud,GOOGLE_CLOUD_PROJECT=${PROJECT_ID},FIREBASE_PROJECT_ID=${PROJECT_ID},GEMINI_MODEL=gemini-2.5-flash,ENABLE_DEV_AUTH_BYPASS=False" \
    --set-secrets "GEMINI_API_KEY=${SECRET_NAME}:latest"

# 6. Retrieve Service URL
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" --platform managed --region "${REGION}" --format="value(status.url)")

echo "======================================================================"
echo "✅ Cloud Run Deployment Succeeded!"
echo "Service URL: ${SERVICE_URL}"
echo "Health Check: ${SERVICE_URL}/health"
echo "API Docs:     ${SERVICE_URL}/docs"
echo "======================================================================"

# 7. Optional Deploy Firestore Rules
if command -v firebase &> /dev/null; then
    echo "▶ Deploying Firestore Security Rules and Indexes..."
    firebase deploy --only firestore:rules,firestore:indexes --project "${PROJECT_ID}" || echo "⚠️ Firestore rules deployment skipped."
fi

echo "🎉 Production Prototype Ready for Ideathon Submission!"
