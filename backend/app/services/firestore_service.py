"""
LEADSTOHELP AI - Dual-Mode Firestore & Persistence Service
Provides enterprise persistence supporting both live Google Cloud Firestore
and an in-memory/JSON-persisted transactional engine for offline/demo/CI reliability.
"""

import json
import os
import copy
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from ..config import get_settings
from ..models.common import current_utc_time

class DualModeFirestoreService:
    # Timeout (seconds) for the Firestore startup connectivity probe RPC.
    # This bounds only the .get() call; credential discovery is bounded
    # separately via GCE_METADATA_TIMEOUT / GCE_METADATA_DETECT_RETRIES.
    PROBE_RPC_TIMEOUT_SECONDS = 3

    @staticmethod
    def _configure_gce_metadata_bounds():
        """
        Configures google-auth library environment variables to prevent the
        GCE metadata server discovery from blocking for ~300s with exponential
        backoff retries when no valid credentials are available.

        These are official, library-supported configuration knobs:
        - GCE_METADATA_TIMEOUT: per-request timeout to metadata server (default: 3s)
        - GCE_METADATA_DETECT_RETRIES: number of retries during detection (default: 3)

        Production-safe values: 1 second timeout, 1 retry = worst case ~2s for
        metadata discovery instead of ~300s.

        Only sets them if not already configured, so operators can override
        via environment or .env for environments that need longer timeouts
        (e.g., slow GKE Workload Identity startup).
        """
        os.environ.setdefault("GCE_METADATA_TIMEOUT", "1")
        os.environ.setdefault("GCE_METADATA_DETECT_RETRIES", "1")

    def __init__(self):
        self.settings = get_settings()
        self.mode = self.settings.FIRESTORE_MODE
        self._firestore_client = None
        self._local_db: Dict[str, Any] = {}

        # Load local state from seeded data file
        self._load_local_data()

        # In production mode with FIRESTORE_MODE=cloud, strictly require live Firestore
        if self.mode == "cloud" or (self.settings.is_production and self.mode != "local"):
            try:
                self._firestore_client = self._create_and_probe_firestore_client()
                self.mode = "cloud"
                print(f"[PERSISTENCE] Connected to Google Cloud Firestore ({self.settings.GOOGLE_CLOUD_PROJECT})")
            except Exception as e:
                error_msg = (
                    f"CRITICAL: Failed to initialize Google Cloud Firestore in production mode: {e}. "
                    f"Ensure Application Default Credentials (ADC) or GOOGLE_CLOUD_PROJECT is configured, "
                    f"or explicitly set FIRESTORE_MODE=local for local testing."
                )
                print(f"[PERSISTENCE ERROR] {error_msg}")
                if self.settings.is_production or self.mode == "cloud":
                    raise RuntimeError(error_msg)
                self.mode = "local"
        elif self.mode == "dual":
            # Development dual-mode: try cloud, gracefully fallback to local
            try:
                self._firestore_client = self._create_and_probe_firestore_client()
                self.mode = "cloud"
                print(f"[PERSISTENCE] Connected to Google Cloud Firestore ({self.settings.GOOGLE_CLOUD_PROJECT})")
            except Exception as e:
                print(f"[PERSISTENCE] Live Firestore unavailable ({e}). Using local developer state engine.")
                self.mode = "local"
        else:
            self.mode = "local"
            print("[PERSISTENCE] Initialized in local JSON persistence mode.")

    def _create_and_probe_firestore_client(self):
        """
        Creates a Firestore client and validates real connectivity.

        Bounds the two slowest paths:
        A. google.auth.default() credential discovery — bounded by
           GCE_METADATA_TIMEOUT=1 and GCE_METADATA_DETECT_RETRIES=1
           (set via _configure_gce_metadata_bounds). Worst case ~2s.
        B. Firestore .get() RPC — bounded by PROBE_RPC_TIMEOUT_SECONDS=3
           with retry disabled on the probe call.

        Total worst-case: ~5s instead of ~300s.
        """
        # Ensure metadata discovery is bounded before any google.cloud import
        # triggers credential resolution.
        self._configure_gce_metadata_bounds()

        from google.cloud import firestore
        from google.api_core import retry as api_retry

        client = firestore.Client(
            project=self.settings.GOOGLE_CLOUD_PROJECT,
            database=self.settings.FIRESTORE_DATABASE
        )

        # Connectivity probe: single attempt, no retries, tight timeout.
        # The default .get() uses automatic retries with backoff which can
        # compound on top of the credential discovery delay.
        client.collection("_system_health").document("probe").get(
            timeout=self.PROBE_RPC_TIMEOUT_SECONDS,
            retry=api_retry.Retry(deadline=self.PROBE_RPC_TIMEOUT_SECONDS),
        )
        return client

    def get_status(self) -> Dict[str, Any]:
        """Returns non-secret status of the persistence subsystem"""
        return {
            "mode": self.mode,
            "connected": self._firestore_client is not None or self.mode == "local",
            "is_cloud": self.mode == "cloud",
            "project": self.settings.GOOGLE_CLOUD_PROJECT if self.mode == "cloud" else "local_store_db"
        }

    def _load_local_data(self):
        """Loads data from seeded_store_data.json into in-memory store"""
        data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "seeded_store_data.json")
        if os.path.exists(data_path):
            with open(data_path, "r", encoding="utf-8") as f:
                self._local_db = json.load(f)
        else:
            self._local_db = {
                "store_info": {"store_id": self.settings.STORE_ID, "name": self.settings.BUSINESS_NAME},
                "suppliers": [],
                "inventory": [],
                "sales": [],
                "purchase_orders": [],
                "invoice_audits": [],
                "negotiation_proposals": [],
                "approvals": [],
                "timeline_events": [],
                "risk_events": [],
                "agent_runs": [],
                "audit_logs": []
            }
        
        # Ensure collections exist
        for col in ["agent_runs", "audit_logs"]:
            if col not in self._local_db:
                self._local_db[col] = []

    def _save_local_data(self):
        """Persists current state back to disk"""
        data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "seeded_store_data.json")
        try:
            with open(data_path, "w", encoding="utf-8") as f:
                json.dump(self._local_db, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"[PERSISTENCE ERROR] Could not save state to disk: {e}")

    # ==========================================
    # Store & Config Operations
    # ==========================================
    def get_store_info(self, store_id: str = "store_deccan_roast_01") -> Dict[str, Any]:
        return self._local_db.get("store_info", {})

    # ==========================================
    # Inventory Operations
    # ==========================================
    def get_inventory(
        self,
        store_id: str = "store_deccan_roast_01",
        category: Optional[str] = None,
        risk_level: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        items = self._local_db.get("inventory", [])
        if category and category.lower() != "all":
            items = [i for i in items if i.get("category", "").lower() == category.lower()]
        if risk_level and risk_level.lower() != "all":
            items = [i for i in items if i.get("stockout_risk", "").upper() == risk_level.upper()]
        if search:
            query = search.lower()
            items = [i for i in items if query in i.get("name", "").lower() or query in i.get("sku", "").lower()]
        return copy.deepcopy(items)

    def get_inventory_by_sku(self, store_id: str, sku: str) -> Optional[Dict[str, Any]]:
        for item in self._local_db.get("inventory", []):
            if item.get("sku") == sku:
                return copy.deepcopy(item)
        return None

    def update_inventory_stock(self, store_id: str, sku: str, new_stock: float, user_id: str = "system") -> Optional[Dict[str, Any]]:
        for item in self._local_db.get("inventory", []):
            if item.get("sku") == sku:
                old_stock = item.get("current_stock", 0.0)
                item["current_stock"] = round(new_stock, 1)
                item["updated_at"] = current_utc_time()
                
                # Recalculate days of supply & stockout risk
                d_avg = item.get("daily_usage_avg", 1.0)
                l_days = item.get("lead_time_days", 2)
                item["days_of_supply"] = round(new_stock / d_avg, 1) if d_avg > 0 else 999.0
                
                if item["days_of_supply"] <= l_days * 1.5:
                    item["stockout_risk"] = "HIGH" if item["days_of_supply"] <= l_days else "MEDIUM"
                else:
                    item["stockout_risk"] = "LOW"
                    
                self._save_local_data()
                return copy.deepcopy(item)
        return None

    def get_sales_history(self, store_id: str, sku: str, days: int = 90) -> List[Dict[str, Any]]:
        sales = [s for s in self._local_db.get("sales", []) if s.get("sku") == sku]
        # Sort descending by date and limit
        sales.sort(key=lambda x: x.get("date", ""), reverse=True)
        return copy.deepcopy(sales[:days])

    # ==========================================
    # Supplier Operations
    # ==========================================
    def get_suppliers(self, store_id: str = "store_deccan_roast_01", category: Optional[str] = None) -> List[Dict[str, Any]]:
        suppliers = self._local_db.get("suppliers", [])
        if category and category.lower() != "all":
            suppliers = [s for s in suppliers if category.lower() in [c.lower() for c in s.get("categories_supplied", [])]]
        return copy.deepcopy(suppliers)

    def get_supplier_by_id(self, supplier_id: str) -> Optional[Dict[str, Any]]:
        for s in self._local_db.get("suppliers", []):
            if s.get("supplier_id") == supplier_id:
                return copy.deepcopy(s)
        return None

    def update_supplier_performance(self, supplier_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for s in self._local_db.get("suppliers", []):
            if s.get("supplier_id") == supplier_id:
                s.setdefault("performance", {}).update(updates)
                s["updated_at"] = current_utc_time()
                self._save_local_data()
                return copy.deepcopy(s)
        return None

    # ==========================================
    # Purchase Order Operations
    # ==========================================
    def get_purchase_orders(self, store_id: str = "store_deccan_roast_01", status: Optional[str] = None) -> List[Dict[str, Any]]:
        orders = self._local_db.get("purchase_orders", [])
        if status and status.lower() != "all":
            orders = [o for o in orders if o.get("status", "").upper() == status.upper()]
        orders.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return copy.deepcopy(orders)

    def get_purchase_order_by_id(self, po_id: str) -> Optional[Dict[str, Any]]:
        for o in self._local_db.get("purchase_orders", []):
            if o.get("po_id") == po_id:
                return copy.deepcopy(o)
        return None

    def create_purchase_order(self, po_data: Dict[str, Any]) -> Dict[str, Any]:
        if "po_id" not in po_data:
            po_data["po_id"] = f"PO-{len(self._local_db.get('purchase_orders', [])) + 10024}"
        po_data.setdefault("created_at", current_utc_time())
        po_data.setdefault("updated_at", current_utc_time())
        po_data.setdefault("status", "DRAFT")
        
        self._local_db.setdefault("purchase_orders", []).append(po_data)
        self._save_local_data()
        return copy.deepcopy(po_data)

    def update_purchase_order_status(
        self,
        po_id: str,
        status: str,
        user_id: str = "system",
        verification_notes: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        for o in self._local_db.get("purchase_orders", []):
            if o.get("po_id") == po_id:
                o["status"] = status
                o["updated_at"] = current_utc_time()
                if status == "APPROVED":
                    o["approved_by"] = user_id
                    o["approved_at"] = current_utc_time()
                if verification_notes:
                    o["verification_notes"] = verification_notes
                    o["verified_at"] = current_utc_time()
                self._save_local_data()
                return copy.deepcopy(o)
        return None

    # ==========================================
    # Invoice Audit Operations
    # ==========================================
    def get_invoice_audits(self, store_id: str = "store_deccan_roast_01", status: Optional[str] = None) -> List[Dict[str, Any]]:
        audits = self._local_db.get("invoice_audits", [])
        if status and status.lower() != "all":
            audits = [a for a in audits if a.get("status", "").upper() == status.upper()]
        audits.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return copy.deepcopy(audits)

    def get_invoice_audit_by_id(self, audit_id: str) -> Optional[Dict[str, Any]]:
        for a in self._local_db.get("invoice_audits", []):
            if a.get("audit_id") == audit_id:
                return copy.deepcopy(a)
        return None

    def save_invoice_audit(self, audit_data: Dict[str, Any]) -> Dict[str, Any]:
        if "audit_id" not in audit_data:
            audit_data["audit_id"] = f"AUD-{datetime.now().year}-{len(self._local_db.get('invoice_audits', [])) + 1:03d}"
        audit_data.setdefault("created_at", current_utc_time())
        audit_data.setdefault("updated_at", current_utc_time())
        
        existing_index = next((i for i, a in enumerate(self._local_db.get("invoice_audits", [])) if a.get("audit_id") == audit_data["audit_id"]), None)
        if existing_index is not None:
            self._local_db["invoice_audits"][existing_index] = audit_data
        else:
            self._local_db.setdefault("invoice_audits", []).append(audit_data)
            
        self._save_local_data()
        return copy.deepcopy(audit_data)

    # ==========================================
    # Negotiation Proposals & Scenarios
    # ==========================================
    def get_negotiation_proposals(self, store_id: str = "store_deccan_roast_01", status: Optional[str] = None) -> List[Dict[str, Any]]:
        proposals = self._local_db.get("negotiation_proposals", [])
        if status and status.lower() != "all":
            proposals = [p for p in proposals if p.get("status", "").upper() == status.upper()]
        proposals.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return copy.deepcopy(proposals)

    def get_negotiation_proposal_by_id(self, proposal_id: str) -> Optional[Dict[str, Any]]:
        for p in self._local_db.get("negotiation_proposals", []):
            if p.get("proposal_id") == proposal_id:
                return copy.deepcopy(p)
        return None

    def save_negotiation_proposal(self, proposal_data: Dict[str, Any]) -> Dict[str, Any]:
        if "proposal_id" not in proposal_data:
            proposal_data["proposal_id"] = f"PROP-{datetime.now().year}-{len(self._local_db.get('negotiation_proposals', [])) + 1:03d}"
        proposal_data.setdefault("created_at", current_utc_time())
        proposal_data.setdefault("updated_at", current_utc_time())
        
        existing_index = next((i for i, p in enumerate(self._local_db.get("negotiation_proposals", [])) if p.get("proposal_id") == proposal_data["proposal_id"]), None)
        if existing_index is not None:
            self._local_db["negotiation_proposals"][existing_index] = proposal_data
        else:
            self._local_db.setdefault("negotiation_proposals", []).append(proposal_data)
            
        self._save_local_data()
        return copy.deepcopy(proposal_data)

    # ==========================================
    # Approval Center Operations
    # ==========================================
    def get_approvals(self, store_id: str = "store_deccan_roast_01", status: Optional[str] = None) -> List[Dict[str, Any]]:
        approvals = self._local_db.get("approvals", [])
        if status and status.lower() != "all":
            approvals = [a for a in approvals if a.get("status", "").upper() == status.upper()]
        approvals.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return copy.deepcopy(approvals)

    def get_approval_by_id(self, approval_id: str) -> Optional[Dict[str, Any]]:
        for a in self._local_db.get("approvals", []):
            if a.get("approval_id") == approval_id:
                return copy.deepcopy(a)
        return None

    def create_approval(self, approval_data: Dict[str, Any]) -> Dict[str, Any]:
        if "approval_id" not in approval_data:
            approval_data["approval_id"] = f"APPR-{datetime.now().year}-{len(self._local_db.get('approvals', [])) + 1:03d}"
        approval_data.setdefault("created_at", current_utc_time())
        approval_data.setdefault("updated_at", current_utc_time())
        approval_data.setdefault("status", "PENDING")
        
        self._local_db.setdefault("approvals", []).append(approval_data)
        self._save_local_data()
        return copy.deepcopy(approval_data)

    def update_approval_status(
        self,
        approval_id: str,
        status: str,
        user_id: str,
        user_name: str = "Arjun Rao",
        decision_reason: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        for a in self._local_db.get("approvals", []):
            if a.get("approval_id") == approval_id:
                a["previous_state"] = a.get("status")
                a["status"] = status
                a["new_state"] = status
                a["decided_by_uid"] = user_id
                a["decided_by_name"] = user_name
                a["decided_at"] = current_utc_time()
                a["decision_reason"] = decision_reason or f"Action {status.lower()} by authorized manager."
                a["updated_at"] = current_utc_time()
                self._save_local_data()
                return copy.deepcopy(a)
        return None

    # ==========================================
    # Timeline & Risk Events
    # ==========================================
    def get_timeline_events(self, store_id: str = "store_deccan_roast_01", limit: int = 50) -> List[Dict[str, Any]]:
        events = self._local_db.get("timeline_events", [])
        events.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return copy.deepcopy(events[:limit])

    def add_timeline_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        if "event_id" not in event_data:
            now_dt = datetime.now()
            event_data["event_id"] = f"EVT-{now_dt.strftime('%H%M%S')}"
            event_data.setdefault("timestamp_display", now_dt.strftime("%I:%M %p"))
        event_data.setdefault("created_at", current_utc_time())
        self._local_db.setdefault("timeline_events", []).insert(0, event_data)
        self._save_local_data()
        return copy.deepcopy(event_data)

    def get_risk_events(self, store_id: str = "store_deccan_roast_01", is_resolved: Optional[bool] = None) -> List[Dict[str, Any]]:
        events = self._local_db.get("risk_events", [])
        if is_resolved is not None:
            events = [e for e in events if e.get("is_resolved") == is_resolved]
        events.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return copy.deepcopy(events)

    def add_risk_event(self, risk_data: Dict[str, Any]) -> Dict[str, Any]:
        if "event_id" not in risk_data:
            risk_data["event_id"] = f"RSK-{len(self._local_db.get('risk_events', [])) + 1:03d}"
        risk_data.setdefault("created_at", current_utc_time())
        self._local_db.setdefault("risk_events", []).insert(0, risk_data)
        self._save_local_data()
        return copy.deepcopy(risk_data)

    # ==========================================
    # Agent Runs & Inspector Telemetry
    # ==========================================
    def get_agent_runs(self, store_id: str = "store_deccan_roast_01", limit: int = 20) -> List[Dict[str, Any]]:
        runs = self._local_db.get("agent_runs", [])
        runs.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return copy.deepcopy(runs[:limit])

    def get_agent_run_by_id(self, run_id: str) -> Optional[Dict[str, Any]]:
        for r in self._local_db.get("agent_runs", []):
            if r.get("run_id") == run_id:
                return copy.deepcopy(r)
        return None

    def save_agent_run(self, run_data: Dict[str, Any]) -> Dict[str, Any]:
        if "run_id" not in run_data:
            run_data["run_id"] = f"RUN-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        run_data.setdefault("created_at", current_utc_time())
        run_data.setdefault("updated_at", current_utc_time())
        
        existing_index = next((i for i, r in enumerate(self._local_db.get("agent_runs", [])) if r.get("run_id") == run_data["run_id"]), None)
        if existing_index is not None:
            self._local_db["agent_runs"][existing_index] = run_data
        else:
            self._local_db.setdefault("agent_runs", []).insert(0, run_data)
            
        self._save_local_data()
        return copy.deepcopy(run_data)

_service_instance = None

def get_firestore_service() -> DualModeFirestoreService:
    global _service_instance
    if _service_instance is None:
        _service_instance = DualModeFirestoreService()
    return _service_instance

def reset_firestore_service():
    """Resets the singleton instance for deterministic test isolation"""
    global _service_instance
    _service_instance = None
