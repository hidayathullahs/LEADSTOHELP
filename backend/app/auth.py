"""
LEADSTOHELP AI - Authentication & Authorization Layer
Enforces token validation, store tenant isolation, and RBAC governance.
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
      - Permits development tokens and default test identities for local developer testing.
    """
    settings = get_settings()
    is_prod = settings.is_production
    
    # Extract clean store_id
    effective_store_id = x_store_id if isinstance(x_store_id, str) and x_store_id else settings.STORE_ID

    # 1. Check for Bearer token
    if not authorization:
        if not is_prod and settings.DEBUG:
            # Development-only default authorized store manager
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
        # Try real Firebase Admin token verification
        try:
            import firebase_admin
            from firebase_admin import auth
            decoded = auth.verify_id_token(token)
            return AuthenticatedUser(
                uid=decoded.get("uid", "user_authenticated"),
                email=decoded.get("email", "manager@deccanroast.in"),
                name=decoded.get("name", "Store Manager"),
                role=decoded.get("role", "STORE_MANAGER"),
                store_id=decoded.get("store_id", effective_store_id)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Production Firebase ID token verification failed: {str(e)}"
            )

    # 3. Development mode verification
    try:
        import firebase_admin
        from firebase_admin import auth
        decoded = auth.verify_id_token(token)
        return AuthenticatedUser(
            uid=decoded.get("uid", "user_authenticated"),
            email=decoded.get("email", "manager@deccanroast.in"),
            name=decoded.get("name", "Store Manager"),
            role=decoded.get("role", "STORE_MANAGER"),
            store_id=decoded.get("store_id", effective_store_id)
        )
    except Exception:
        # Development fallback token check
        if token == settings.JWT_SECRET_KEY or token == "dev_token_manager" or settings.DEBUG:
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
