"""
LEADSTOHELP AI - User-Isolated Firestore Persistence Service
Provides strict UID-partitioned document storage for chat sessions, messages, and approval records.
Hierarchy:
  /users/{uid}/chat_sessions/{sessionId}
  /users/{uid}/chat_sessions/{sessionId}/messages/{messageId}
  /users/{uid}/approvals/{approvalId}
  /users/{uid}/preferences/settings
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import copy

from ..config import get_settings
from ..services.firestore_service import get_firestore_service
from ..models.common import current_utc_time


class UserFirestoreService:
    def __init__(self):
        self.settings = get_settings()
        self.base_db = get_firestore_service()
        # In-memory user-isolated fallback store for local development/test execution
        # Keyed strictly by authenticated UID: { uid: { sessions: {}, messages: {}, approvals: {}, preferences: {} } }
        self._local_user_store: Dict[str, Dict[str, Any]] = {}

    def _get_client(self):
        """Returns live Firestore client if connected and mode is cloud/dual, else None"""
        if self.base_db and self.base_db.mode == "cloud" and self.base_db._firestore_client:
            return self.base_db._firestore_client
        return None

    def _ensure_user_local_partition(self, uid: str) -> Dict[str, Any]:
        """Ensures isolated partition exists in local store for the specified UID"""
        if uid not in self._local_user_store:
            self._local_user_store[uid] = {
                "chat_sessions": {},
                "messages": {},  # session_id -> list of messages
                "approvals": {},
                "preferences": {}
            }
        return self._local_user_store[uid]

    # =========================================================================
    # Chat Sessions & Multi-Turn Message Persistence (/users/{uid}/chat_sessions)
    # =========================================================================

    def create_chat_session(
        self,
        uid: str,
        session_id: str,
        title: str = "Operations Copilot Session",
        initial_sku: str = "COFFEE-001"
    ) -> Dict[str, Any]:
        """Creates a new conversation session document isolated to the authenticated UID"""
        now = current_utc_time()
        session_doc = {
            "session_id": session_id,
            "uid": uid,
            "title": title,
            "initial_sku": initial_sku,
            "message_count": 0,
            "created_at": now,
            "updated_at": now
        }

        client = self._get_client()
        if client:
            try:
                client.collection("users").document(uid).collection("chat_sessions").document(session_id).set(session_doc)
            except Exception as e:
                print(f"[FIRESTORE ERROR] Failed to write chat session for {uid}: {e}")

        # Local fallback partition
        partition = self._ensure_user_local_partition(uid)
        partition["chat_sessions"][session_id] = copy.deepcopy(session_doc)
        if session_id not in partition["messages"]:
            partition["messages"][session_id] = []

        return copy.deepcopy(session_doc)

    def get_chat_sessions(self, uid: str) -> List[Dict[str, Any]]:
        """Retrieves all chat sessions for the authenticated UID"""
        client = self._get_client()
        if client:
            try:
                docs = client.collection("users").document(uid).collection("chat_sessions").order_by("updated_at", direction="DESCENDING").stream()
                sessions = [d.to_dict() for d in docs]
                if sessions:
                    return sessions
            except Exception as e:
                print(f"[FIRESTORE ERROR] Failed to list chat sessions for {uid}: {e}")

        partition = self._ensure_user_local_partition(uid)
        sessions_list = list(partition["chat_sessions"].values())
        sessions_list.sort(key=lambda x: x.get("updated_at", ""), reverse=True)
        return copy.deepcopy(sessions_list)

    def get_chat_session(self, uid: str, session_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a specific chat session for the authenticated UID"""
        client = self._get_client()
        if client:
            try:
                doc = client.collection("users").document(uid).collection("chat_sessions").document(session_id).get()
                if doc.exists:
                    return doc.to_dict()
            except Exception as e:
                print(f"[FIRESTORE ERROR] Failed to get chat session {session_id} for {uid}: {e}")

        partition = self._ensure_user_local_partition(uid)
        session = partition["chat_sessions"].get(session_id)
        return copy.deepcopy(session) if session else None

    def save_chat_message(
        self,
        uid: str,
        session_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Appends a message to /users/{uid}/chat_sessions/{sessionId}/messages/{messageId}
        Role must be 'user' or 'model' (Gemini compatible).
        """
        now = current_utc_time()
        msg_id = f"MSG-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S%f')[:17]}"
        message_doc = {
            "message_id": msg_id,
            "session_id": session_id,
            "uid": uid,
            "role": role,
            "content": content,
            "metadata": metadata or {},
            "timestamp": now
        }

        # 1. Update Cloud Firestore if live
        client = self._get_client()
        if client:
            try:
                session_ref = client.collection("users").document(uid).collection("chat_sessions").document(session_id)
                session_ref.collection("messages").document(msg_id).set(message_doc)
                session_ref.update({
                    "updated_at": now,
                    "last_message": content[:100]
                })
            except Exception as e:
                print(f"[FIRESTORE ERROR] Failed to save chat message for {uid}: {e}")

        # 2. Update local partition
        partition = self._ensure_user_local_partition(uid)
        if session_id not in partition["chat_sessions"]:
            self.create_chat_session(uid, session_id)

        partition["chat_sessions"][session_id]["updated_at"] = now
        partition["chat_sessions"][session_id]["last_message"] = content[:100]
        partition["chat_sessions"][session_id]["message_count"] = partition["chat_sessions"][session_id].get("message_count", 0) + 1

        if session_id not in partition["messages"]:
            partition["messages"][session_id] = []
        partition["messages"][session_id].append(copy.deepcopy(message_doc))

        return copy.deepcopy(message_doc)

    def get_chat_history(self, uid: str, session_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Retrieves ordered conversation history for a given session under /users/{uid}/chat_sessions/{sessionId}/messages.
        Strictly enforces that user A cannot view user B's chat history.
        """
        client = self._get_client()
        if client:
            try:
                docs = (
                    client.collection("users")
                    .document(uid)
                    .collection("chat_sessions")
                    .document(session_id)
                    .collection("messages")
                    .order_by("timestamp", direction="ASCENDING")
                    .limit(limit)
                    .stream()
                )
                messages = [d.to_dict() for d in docs]
                if messages:
                    return messages
            except Exception as e:
                print(f"[FIRESTORE ERROR] Failed to get chat history for {uid}: {e}")

        partition = self._ensure_user_local_partition(uid)
        msgs = partition["messages"].get(session_id, [])
        msgs_sorted = sorted(msgs, key=lambda x: x.get("timestamp", ""))
        return copy.deepcopy(msgs_sorted[-limit:])

    def delete_chat_session(self, uid: str, session_id: str) -> bool:
        """Deletes a chat session belonging to the authenticated UID"""
        client = self._get_client()
        if client:
            try:
                session_ref = client.collection("users").document(uid).collection("chat_sessions").document(session_id)
                # Delete messages subcollection documents
                for msg in session_ref.collection("messages").stream():
                    msg.reference.delete()
                session_ref.delete()
            except Exception as e:
                print(f"[FIRESTORE ERROR] Failed to delete session {session_id} for {uid}: {e}")

        partition = self._ensure_user_local_partition(uid)
        partition["chat_sessions"].pop(session_id, None)
        partition["messages"].pop(session_id, None)
        return True

    # =========================================================================
    # User Approval History & Audit (/users/{uid}/approvals)
    # =========================================================================

    def record_user_approval(self, uid: str, approval_data: Dict[str, Any]) -> Dict[str, Any]:
        """Saves an approval transaction record to /users/{uid}/approvals/{approvalId}"""
        approval_id = approval_data.get("approval_id") or f"APPR-{datetime.now().year}-{len(self._ensure_user_local_partition(uid)['approvals']) + 1:03d}"
        doc = copy.deepcopy(approval_data)
        doc["approval_id"] = approval_id
        doc["uid"] = uid
        doc.setdefault("created_at", current_utc_time())
        doc.setdefault("status", "PENDING")

        client = self._get_client()
        if client:
            try:
                client.collection("users").document(uid).collection("approvals").document(approval_id).set(doc)
            except Exception as e:
                print(f"[FIRESTORE ERROR] Failed to record user approval for {uid}: {e}")

        partition = self._ensure_user_local_partition(uid)
        partition["approvals"][approval_id] = copy.deepcopy(doc)
        return copy.deepcopy(doc)

    def get_user_approvals(self, uid: str) -> List[Dict[str, Any]]:
        """Retrieves approval history isolated to the authenticated UID"""
        client = self._get_client()
        if client:
            try:
                docs = client.collection("users").document(uid).collection("approvals").order_by("created_at", direction="DESCENDING").stream()
                approvals = [d.to_dict() for d in docs]
                if approvals:
                    return approvals
            except Exception as e:
                print(f"[FIRESTORE ERROR] Failed to get approvals for {uid}: {e}")

        partition = self._ensure_user_local_partition(uid)
        approvals_list = list(partition["approvals"].values())
        approvals_list.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return copy.deepcopy(approvals_list)

    def update_user_approval_decision(
        self,
        uid: str,
        approval_id: str,
        decision: str,
        reason: str = ""
    ) -> Optional[Dict[str, Any]]:
        """Updates decision state on a user-scoped approval record"""
        now = current_utc_time()
        client = self._get_client()
        if client:
            try:
                ref = client.collection("users").document(uid).collection("approvals").document(approval_id)
                ref.update({
                    "status": decision,
                    "decided_at": now,
                    "decision_reason": reason,
                    "updated_at": now
                })
            except Exception as e:
                print(f"[FIRESTORE ERROR] Failed to update user approval {approval_id} for {uid}: {e}")

        partition = self._ensure_user_local_partition(uid)
        if approval_id in partition["approvals"]:
            doc = partition["approvals"][approval_id]
            doc["status"] = decision
            doc["decided_at"] = now
            doc["decision_reason"] = reason
            doc["updated_at"] = now
            return copy.deepcopy(doc)
        return None

    # =========================================================================
    # User Preferences (/users/{uid}/preferences/settings)
    # =========================================================================

    def save_user_preferences(self, uid: str, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Saves user-specific UI / threshold preferences"""
        client = self._get_client()
        now = current_utc_time()
        doc = copy.deepcopy(preferences)
        doc["updated_at"] = now
        if client:
            try:
                client.collection("users").document(uid).collection("preferences").document("settings").set(doc, merge=True)
            except Exception as e:
                print(f"[FIRESTORE ERROR] Failed to save preferences for {uid}: {e}")

        partition = self._ensure_user_local_partition(uid)
        partition["preferences"].update(doc)
        return copy.deepcopy(partition["preferences"])

    def get_user_preferences(self, uid: str) -> Dict[str, Any]:
        """Retrieves user-specific UI preferences"""
        client = self._get_client()
        if client:
            try:
                doc = client.collection("users").document(uid).collection("preferences").document("settings").get()
                if doc.exists:
                    return doc.to_dict()
            except Exception as e:
                print(f"[FIRESTORE ERROR] Failed to get preferences for {uid}: {e}")

        partition = self._ensure_user_local_partition(uid)
        return copy.deepcopy(partition["preferences"])


_user_firestore_instance: Optional[UserFirestoreService] = None

def get_user_firestore_service() -> UserFirestoreService:
    global _user_firestore_instance
    if _user_firestore_instance is None:
        _user_firestore_instance = UserFirestoreService()
    return _user_firestore_instance

def reset_user_firestore_service():
    """Resets singleton instance for deterministic unit test isolation"""
    global _user_firestore_instance
    _user_firestore_instance = None
