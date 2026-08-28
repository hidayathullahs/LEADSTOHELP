"""
LEADSTOHELP AI - Supply Chain What-If Digital Twin Simulator
Deterministic engine that recalculates supply chain metrics under parameter modifications.
All calculations are pure math — Gemini is NEVER used for numerical computation.
"""

from typing import Dict, Any, List, Optional
from ..engines.inventory_engine import (
    calculate_days_of_supply,
    calculate_recommended_order_quantity,
    calculate_safety_stock,
    calculate_reorder_point,
)
from ..engines.simulator_engine import simulate_procurement_scenarios


def run_whatif_simulation(
    sku: str,
    inventory_item: Dict[str, Any],
    suppliers: List[Dict[str, Any]],
    scenario_params: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Runs a What-If simulation comparing baseline vs. modified scenario.
    
    Parameters:
    - demand_change_pct: % change in daily usage (e.g., +10 = 10% increase)
    - supplier_delay_days: additional days added to lead times
    - price_change_pct: % change in supplier prices
    - stock_reduction_units: units removed from current stock
    - supplier_unavailable: supplier_id to remove from available pool
    - emergency_delivery_enabled: allow expedited delivery options
    """
    current_stock = inventory_item.get("current_stock", 0.0)
    daily_usage = inventory_item.get("daily_usage_avg", 5.0)
    daily_std = inventory_item.get("daily_usage_std", 2.0)
    lead_time = inventory_item.get("lead_time_days", 2)
    safety_stock = inventory_item.get("safety_stock", 20.0)
    reorder_point = inventory_item.get("reorder_point", 41.5)

    # ---- BASELINE CALCULATION ----
    baseline_dos = calculate_days_of_supply(current_stock, daily_usage)
    baseline_safety = calculate_safety_stock(daily_std, lead_time)
    baseline_rop = calculate_reorder_point(daily_usage, lead_time, baseline_safety)
    baseline_order_qty = calculate_recommended_order_quantity(
        current_stock, baseline_rop, daily_usage
    )
    baseline_cost = _estimate_procurement_cost(sku, baseline_order_qty, suppliers)
    baseline_risk = _calculate_risk_score(baseline_dos, lead_time, current_stock, safety_stock)
    baseline_concentration = _supplier_concentration(suppliers)

    baseline = {
        "days_of_supply": baseline_dos,
        "safety_stock": baseline_safety,
        "reorder_point": baseline_rop,
        "recommended_order_qty": baseline_order_qty,
        "estimated_cost_inr": baseline_cost,
        "risk_score": baseline_risk,
        "supplier_concentration_pct": baseline_concentration,
        "daily_usage": daily_usage,
        "current_stock": current_stock,
        "lead_time_days": lead_time,
    }

    # ---- SCENARIO MODIFICATIONS ----
    demand_change_pct = scenario_params.get("demand_change_pct", 0.0)
    supplier_delay_days = scenario_params.get("supplier_delay_days", 0.0)
    price_change_pct = scenario_params.get("price_change_pct", 0.0)
    stock_reduction = scenario_params.get("stock_reduction_units", 0.0)
    supplier_unavailable = scenario_params.get("supplier_unavailable", None)
    emergency_enabled = scenario_params.get("emergency_delivery_enabled", False)

    mod_daily_usage = daily_usage * (1 + demand_change_pct / 100.0)
    mod_stock = max(0.0, current_stock - stock_reduction)
    mod_lead_time = max(1, lead_time + int(supplier_delay_days))

    # Filter out unavailable supplier
    mod_suppliers = suppliers
    if supplier_unavailable:
        mod_suppliers = [s for s in suppliers if s.get("supplier_id") != supplier_unavailable]

    # Emergency delivery cuts lead time by half (minimum 1 day)
    if emergency_enabled:
        mod_lead_time = max(1, mod_lead_time // 2)

    mod_dos = calculate_days_of_supply(mod_stock, mod_daily_usage)
    mod_safety = calculate_safety_stock(daily_std, mod_lead_time)
    mod_rop = calculate_reorder_point(mod_daily_usage, mod_lead_time, mod_safety)
    mod_order_qty = calculate_recommended_order_quantity(
        mod_stock, mod_rop, mod_daily_usage
    )
    mod_base_cost = _estimate_procurement_cost(sku, mod_order_qty, mod_suppliers)
    mod_cost = mod_base_cost * (1 + price_change_pct / 100.0)
    mod_risk = _calculate_risk_score(mod_dos, mod_lead_time, mod_stock, mod_safety)
    mod_concentration = _supplier_concentration(mod_suppliers)

    modified = {
        "days_of_supply": round(mod_dos, 1),
        "safety_stock": round(mod_safety, 1),
        "reorder_point": round(mod_rop, 1),
        "recommended_order_qty": round(mod_order_qty, 1),
        "estimated_cost_inr": round(mod_cost, 2),
        "risk_score": round(mod_risk, 1),
        "supplier_concentration_pct": round(mod_concentration, 1),
        "daily_usage": round(mod_daily_usage, 1),
        "current_stock": round(mod_stock, 1),
        "lead_time_days": mod_lead_time,
    }

    # ---- GENERATE RECOMMENDATION ----
    risk_delta = mod_risk - baseline_risk
    cost_delta = mod_cost - baseline_cost
    recommendation = _generate_recommendation(
        baseline, modified, risk_delta, cost_delta, scenario_params
    )

    return {
        "sku": sku,
        "product_name": inventory_item.get("name", sku),
        "scenario_params": scenario_params,
        "baseline": baseline,
        "modified": modified,
        "risk_delta": round(risk_delta, 1),
        "cost_delta": round(cost_delta, 2),
        "recommendation": recommendation,
    }


def _estimate_procurement_cost(
    sku: str, quantity: float, suppliers: List[Dict[str, Any]]
) -> float:
    """Estimates lowest available procurement cost for a given quantity."""
    best_price = 950.0  # fallback
    for s in suppliers:
        for cat_item in s.get("catalog", []):
            if cat_item.get("sku") == sku:
                price = cat_item.get("base_unit_price", 950.0)
                for tier in cat_item.get("volume_discount_tiers", []):
                    if quantity >= tier.get("min_quantity", 0):
                        price = min(price, tier.get("discounted_unit_price", price))
                best_price = min(best_price, price)
    return round(best_price * quantity, 2)


def _calculate_risk_score(
    days_of_supply: float, lead_time: int, current_stock: float, safety_stock: float
) -> float:
    """Composite risk score 0-100. Higher = more risk."""
    score = 0.0
    # Stockout proximity risk (0-50)
    if days_of_supply <= 1:
        score += 50.0
    elif days_of_supply <= lead_time:
        score += 40.0
    elif days_of_supply <= lead_time * 2:
        score += 25.0
    elif days_of_supply <= 7:
        score += 10.0

    # Safety stock breach risk (0-30)
    if current_stock < safety_stock * 0.5:
        score += 30.0
    elif current_stock < safety_stock:
        score += 20.0
    elif current_stock < safety_stock * 1.5:
        score += 10.0

    # Lead time risk (0-20)
    if lead_time >= 7:
        score += 20.0
    elif lead_time >= 4:
        score += 10.0
    elif lead_time >= 2:
        score += 5.0

    return min(100.0, score)


def _supplier_concentration(suppliers: List[Dict[str, Any]]) -> float:
    """Herfindahl-style concentration: 100% = single supplier, lower = diversified."""
    n = len(suppliers)
    if n <= 1:
        return 100.0
    # Simplified: equal-share model
    share = 100.0 / n
    hhi = sum((share ** 2) for _ in range(n))
    return round(hhi / 100.0, 1)


def _generate_recommendation(
    baseline: Dict, modified: Dict, risk_delta: float, cost_delta: float,
    params: Dict[str, Any]
) -> str:
    """Generates a deterministic natural-language recommendation based on metric deltas."""
    parts = []

    if modified["days_of_supply"] < 2:
        parts.append(
            f"CRITICAL: Stock will last only {modified['days_of_supply']} days under this scenario. "
            f"Immediate replenishment action required."
        )
    elif modified["days_of_supply"] < baseline["days_of_supply"]:
        parts.append(
            f"Stock coverage drops from {baseline['days_of_supply']} to {modified['days_of_supply']} days."
        )

    if risk_delta > 20:
        parts.append("Risk score increases significantly. Consider split-order contingency.")
    elif risk_delta > 10:
        parts.append("Moderate risk increase. Monitor closely and prepare backup supplier.")

    if cost_delta > 0:
        parts.append(f"Procurement cost increases by INR {cost_delta:,.2f}.")

    if params.get("supplier_unavailable"):
        parts.append("Supplier removed from pool. Activate backup supplier protocol.")

    if params.get("emergency_delivery_enabled"):
        parts.append("Emergency delivery halves lead time but may increase unit cost.")

    if not parts:
        parts.append("Scenario impact is minimal. Current strategy remains optimal.")

    return " ".join(parts)
