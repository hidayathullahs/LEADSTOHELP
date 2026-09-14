"""
LEADSTOHELP AI - Authentication & Authorization Layer
Enforces Firebase ID token validation, store tenant isolation, and RBAC governance.
"""

from typing import Optional, Dict, Any
from fastapi import Header, HTTPException, status, Depends
from pydantic import BaseModel
from .config import get_settings

class AuthenticatedUser(BaseModel):
    uid: str
    email: str
    name: str
    role: str  # "STORE_MANAGER", "PROCUREMENT_LEAD", "BUSINESS_OWNER", "STAFF"
    store_id: str
    is_authenticated: bool = True

_firebase_initialized = False

def init_firebase_admin() -> bool:
    """
    Initializes Firebase Admin SDK exactly once.
    On Google Cloud Run, automatically uses Application Default Credentials (ADC).
    Can also accept explicit service account credentials via environment variables.
    """
    global _firebase_initialized
    try:
        import firebase_admin
        from firebase_admin import auth, credentials

        if _firebase_initialized or len(firebase_admin._apps) > 0:
            return True

        settings = get_settings()
        # 1. Explicit service-account private key (if provided in env)
        if settings.FIREBASE_CLIENT_EMAIL and settings.FIREBASE_PRIVATE_KEY:
            private_key = settings.FIREBASE_PRIVATE_KEY.replace('\\n', '\n')
            cert_dict = {
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID or settings.GOOGLE_CLOUD_PROJECT,
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
                "private_key": private_key
            }
            cred = credentials.Certificate(cert_dict)
            firebase_admin.initialize_app(cred)
            _firebase_initialized = True
            print(f"[AUTH] Firebase Admin initialized with service account ({cert_dict['project_id']}).")
            return True

        # 2. Application Default Credentials on Cloud Run / GCP environment
        options = {}
        target_project = settings.FIREBASE_PROJECT_ID or settings.GOOGLE_CLOUD_PROJECT
        if target_project:
            options["projectId"] = target_project

        firebase_admin.initialize_app(options=options if options else None)
        _firebase_initialized = True
        print(f"[AUTH] Firebase Admin initialized with Application Default Credentials ({target_project}).")
        return True
    except ImportError:
        # Module not installed in current environment (e.g. minimal testing environment)
        return False
    except Exception as e:
        # Do not hard-crash startup if credentials are not yet discovered in offline dev
        print(f"[AUTH WARNING] Firebase Admin SDK initialization deferred or failed: {e}")
        return False

def verify_token(
    authorization: Optional[str] = Header(None),
    x_store_id: Optional[str] = Header(None)
) -> AuthenticatedUser:
    """
    Validates Firebase ID token or Development JWT.
    In Production (DEBUG=False or ENVIRONMENT=production):
      - Strictly requires a valid Firebase ID token verified via firebase_admin.
      - Rejects missing headers, dev tokens, and hardcoded identities with HTTP 401.
    In Development (DEBUG=True):
      - Attempts real Firebase token validation first.
      - Permits development tokens only when ENABLE_DEV_AUTH_BYPASS is active for local testing.
    """
    settings = get_settings()
    is_prod = settings.is_production
    effective_store_id = x_store_id if isinstance(x_store_id, str) and x_store_id else settings.STORE_ID

    # Ensure Firebase Admin SDK is ready
    init_firebase_admin()

    # 1. Check for Bearer token
    if not authorization:
        if not is_prod and settings.DEBUG and settings.ENABLE_DEV_AUTH_BYPASS:
            # Development-only authorized store manager for offline testing
            return AuthenticatedUser(
                uid="user_arjun_rao_01",
                email="arjun@deccanroast.in",
                name="Arjun Rao (Operations Manager)",
                role="STORE_MANAGER",
                store_id=effective_store_id
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing. A valid Firebase ID token is required in production."
        )

    token_type, _, token = authorization.partition(" ")
    if token_type.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization token format. Expected 'Bearer <token>'."
        )

    # 2. In production, dev tokens are strictly forbidden
    if is_prod:
        try:
            import firebase_admin
            from firebase_admin import auth
            decoded = auth.verify_id_token(token)
            return AuthenticatedUser(
                uid=decoded.get("uid") or decoded.get("sub", "user_authenticated"),
                email=decoded.get("email", "manager@deccanroast.in"),
                name=decoded.get("name") or decoded.get("email", "Store Manager").split('@')[0],
                role=decoded.get("role", "STORE_MANAGER"),
                store_id=decoded.get("store_id", effective_store_id)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Production Firebase ID token verification failed: {str(e)}"
            )

    # 3. Development mode verification: try Firebase ID token first
    try:
        import firebase_admin
        from firebase_admin import auth
        decoded = auth.verify_id_token(token)
        return AuthenticatedUser(
            uid=decoded.get("uid") or decoded.get("sub", "user_authenticated"),
            email=decoded.get("email", "manager@deccanroast.in"),
            name=decoded.get("name") or decoded.get("email", "Store Manager").split('@')[0],
            role=decoded.get("role", "STORE_MANAGER"),
            store_id=decoded.get("store_id", effective_store_id)
        )
    except Exception:
        # Development fallback token check (only if explicitly enabled)
        if settings.ENABLE_DEV_AUTH_BYPASS and (
            token == settings.JWT_SECRET_KEY or
            token == "dev_token_manager" or
            token.startswith("dev_jwt_secret_")
        ):
            return AuthenticatedUser(
                uid="user_arjun_rao_01",
                email="arjun@deccanroast.in",
                name="Arjun Rao (Operations Manager)",
                role="STORE_MANAGER",
                store_id=effective_store_id
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token in development mode."
        )

def require_manager_role(user: AuthenticatedUser = Depends(verify_token)) -> AuthenticatedUser:
    """Enforces that only operations managers or owners can execute financial/procurement actions"""
    allowed_roles = ["STORE_MANAGER", "BUSINESS_OWNER", "PROCUREMENT_LEAD"]
    if user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Manager approval authorization required."
        )
    return user
