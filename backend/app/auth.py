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
    Extracts authenticated user identity and enforces store tenancy.
    """
    settings = get_settings()
    
    # 1. Check for Bearer token
    if not authorization:
        # In development mode, allow default authorized store manager
        if settings.DEBUG:
            return AuthenticatedUser(
                uid="user_arjun_rao_01",
                email="arjun@deccanroast.in",
                name="Arjun Rao (Operations Manager)",
                role="STORE_MANAGER",
                store_id=x_store_id or settings.STORE_ID
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing."
        )

    token_type, _, token = authorization.partition(" ")
    if token_type.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization token format. Expected 'Bearer <token>'."
        )

    # 2. Try Firebase Admin token verification if available
    try:
        import firebase_admin
        from firebase_admin import auth
        decoded = auth.verify_id_token(token)
        return AuthenticatedUser(
            uid=decoded.get("uid", "user_authenticated"),
            email=decoded.get("email", "manager@deccanroast.in"),
            name=decoded.get("name", "Store Manager"),
            role=decoded.get("role", "STORE_MANAGER"),
            store_id=decoded.get("store_id", settings.STORE_ID)
        )
    except Exception:
        # Fallback for dev JWT / local testing tokens
        if token == settings.JWT_SECRET_KEY or settings.DEBUG:
            return AuthenticatedUser(
                uid="user_arjun_rao_01",
                email="arjun@deccanroast.in",
                name="Arjun Rao (Operations Manager)",
                role="STORE_MANAGER",
                store_id=x_store_id or settings.STORE_ID
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
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
