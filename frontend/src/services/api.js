/**
 * LEADSTOHELP AI - Frontend API Client
 * Connects to FastAPI Backend with local fallback capabilities.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';
const DEV_TOKEN = 'Bearer dev_jwt_secret_leadstohelp_change_in_production';

async function request(endpoint, options = {}) {
  const headers = {
    'Authorization': DEV_TOKEN,
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Overview & Metrics
  getOverview: () => request('/api/overview'),
  
  // Inventory
  getInventory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/inventory${query ? `?${query}` : ''}`);
  },
  getInventoryItem: (sku) => request(`/api/inventory/${sku}`),
  adjustStock: (sku, newStock, reason) => request(`/api/inventory/${sku}/adjust`, {
    method: 'POST',
    body: JSON.stringify({ new_stock: newStock, reason })
  }),

  // Suppliers
  getSuppliers: (category) => request(`/api/suppliers${category ? `?category=${category}` : ''}`),
  getSupplier: (id) => request(`/api/suppliers/${id}`),

  // Procurement & Simulation
  simulateProcurement: (sku, quantity) => {
    const query = new URLSearchParams({ sku, ...(quantity ? { quantity } : {}) }).toString();
    return request(`/api/procurement/simulate?${query}`);
  },
  getProposals: (status) => request(`/api/procurement/proposals${status ? `?status=${status}` : ''}`),
  createProposal: (sku, targetScenarioId, quantity) => request('/api/procurement/proposals', {
    method: 'POST',
    body: JSON.stringify({ sku, target_scenario_id: targetScenarioId, quantity })
  }),

  // Purchase Orders
  getPurchaseOrders: (status) => request(`/api/purchase-orders${status ? `?status=${status}` : ''}`),
  getPurchaseOrder: (id) => request(`/api/purchase-orders/${id}`),
  verifyPurchaseOrder: (id, receivedQuantity, notes) => request(`/api/purchase-orders/${id}/verify`, {
    method: 'POST',
    body: JSON.stringify({ received_quantity: receivedQuantity, notes })
  }),
  recoverSupplierFailure: (id, failedSupplierId, reason) => request(`/api/purchase-orders/${id}/fail-recovery`, {
    method: 'POST',
    body: JSON.stringify({ failed_supplier_id: failedSupplierId, reason })
  }),

  // Invoice Audits
  getInvoiceAudits: (status) => request(`/api/invoices/audits${status ? `?status=${status}` : ''}`),
  getInvoiceAudit: (id) => request(`/api/invoices/audits/${id}`),
  auditInvoiceUpload: (formData) => request('/api/invoices/audit-upload', {
    method: 'POST',
    body: formData
  }),

  // Approvals & Governance
  getApprovals: (status) => request(`/api/approvals${status ? `?status=${status}` : ''}`),
  submitApprovalDecision: (id, decision, reason) => request(`/api/approvals/${id}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decision, reason })
  }),

  // Risk Radar & Telemetry
  getRiskRadar: () => request('/api/risk-radar'),
  getTimeline: (limit = 50) => request(`/api/timeline?limit=${limit}`),
  getAgentRuns: (limit = 20) => request(`/api/agent-runs?limit=${limit}`),
  getAgentRun: (id) => request(`/api/agent-runs/${id}`),

  // Master AI Agent
  askAgent: (prompt, sku, context) => request('/api/agent/ask', {
    method: 'POST',
    body: JSON.stringify({ prompt, sku, context })
  })
};
