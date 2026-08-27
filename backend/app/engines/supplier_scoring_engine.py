"""
LEADSTOHELP AI - Continuous Supplier Reliability Scoring Engine
Calculates multi-variate reliability ratings from real application events.
"""

from typing import Dict, Any

def calculate_supplier_reliability(
    on_time_delivery_rate: float,
    invoice_accuracy_rate: float,
    fulfillment_rate: float,
    price_stability_rate: float,
    avg_response_time_min: float,
    discrepancy_rate: float = 0.0
) -> float:
    """
    Computes a grounded 0-100 reliability score:
      • On-time delivery: 30%
      • Invoice accuracy: 25%
      • Order fulfillment: 20%
      • Price stability: 15%
      • Response time factor: 10%
      • Discrepancy penalty deduction
    """
    # Normalize response time: 0-15m = 100%, 15-30m = 90%, 30-60m = 75%, 60m+ = 50%
    if avg_response_time_min <= 15.0:
        response_score = 100.0
    elif avg_response_time_min <= 30.0:
        response_score = 90.0
    elif avg_response_time_min <= 60.0:
        response_score = 75.0
    else:
        response_score = max(40.0, 100.0 - (avg_response_time_min * 0.6))

    weighted_score = (
        (0.30 * min(100.0, on_time_delivery_rate)) +
        (0.25 * min(100.0, invoice_accuracy_rate)) +
        (0.20 * min(100.0, fulfillment_rate)) +
        (0.15 * min(100.0, price_stability_rate)) +
        (0.10 * response_score)
    )
    
    # Apply discrepancy penalty
    penalty = min(15.0, discrepancy_rate * 1.2)
    final_score = max(0.0, min(100.0, weighted_score - penalty))
    return round(final_score, 1)
