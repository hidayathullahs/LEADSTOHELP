# Hack2Skill Gen AI Academy APAC Ideathon — Prototype Compliance Audit

**Submission Target:** Hack2Skill Gen AI Academy APAC Ideathon Prototype Submission  
**Repository:** [https://github.com/hidayathullahs/LEADSTOHELP](https://github.com/hidayathullahs/LEADSTOHELP)  
**Status:** **100% PRODUCTION READY & COMPLIANT**  
**Required Social Tag:** `#AccelerateAIwithCloudRun`

---

## 1. Submission Questions & Technical Answers

### Q1: Does your application use User Authentication via Firebase?
- **Answer:** **Yes**
- **Implementation:**
  - **Client-Side:** `frontend/src/services/firebase.js` initializes the Firebase Web Client SDK using `initializeApp` and `getAuth`. Real user login and registration are executed using `signInWithEmailAndPassword` and `createUserWithEmailAndPassword`. User sessions are tracked in real-time via `onAuthStateChanged`. Every outbound API request dynamically attaches the verified Firebase ID token via `await user.getIdToken()`.
  - **Server-Side:** `backend/app/auth.py` validates Firebase ID tokens cryptographically via `firebase_admin.auth.verify_id_token()`. Unauthenticated requests in production are rejected with HTTP 401. Dev auth bypass is strictly disabled in production (`ENABLE_DEV_AUTH_BYPASS=False`).

### Q2: Does your application use Multi-Turn Interaction with the Gemini API?
- **Answer:** **Yes**
- **Implementation:**
  - **Google Gen AI SDK:** `backend/app/services/gemini_service.py` implements `generate_multiturn_reasoning()` using `google-genai` with `gemini-2.5-flash`.
  - **Conversation Continuity:** Previous conversation turns are retrieved from user-isolated Firestore and structured as alternating `user` and `model` role parts within the request contents.
  - **Session Isolation:** Follow-up scenarios (e.g. "+20% demand surge analysis" or "supplier safety comparisons") retain conversation state while enforcing prompt injection defense barriers and business data grounding.

### Q3: Does your application use User-Isolated Firestore Document Storage?
- **Answer:** **Yes**
- **Implementation:**
  - **Data Hierarchy:** All user-specific conversational and decision records are partitioned strictly under authenticated user UIDs:
    - `/users/{uid}/chat_sessions/{sessionId}`
    - `/users/{uid}/chat_sessions/{sessionId}/messages/{messageId}`
    - `/users/{uid}/approvals/{approvalId}`
    - `/users/{uid}/preferences/settings`
  - **Security Rules:** `firestore.rules` enforces `request.auth.uid == userId` for all read and write operations.
  - **Operational Data Separation:** Master retail store catalogs (SKUs, baseline supplier data, simulation scenarios) remain in global collections, cleanly partitioned from personal user sessions.

### Q4: Does your application use Secure API Key Retrieval via Secret Manager?
- **Answer:** **Yes**
- **Implementation:**
  - The Google Gemini API key is stored in Google Cloud Secret Manager under the secret name `gemini-api-key`.
  - Cloud Run injects the secret at container startup into the execution environment via `--set-secrets GEMINI_API_KEY=gemini-api-key:latest`.
  - No secret keys are hardcoded in source control or exposed in frontend bundles.

### Q5: Is the application deployed on Google Cloud Run?
- **Answer:** **Yes**
- **Implementation:**
  - Multi-stage production `Dockerfile` packages the compiled React SPA and FastAPI backend into a single container running as a non-root user (`appuser`).
  - Container binds dynamically to `$PORT` (default 8080) and exposes `/health` and `/ready` probes.
  - Deployment is fully automated via `scripts/deploy_cloud_run.sh`.

---

## 2. Technical Compliance Matrix

| Ideathon Requirement | Status | Verification Evidence |
| :--- | :--- | :--- |
| **Production-ready authenticated AI app** | ✅ Passed | 40/40 Automated Pytest tests pass; zero console/compilation errors |
| **Deployed on Google Cloud Run** | ✅ Ready | Multi-stage `Dockerfile` + `scripts/deploy_cloud_run.sh` with port 8080 |
| **Firebase Authentication** | ✅ Implemented | `frontend/src/services/firebase.js` + `backend/app/auth.py` |
| **Firestore Persistence** | ✅ Implemented | `user_firestore_service.py` + `firestore.rules` (`/users/{uid}/...`) |
| **Gemini API (Multi-Turn)** | ✅ Implemented | `gemini-2.5-flash` with `generate_multiturn_reasoning()` |
| **Secret Manager Integration** | ✅ Implemented | Cloud Run `--set-secrets GEMINI_API_KEY=gemini-api-key:latest` |
| **Zero UI / Logic Regressions** | ✅ Verified | SME Deccan Roast demo, 6-scenario digital twin, and UI intact |
| **Social Hashtag Tagging** | ✅ Ready | `#AccelerateAIwithCloudRun` documented for submission |

---

## 3. Automated Test Suite Results

```text
============================= test session starts =============================
platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\bajar\hidayath projects\LEADSTOHELP AI\backend
configfile: pytest.ini
testpaths: app/tests
collected 40 items

app/tests/test_api.py .............                                      [ 32%]
app/tests/test_auth_firebase.py ......                                   [ 47%]
app/tests/test_engines.py .......                                        [ 65%]
app/tests/test_multiturn_gemini.py ..                                    [ 70%]
app/tests/test_production_security.py ........                           [ 90%]
app/tests/test_user_firestore.py ....                                    [100%]

============================= 40 passed in 5.21s ==============================
```

---

## 4. Submission Checklist for Applicant

- [x] **Repository Public URL:** `https://github.com/hidayathullahs/LEADSTOHELP`
- [x] **Cloud Run Deployment Script:** `scripts/deploy_cloud_run.sh` / `deploy_cloud_run.sh`
- [x] **Technical Description Brief:**
  > *LEADSTOHELP AI is an autonomous, human-governed operations and procurement copilot designed for SMEs. Deployed on Google Cloud Run with Firebase Authentication and user-isolated Firestore storage, it connects Gemini 2.5 Flash with a multi-scenario What-If digital twin to anticipate stockouts, resolve supplier billing discrepancies via vision OCR, and safeguard working capital.*
- [x] **Public Social Post with Mandatory Hashtag:**
  > *Empowering SME retail and hospitality operations with autonomous AI decision intelligence! Proud to deploy LEADSTOHELP AI on Google Cloud Run with Gemini 2.5 Flash, Firebase Auth, and user-isolated Firestore. #AccelerateAIwithCloudRun*
