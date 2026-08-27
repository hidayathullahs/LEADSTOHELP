"""
LEADSTOHELP AI - Immutable Governance & Audit Service
Records every human approval, agent decision, tool execution, and ledger mutation.
"""

from typing import Dict, Any, Optional
from datetime import datetime, timezone
from ..models.common import current_utc_time
from .firestore_service import get_firestore_service

class AuditService:
    def __init__(self):
        self.db = get_firestore_service()

    def log_event(
        self,
        action: str,
        actor_id: str,
        actor_role: str,
        resource_type: str,
        resource_id: str,
        details: Dict[str, Any],
        previous_state: Optional[Dict[str, Any]] = None,
        new_state: Optional[Dict[str, Any]] = None,
        status: str = "SUCCESS"
    ) -> Dict[str, Any]:
        audit_entry = {
            "audit_id": f"AUD-LOG-{datetime.now().strftime('%Y%m%d%H%M%S%f')[:17]}",
            "timestamp": current_utc_time(),
            "action": action,
            "actor_id": actor_id,
            "actor_role": actor_role,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "details": details,
            "previous_state": previous_state,
            "new_state": new_state,
            "status": status,
        }
        
        self.db._local_db.setdefault("audit_logs", []).insert(0, audit_entry)
        self.db._save_local_data()
        return audit_entry

_audit_instance = None

def get_audit_service() -> AuditService:
    global _audit_instance
    if _audit_instance is None:
        _audit_instance = AuditService()
    return _audit_instance

def reset_audit_service():
    """Resets the audit service singleton instance for test isolation"""
    global _audit_instance
    _audit_instance = None
