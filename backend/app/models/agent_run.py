from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from .common import BaseAuditModel

class AgentType(str, Enum):
    ORCHESTRATOR = "ORCHESTRATOR"
    INVENTORY = "INVENTORY"
    PROCUREMENT = "PROCUREMENT"
    INVOICE_AUDITOR = "INVOICE_AUDITOR"
    NEGOTIATION = "NEGOTIATION"
    VERIFICATION = "VERIFICATION"

class ToolExecutionLog(BaseModel):
    tool_name: str
    tool_input: Dict[str, Any]
    tool_output: Dict[str, Any]
    duration_ms: float
    status: str = "SUCCESS"
    error_message: Optional[str] = None
    executed_at: str

class AgentStep(BaseModel):
    step_number: int
    agent_name: str
    action_type: str  # "THINKING", "TOOL_CALL", "REASONING", "DISPATCH", "PROPOSAL", "VERIFICATION"
    content: str
    tool_calls: List[ToolExecutionLog] = Field(default_factory=list)
    timestamp: str

class AgentRun(BaseAuditModel):
    run_id: str
    store_id: str
    user_id: str = "user_demo"
    user_prompt: str
    primary_intent: str
    status: str = "RUNNING"  # "RUNNING", "COMPLETED", "AWAITING_APPROVAL", "FAILED"
    
    agents_involved: List[str] = Field(default_factory=list)
    steps: List[AgentStep] = Field(default_factory=list)
    
    final_response: Optional[str] = None
    recommendation_summary: Optional[str] = None
    generated_proposal_id: Optional[str] = None
    generated_approval_id: Optional[str] = None
    
    total_duration_ms: float = 0.0
    tokens_used: int = 0
    is_safe: bool = True

class TimelineEvent(BaseAuditModel):
    event_id: str
    store_id: str
    timestamp_display: str  # e.g. "09:14 AM"
    stage: str  # "DETECT", "INVESTIGATE", "PREDICT", "SIMULATE", "RECOMMEND", "NEGOTIATE", "APPROVAL", "EXECUTE", "VERIFY", "LEARN"
    agent: str
    title: str
    description: str
    badge_type: str = "cyan"  # "emerald", "cyan", "amber", "rose", "indigo"
    entity_id: Optional[str] = None
    entity_type: Optional[str] = None
