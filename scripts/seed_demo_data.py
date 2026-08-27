"""
LEADSTOHELP AI - High-Fidelity Synthetic Data Generator & Seeding Engine
Generates 65+ realistic SKUs, 10 suppliers, 90-day sales history, active POs, 
audit cases, and risk events for 'Deccan Roast Specialty Coffee & Bakery' (Bengaluru, India).
"""

import json
import os
import random
from datetime import datetime, timedelta, timezone

def generate_seed_data():
    random.seed(42)  # Deterministic seed for reproducible testing
    now = datetime.now(timezone.utc)
    
    store_id = "store_deccan_roast_01"
    store_info = {
        "store_id": store_id,
        "name": "Deccan Roast Specialty Coffee & Bakery",
        "category": "Café & Artisanal Bakery",
        "city": "Bengaluru",
        "state": "Karnataka",
        "country": "India",
        "currency": "INR",
        "timezone": "Asia/Kolkata",
        "created_at": (now - timedelta(days=120)).isoformat(),
        "manager_name": "Arjun Rao",
        "manager_email": "ops@deccanroast.in",
        "monthly_procurement_budget": 850000.0,
        "current_month_spend": 512000.0,
    }

    # 10 Detailed Suppliers
    suppliers = [
        {
            "supplier_id": "sup_01",
            "name": "Metro Wholesale Hub",
            "contact_person": "Vikram Sethi",
            "email": "orders@metrowholesale.in",
            "phone": "+91 98801 23456",
            "address": "Plot 42, Yeshwanthpur Industrial Area",
            "city": "Bengaluru",
            "state": "Karnataka",
            "gstin": "29AABCM1234F1Z8",
            "payment_terms": "Net 15 Days",
            "categories_supplied": ["Coffee", "Dairy", "Bakery Ingredients", "Syrups"],
            "performance": {
                "reliability_score": 91.0,
                "on_time_delivery_rate": 96.0,
                "invoice_accuracy_rate": 94.0,
                "price_stability_rate": 88.0,
                "fulfillment_rate": 98.0,
                "avg_response_time_min": 14.0,
                "discrepancy_rate": 4.5,
                "historical_negotiated_savings": 48500.0,
                "total_orders_completed": 86
            },
            "risk_level": "LOW",
            "is_active": True,
            "is_preferred": True
        },
        {
            "supplier_id": "sup_02",
            "name": "Malnad Coffee Planters Direct",
            "contact_person": "Chethan Gowda",
            "email": "sales@malnadplanters.com",
            "phone": "+91 94481 77654",
            "address": "Estate Rd 4, Chikmagalur",
            "city": "Chikmagalur",
            "state": "Karnataka",
            "gstin": "29AAECM5542G1ZP",
            "payment_terms": "Net 30 Days",
            "categories_supplied": ["Coffee"],
            "performance": {
                "reliability_score": 94.5,
                "on_time_delivery_rate": 92.0,
                "invoice_accuracy_rate": 97.0,
                "price_stability_rate": 95.0,
                "fulfillment_rate": 99.0,
                "avg_response_time_min": 35.0,
                "discrepancy_rate": 2.0,
                "historical_negotiated_savings": 62000.0,
                "total_orders_completed": 44
            },
            "risk_level": "LOW",
            "is_active": True,
            "is_preferred": True
        },
        {
            "supplier_id": "sup_03",
            "name": "Kaveri Organic Dairy Co-op",
            "contact_person": "Ramesh Kumar",
            "email": "supply@kaveridairy.org",
            "phone": "+91 97420 11223",
            "address": "Kanakapura Main Road",
            "city": "Bengaluru",
            "state": "Karnataka",
            "gstin": "29AABCK8891D1ZQ",
            "payment_terms": "Weekly",
            "categories_supplied": ["Dairy"],
            "performance": {
                "reliability_score": 87.0,
                "on_time_delivery_rate": 89.0,
                "invoice_accuracy_rate": 91.0,
                "price_stability_rate": 92.0,
                "fulfillment_rate": 95.0,
                "avg_response_time_min": 20.0,
                "discrepancy_rate": 6.0,
                "historical_negotiated_savings": 22400.0,
                "total_orders_completed": 112
            },
            "risk_level": "MEDIUM",
            "is_active": True,
            "is_preferred": True
        },
        {
            "supplier_id": "sup_04",
            "name": "Bangalore Eco-Packaging Ltd",
            "contact_person": "Ananya Sharma",
            "email": "orders@bengalurupack.in",
            "phone": "+91 99002 88441",
            "address": "Peenya 2nd Stage",
            "city": "Bengaluru",
            "state": "Karnataka",
            "gstin": "29AACBP4419E1Z4",
            "payment_terms": "Net 30 Days",
            "categories_supplied": ["Packaging"],
            "performance": {
                "reliability_score": 83.0,
                "on_time_delivery_rate": 81.0,
                "invoice_accuracy_rate": 93.0,
                "price_stability_rate": 84.0,
                "fulfillment_rate": 92.0,
                "avg_response_time_min": 45.0,
                "discrepancy_rate": 5.5,
                "historical_negotiated_savings": 31000.0,
                "total_orders_completed": 38
            },
            "risk_level": "MEDIUM",
            "is_active": True,
            "is_preferred": False
        },
        {
            "supplier_id": "sup_05",
            "name": "Deccan Milling & Flours",
            "contact_person": "Praveen Rao",
            "email": "sales@deccanmilling.com",
            "phone": "+91 98450 99881",
            "address": "Old Madras Road, KR Puram",
            "city": "Bengaluru",
            "state": "Karnataka",
            "gstin": "29AABCD9910H1ZR",
            "payment_terms": "Net 15 Days",
            "categories_supplied": ["Bakery Ingredients"],
            "performance": {
                "reliability_score": 90.0,
                "on_time_delivery_rate": 94.0,
                "invoice_accuracy_rate": 96.0,
                "price_stability_rate": 90.0,
                "fulfillment_rate": 97.0,
                "avg_response_time_min": 25.0,
                "discrepancy_rate": 3.0,
                "historical_negotiated_savings": 19500.0,
                "total_orders_completed": 52
            },
            "risk_level": "LOW",
            "is_active": True,
            "is_preferred": True
        },
        {
            "supplier_id": "sup_06",
            "name": "Nilgiri Tea & Botanicals",
            "contact_person": "Madhavan Nair",
            "email": "madhavan@nilgiritea.in",
            "phone": "+91 94433 11880",
            "address": "Coonoor Tea Board Rd",
            "city": "Coonoor",
            "state": "Tamil Nadu",
            "gstin": "33AABCN7761J1ZV",
            "payment_terms": "Net 30 Days",
            "categories_supplied": ["Tea"],
            "performance": {
                "reliability_score": 93.0,
                "on_time_delivery_rate": 95.0,
                "invoice_accuracy_rate": 98.0,
                "price_stability_rate": 96.0,
                "fulfillment_rate": 98.0,
                "avg_response_time_min": 30.0,
                "discrepancy_rate": 1.5,
                "historical_negotiated_savings": 14000.0,
                "total_orders_completed": 29
            },
            "risk_level": "LOW",
            "is_active": True,
            "is_preferred": True
        },
        {
            "supplier_id": "sup_07",
            "name": "Spices & Aromas Karnataka",
            "contact_person": "Sunita Patil",
            "email": "sunita@spiceskarnataka.com",
            "phone": "+91 98860 33412",
            "address": "APMC Yard, Hubli",
            "city": "Hubli",
            "state": "Karnataka",
            "gstin": "29AAHCS2198B1ZN",
            "payment_terms": "Net 15 Days",
            "categories_supplied": ["Syrups", "Spices"],
            "performance": {
                "reliability_score": 79.0,
                "on_time_delivery_rate": 78.0,
                "invoice_accuracy_rate": 86.0,
                "price_stability_rate": 77.0,
                "fulfillment_rate": 88.0,
                "avg_response_time_min": 65.0,
                "discrepancy_rate": 9.0,
                "historical_negotiated_savings": 18500.0,
                "total_orders_completed": 31
            },
            "risk_level": "HIGH",
            "is_active": True,
            "is_preferred": False
        },
        {
            "supplier_id": "sup_08",
            "name": "Coorg Heritage Coffee Estate",
            "contact_person": "Bopanna Cariappa",
            "email": "bopanna@coorgheritage.in",
            "phone": "+91 94800 66219",
            "address": "Suntikoppa Estate",
            "city": "Madikeri",
            "state": "Karnataka",
            "gstin": "29AAHCC8810K1ZS",
            "payment_terms": "Advance 20% / Net 15",
            "categories_supplied": ["Coffee"],
            "performance": {
                "reliability_score": 88.5,
                "on_time_delivery_rate": 90.0,
                "invoice_accuracy_rate": 92.0,
                "price_stability_rate": 89.0,
                "fulfillment_rate": 96.0,
                "avg_response_time_min": 40.0,
                "discrepancy_rate": 4.0,
                "historical_negotiated_savings": 29000.0,
                "total_orders_completed": 35
            },
            "risk_level": "LOW",
            "is_active": True,
            "is_preferred": False
        },
        {
            "supplier_id": "sup_09",
            "name": "Southern Dairy Fresh",
            "contact_person": "Girish V",
            "email": "girish@southerndairy.co.in",
            "phone": "+91 97311 44556",
            "address": "Hosur Road, Electronic City",
            "city": "Bengaluru",
            "state": "Karnataka",
            "gstin": "29AABCS3321L1ZW",
            "payment_terms": "Weekly",
            "categories_supplied": ["Dairy"],
            "performance": {
                "reliability_score": 82.0,
                "on_time_delivery_rate": 84.0,
                "invoice_accuracy_rate": 87.0,
                "price_stability_rate": 85.0,
                "fulfillment_rate": 90.0,
                "avg_response_time_min": 22.0,
                "discrepancy_rate": 7.5,
                "historical_negotiated_savings": 16000.0,
                "total_orders_completed": 78
            },
            "risk_level": "MEDIUM",
            "is_active": True,
            "is_preferred": False
        },
        {
            "supplier_id": "sup_10",
            "name": "GreenLeaf Packaging & Containers",
            "contact_person": "Tanya Varma",
            "email": "orders@greenleafpack.in",
            "phone": "+91 99450 77112",
            "address": "Bommasandra Industrial Area",
            "city": "Bengaluru",
            "state": "Karnataka",
            "gstin": "29AACCG9901M1ZT",
            "payment_terms": "Net 30 Days",
            "categories_supplied": ["Packaging"],
            "performance": {
                "reliability_score": 92.0,
                "on_time_delivery_rate": 95.0,
                "invoice_accuracy_rate": 97.0,
                "price_stability_rate": 93.0,
                "fulfillment_rate": 97.0,
                "avg_response_time_min": 18.0,
                "discrepancy_rate": 2.5,
                "historical_negotiated_savings": 37500.0,
                "total_orders_completed": 64
            },
            "risk_level": "LOW",
            "is_active": True,
            "is_preferred": True
        }
    ]

    # Supplier Catalog definition with Volume Discounts
    supplier_catalogs = {
        "sup_01": [ # Metro Wholesale
            {"sku": "COFFEE-001", "product_name": "Specialty Arabica Coffee Beans (AAA Grade)", "category": "Coffee", "unit": "kg", "base_unit_price": 950.0, "lead_time_days": 2, "min_order_qty": 20, "in_stock_quantity": 800, "volume_discount_tiers": [{"min_quantity": 50, "discount_percentage": 5.0, "discounted_unit_price": 902.5}, {"min_quantity": 100, "discount_percentage": 7.5, "discounted_unit_price": 878.75}, {"min_quantity": 250, "discount_percentage": 10.0, "discounted_unit_price": 855.0}]},
            {"sku": "DAIRY-001", "product_name": "Pasteurized Full Cream Barista Milk", "category": "Dairy", "unit": "litres", "base_unit_price": 68.0, "lead_time_days": 1, "min_order_qty": 30, "in_stock_quantity": 1500, "volume_discount_tiers": [{"min_quantity": 100, "discount_percentage": 4.0, "discounted_unit_price": 65.28}, {"min_quantity": 300, "discount_percentage": 7.0, "discounted_unit_price": 63.24}]},
            {"sku": "SYRUP-001", "product_name": "Madagascar Vanilla Syrup 750ml", "category": "Syrups", "unit": "bottles", "base_unit_price": 540.0, "lead_time_days": 2, "min_order_qty": 6, "in_stock_quantity": 120, "volume_discount_tiers": [{"min_quantity": 24, "discount_percentage": 8.0, "discounted_unit_price": 496.8}]},
            {"sku": "FLOUR-001", "product_name": "Organic Unbleached Bread Flour (T55)", "category": "Bakery Ingredients", "unit": "kg", "base_unit_price": 85.0, "lead_time_days": 2, "min_order_qty": 50, "in_stock_quantity": 2000, "volume_discount_tiers": [{"min_quantity": 200, "discount_percentage": 6.0, "discounted_unit_price": 79.9}]}
        ],
        "sup_02": [ # Malnad Coffee Direct
            {"sku": "COFFEE-001", "product_name": "Specialty Arabica Coffee Beans (AAA Grade)", "category": "Coffee", "unit": "kg", "base_unit_price": 920.0, "lead_time_days": 4, "min_order_qty": 40, "in_stock_quantity": 1200, "volume_discount_tiers": [{"min_quantity": 80, "discount_percentage": 6.0, "discounted_unit_price": 864.8}, {"min_quantity": 200, "discount_percentage": 9.0, "discounted_unit_price": 837.2}]},
            {"sku": "COFFEE-002", "product_name": "Monsooned Malabar Robusta Blend", "category": "Coffee", "unit": "kg", "base_unit_price": 680.0, "lead_time_days": 4, "min_order_qty": 30, "in_stock_quantity": 900, "volume_discount_tiers": [{"min_quantity": 50, "discount_percentage": 5.0, "discounted_unit_price": 646.0}]}
        ],
        "sup_08": [ # Coorg Heritage
            {"sku": "COFFEE-001", "product_name": "Specialty Arabica Coffee Beans (AAA Grade)", "category": "Coffee", "unit": "kg", "base_unit_price": 970.0, "lead_time_days": 1, "min_order_qty": 20, "in_stock_quantity": 500, "volume_discount_tiers": [{"min_quantity": 50, "discount_percentage": 4.0, "discounted_unit_price": 931.2}]}
        ],
        "sup_03": [ # Kaveri Dairy
            {"sku": "DAIRY-001", "product_name": "Pasteurized Full Cream Barista Milk", "category": "Dairy", "unit": "litres", "base_unit_price": 64.0, "lead_time_days": 1, "min_order_qty": 50, "in_stock_quantity": 2000, "volume_discount_tiers": [{"min_quantity": 200, "discount_percentage": 5.0, "discounted_unit_price": 60.8}]},
            {"sku": "DAIRY-002", "product_name": "Unsalted Artisanal Butter 82% Fat", "category": "Dairy", "unit": "kg", "base_unit_price": 460.0, "lead_time_days": 1, "min_order_qty": 10, "in_stock_quantity": 400, "volume_discount_tiers": [{"min_quantity": 30, "discount_percentage": 4.0, "discounted_unit_price": 441.6}]}
        ],
        "sup_10": [ # GreenLeaf Packaging
            {"sku": "PACK-001", "product_name": "12oz Double Wall Kraft Coffee Cups", "category": "Packaging", "unit": "packets", "base_unit_price": 340.0, "lead_time_days": 2, "min_order_qty": 10, "in_stock_quantity": 800, "volume_discount_tiers": [{"min_quantity": 50, "discount_percentage": 8.0, "discounted_unit_price": 312.8}]},
            {"sku": "PACK-002", "product_name": "Bio-Compostable Sip Lids 90mm", "category": "Packaging", "unit": "packets", "base_unit_price": 190.0, "lead_time_days": 2, "min_order_qty": 10, "in_stock_quantity": 1100, "volume_discount_tiers": [{"min_quantity": 50, "discount_percentage": 6.0, "discounted_unit_price": 178.6}]}
        ]
    }

    # Attach catalogs to supplier objects
    for s in suppliers:
        s["catalog"] = supplier_catalogs.get(s["supplier_id"], [])

    # Master SKU definitions (65 SKUs across 6 categories)
    raw_sku_templates = [
        # Coffee (7 SKUs)
        ("COFFEE-001", "Specialty Arabica Coffee Beans (AAA Grade)", "Coffee", "kg", 950.0, 1600.0, 36.0, 13.0, 2.5, 2, "sup_01", "sup_02"),
        ("COFFEE-002", "Monsooned Malabar Robusta Blend", "Coffee", "kg", 680.0, 1100.0, 75.0, 8.0, 1.8, 4, "sup_02", "sup_01"),
        ("COFFEE-003", "Decaf Swiss Water Process Beans", "Coffee", "kg", 1150.0, 1950.0, 18.0, 2.2, 0.6, 3, "sup_01", "sup_08"),
        ("COFFEE-004", "Single Origin Ethiopian Yirgacheffe", "Coffee", "kg", 1850.0, 2900.0, 12.0, 1.5, 0.4, 4, "sup_01", "sup_02"),
        ("COFFEE-005", "Cold Brew Coarse Ground Blend", "Coffee", "kg", 820.0, 1350.0, 42.0, 6.0, 1.2, 2, "sup_01", "sup_02"),
        ("COFFEE-006", "Estate Espresso Dark Roast Blend", "Coffee", "kg", 760.0, 1250.0, 88.0, 11.0, 2.0, 2, "sup_01", "sup_08"),
        ("COFFEE-007", "Cascara Coffee Cherry Tea", "Coffee", "kg", 620.0, 1100.0, 15.0, 0.8, 0.3, 4, "sup_02", "sup_01"),
        
        # Dairy & Milks (8 SKUs)
        ("DAIRY-001", "Pasteurized Full Cream Barista Milk", "Dairy", "litres", 68.0, 95.0, 45.0, 35.0, 5.0, 1, "sup_01", "sup_03"),
        ("DAIRY-002", "Unsalted Artisanal Butter 82% Fat", "Dairy", "kg", 460.0, 650.0, 22.0, 4.5, 1.0, 1, "sup_03", "sup_01"),
        ("DAIRY-003", "Barista Edition Oat Milk (Gluten Free)", "Dairy", "litres", 240.0, 380.0, 38.0, 9.0, 1.8, 2, "sup_01", "sup_03"),
        ("DAIRY-004", "Unsweetened Almond Milk", "Dairy", "litres", 210.0, 340.0, 26.0, 5.0, 1.1, 2, "sup_01", "sup_09"),
        ("DAIRY-005", "Whipping Cream 35% Dairy", "Dairy", "litres", 310.0, 480.0, 19.0, 3.2, 0.7, 1, "sup_03", "sup_01"),
        ("DAIRY-006", "Cream Cheese Block (1kg)", "Dairy", "kg", 520.0, 780.0, 14.0, 2.0, 0.5, 2, "sup_01", "sup_03"),
        ("DAIRY-007", "Soy Milk Barista Formulation", "Dairy", "litres", 160.0, 260.0, 18.0, 3.0, 0.8, 2, "sup_01", "sup_09"),
        ("DAIRY-008", "Condensed Milk Tin 400g", "Dairy", "tins", 65.0, 90.0, 30.0, 4.0, 0.9, 1, "sup_01", "sup_03"),

        # Bakery Ingredients (12 SKUs)
        ("FLOUR-001", "Organic Unbleached Bread Flour (T55)", "Bakery Ingredients", "kg", 85.0, 130.0, 140.0, 22.0, 3.5, 2, "sup_05", "sup_01"),
        ("FLOUR-002", "Whole Wheat Stoneground Atta", "Bakery Ingredients", "kg", 48.0, 75.0, 95.0, 14.0, 2.2, 2, "sup_05", "sup_01"),
        ("FLOUR-003", "Almond Flour Superfine (Blanched)", "Bakery Ingredients", "kg", 890.0, 1350.0, 12.0, 1.8, 0.4, 3, "sup_01", "sup_05"),
        ("FLOUR-004", "Rye Flour Dark Grain", "Bakery Ingredients", "kg", 110.0, 175.0, 28.0, 3.5, 0.8, 2, "sup_05", "sup_01"),
        ("SUGAR-001", "Fine Granulated White Cane Sugar", "Bakery Ingredients", "kg", 46.0, 65.0, 180.0, 16.0, 2.5, 1, "sup_01", "sup_05"),
        ("SUGAR-002", "Organic Brown Demerara Sugar", "Bakery Ingredients", "kg", 82.0, 125.0, 65.0, 6.5, 1.2, 2, "sup_01", "sup_05"),
        ("SUGAR-003", "Powdered Icing Sugar 500g", "Bakery Ingredients", "packets", 52.0, 80.0, 40.0, 4.2, 0.9, 2, "sup_01", "sup_05"),
        ("YEAST-001", "Instant Dry Yeast 500g Vacuum Pack", "Bakery Ingredients", "packets", 185.0, 290.0, 24.0, 1.5, 0.3, 2, "sup_01", "sup_05"),
        ("CHOC-001", "Callebaut 54.5% Dark Chocolate Callets", "Bakery Ingredients", "kg", 940.0, 1450.0, 16.0, 3.0, 0.6, 3, "sup_01", "sup_05"),
        ("CHOC-002", "Dutch Processed Cocoa Powder 22-24%", "Bakery Ingredients", "kg", 620.0, 950.0, 20.0, 2.2, 0.5, 2, "sup_01", "sup_05"),
        ("EGG-001", "Farm Fresh Cage-Free Eggs (Tray of 30)", "Bakery Ingredients", "trays", 195.0, 270.0, 18.0, 5.0, 1.0, 1, "sup_03", "sup_01"),
        ("SALT-001", "Sea Salt Flakes Maldon Style 500g", "Bakery Ingredients", "tubs", 240.0, 380.0, 15.0, 0.6, 0.2, 2, "sup_01", "sup_05"),

        # Syrups & Beverages (10 SKUs)
        ("SYRUP-001", "Madagascar Vanilla Syrup 750ml", "Syrups", "bottles", 540.0, 850.0, 14.0, 2.8, 0.5, 2, "sup_01", "sup_07"),
        ("SYRUP-002", "Salted Caramel Artisan Syrup 750ml", "Syrups", "bottles", 560.0, 880.0, 11.0, 3.1, 0.6, 2, "sup_01", "sup_07"),
        ("SYRUP-003", "Roasted Hazelnut Sugar-Free Syrup", "Syrups", "bottles", 580.0, 900.0, 8.0, 1.5, 0.4, 2, "sup_01", "sup_07"),
        ("SYRUP-004", "Organic Wildflower Honey 1kg", "Syrups", "kg", 480.0, 750.0, 22.0, 2.0, 0.4, 3, "sup_01", "sup_07"),
        ("TEA-001", "Nilgiri Orthodox Whole Leaf Black Tea", "Tea", "kg", 650.0, 1100.0, 30.0, 2.5, 0.5, 3, "sup_06", "sup_01"),
        ("TEA-002", "Masala Chai Assam CTC CTC Blend", "Tea", "kg", 380.0, 620.0, 48.0, 6.0, 1.2, 2, "sup_06", "sup_01"),
        ("TEA-003", "Japanese Ceremonial Grade Matcha 100g", "Tea", "tins", 1200.0, 1950.0, 9.0, 1.1, 0.3, 4, "sup_01", "sup_06"),
        ("TEA-004", "Kashmiri Kahwa Green Tea with Saffron", "Tea", "kg", 920.0, 1500.0, 14.0, 1.2, 0.3, 3, "sup_06", "sup_01"),
        ("TEA-005", "Chamomile Herbal Infusion Flowers", "Tea", "kg", 780.0, 1300.0, 10.0, 0.9, 0.2, 3, "sup_06", "sup_01"),
        ("SYRUP-005", "Monin Passionfruit Puree 1L", "Syrups", "bottles", 690.0, 1050.0, 7.0, 1.0, 0.3, 2, "sup_01", "sup_07"),

        # Packaging & Disposables (12 SKUs)
        ("PACK-001", "12oz Double Wall Kraft Coffee Cups (50pk)", "Packaging", "packets", 340.0, 480.0, 28.0, 8.5, 1.5, 2, "sup_10", "sup_04"),
        ("PACK-002", "Bio-Compostable Sip Lids 90mm (50pk)", "Packaging", "packets", 190.0, 280.0, 32.0, 8.5, 1.5, 2, "sup_10", "sup_04"),
        ("PACK-003", "8oz Single Wall Espresso Cups (50pk)", "Packaging", "packets", 260.0, 390.0, 40.0, 6.0, 1.0, 2, "sup_10", "sup_04"),
        ("PACK-004", "16oz Iced Coffee Clear PLA Cups (50pk)", "Packaging", "packets", 380.0, 550.0, 25.0, 7.0, 1.4, 2, "sup_10", "sup_04"),
        ("PACK-005", "Kraft Paper Carry Bags Medium (100pk)", "Packaging", "packets", 420.0, 600.0, 18.0, 3.5, 0.8, 2, "sup_10", "sup_04"),
        ("PACK-006", "Bakery Pastry Box Window 6x6 (50pk)", "Packaging", "packets", 450.0, 650.0, 15.0, 3.0, 0.7, 3, "sup_04", "sup_10"),
        ("PACK-007", "Food Grade Butter Paper Sheets (500s)", "Packaging", "reams", 310.0, 460.0, 12.0, 1.5, 0.4, 2, "sup_04", "sup_10"),
        ("PACK-008", "Birchwood Eco Coffee Stirrers (1000s)", "Packaging", "boxes", 180.0, 270.0, 14.0, 1.2, 0.3, 2, "sup_10", "sup_04"),
        ("PACK-009", "Kraft 2-Cup Drink Carriers (50pk)", "Packaging", "packets", 220.0, 320.0, 22.0, 4.0, 0.9, 2, "sup_10", "sup_04"),
        ("PACK-010", "Custom Deccan Roast Printed Sleeves (100pk)", "Packaging", "packets", 150.0, 240.0, 35.0, 8.0, 1.2, 3, "sup_04", "sup_10"),
        ("PACK-011", "Paper Straws 8mm Smoothie Grade (250s)", "Packaging", "boxes", 210.0, 320.0, 16.0, 2.5, 0.5, 2, "sup_10", "sup_04"),
        ("PACK-012", "Recyclable 3-Ply Paper Napkins (1000s)", "Packaging", "packs", 280.0, 420.0, 30.0, 5.0, 1.0, 2, "sup_04", "sup_10"),

        # Cleaning & Ancillary (16 SKUs)
        ("CLEAN-001", "Espresso Machine Backflush Detergent 566g", "Cleaning", "jars", 720.0, 1100.0, 6.0, 0.3, 0.1, 3, "sup_01", "sup_05"),
        ("CLEAN-002", "Steam Wand Milk Residue Cleaner 1L", "Cleaning", "bottles", 640.0, 980.0, 8.0, 0.4, 0.1, 2, "sup_01", "sup_05"),
        ("CLEAN-003", "Food Safe Sanitizer Spray 5L Can", "Cleaning", "cans", 850.0, 1250.0, 5.0, 0.5, 0.1, 2, "sup_01", "sup_05"),
        ("CLEAN-004", "Microfiber Barista Cloths (Pack of 6)", "Cleaning", "packs", 290.0, 450.0, 10.0, 0.4, 0.1, 2, "sup_01", "sup_04"),
        ("CLEAN-005", "Nitrile Food Handler Gloves Medium (100s)", "Cleaning", "boxes", 380.0, 550.0, 12.0, 1.2, 0.3, 2, "sup_01", "sup_04"),
        ("CLEAN-006", "Commercial Dishwashing Liquid 5L", "Cleaning", "cans", 550.0, 820.0, 7.0, 0.6, 0.2, 2, "sup_01", "sup_05"),
        ("CLEAN-007", "Heavy Duty Garbage Bags 50L (50pk)", "Cleaning", "packets", 190.0, 280.0, 20.0, 2.0, 0.4, 2, "sup_04", "sup_10"),
        ("MISC-001", "Water Filter Replacement Cartridge BWT", "Maintenance", "units", 4200.0, 6000.0, 2.0, 0.05, 0.02, 5, "sup_01", "sup_02"),
        ("MISC-002", "Grinder Burrs 64mm Titanium Replacement", "Maintenance", "sets", 5800.0, 8500.0, 1.0, 0.02, 0.01, 7, "sup_01", "sup_02"),
        ("MISC-003", "Silicone Group Head Gaskets 8.5mm", "Maintenance", "units", 320.0, 500.0, 4.0, 0.1, 0.05, 3, "sup_01", "sup_02"),
        ("MISC-004", "Specialty Parchment Baking Paper Roll 50m", "Bakery Ingredients", "rolls", 420.0, 620.0, 9.0, 0.8, 0.2, 2, "sup_05", "sup_01"),
        ("MISC-005", "Organic Ceylon Cinnamon Sticks 250g", "Spices", "pouches", 340.0, 520.0, 8.0, 0.5, 0.1, 3, "sup_07", "sup_01"),
        ("MISC-006", "Cardamom Green Pods Super Bold 250g", "Spices", "pouches", 680.0, 1050.0, 6.0, 0.4, 0.1, 3, "sup_07", "sup_01"),
        ("MISC-007", "Nutmeg Whole with Shell 250g", "Spices", "pouches", 290.0, 450.0, 7.0, 0.3, 0.1, 3, "sup_07", "sup_01"),
        ("MISC-008", "Edible Dried Lavender Flowers 100g", "Spices", "jars", 390.0, 600.0, 5.0, 0.2, 0.05, 3, "sup_07", "sup_01"),
        ("MISC-009", "Organic Matcha Whisk Chasen Bamboo", "Equipment", "units", 650.0, 1000.0, 3.0, 0.1, 0.05, 4, "sup_01", "sup_06"),
    ]

    inventory_items = []
    sales_history = []
    
    # Generate items and 90-day sales history
    for t in raw_sku_templates:
        sku, name, cat, unit, cost, sell, stock, d_avg, d_std, l_days, pref_sup, back_sup = t
        
        # Calculate Safety Stock (Z=1.65 for 95% service level)
        z = 1.65
        safety_stock = round(z * d_std * (l_days ** 0.5), 1)
        if safety_stock < 1.0:
            safety_stock = round(d_avg * 0.75, 1)
            
        # Reorder Point (ROP) = (Avg Daily * Lead Time) + Safety Stock
        reorder_point = round((d_avg * l_days) + safety_stock, 1)
        
        # Days of Supply Remaining
        days_of_supply = round(stock / d_avg, 1) if d_avg > 0 else 999.0
        
        # Determine Stockout Risk Level
        if days_of_supply <= l_days * 1.5:
            stockout_risk = "HIGH" if days_of_supply <= l_days * 1.0 else "MEDIUM"
        else:
            stockout_risk = "LOW"
            
        # For our star demo SKU (COFFEE-001), ensure it is in CRITICAL HIGH state (stock=36, daily=13 => 2.76 days)
        if sku == "COFFEE-001":
            stockout_risk = "HIGH"
            
        excess_risk = "HIGH" if days_of_supply > 60 else ("MEDIUM" if days_of_supply > 40 else "LOW")
        
        item = {
            "sku": sku,
            "name": name,
            "category": cat,
            "unit": unit,
            "unit_cost": cost,
            "selling_price": sell,
            "current_stock": stock,
            "safety_stock": safety_stock,
            "reorder_point": reorder_point,
            "min_order_qty": max(10.0, round(d_avg * 3, 0)),
            "daily_usage_avg": d_avg,
            "daily_usage_std": d_std,
            "lead_time_days": l_days,
            "days_of_supply": days_of_supply,
            "stockout_risk": stockout_risk,
            "excess_stock_risk": excess_risk,
            "preferred_supplier_id": pref_sup,
            "backup_supplier_id": back_sup,
            "store_id": store_id,
            "location_bin": f"Zone-{cat[0]}-{(len(inventory_items)%5)+1}",
            "created_at": (now - timedelta(days=90)).isoformat(),
            "updated_at": now.isoformat()
        }
        inventory_items.append(item)
        
        # Generate 90-day historical consumption
        for day_offset in range(90, 0, -1):
            day_date = (now - timedelta(days=day_offset)).strftime("%Y-%m-%d")
            # Weekend surge (approx +25% on Saturday/Sunday)
            day_obj = datetime.strptime(day_date, "%Y-%m-%d")
            multiplier = 1.3 if day_obj.weekday() >= 5 else 1.0
            
            # 32% recent demand surge scenario for coffee & dairy in the last 14 days
            if day_offset <= 14 and cat in ["Coffee", "Dairy"]:
                multiplier *= 1.32
                
            actual_sold = max(0.0, round(random.gauss(d_avg * multiplier, d_std), 1))
            waste = round(actual_sold * random.choice([0.0, 0.02, 0.04]), 1) if cat in ["Dairy", "Bakery Ingredients"] else 0.0
            revenue = round(actual_sold * (sell or cost * 1.5), 2)
            
            sales_history.append({
                "record_id": f"sale_{sku}_{day_date}",
                "store_id": store_id,
                "sku": sku,
                "date": day_date,
                "units_sold": actual_sold,
                "units_wasted": waste,
                "revenue": revenue
            })

    # Purchase Orders (Active, Delivered, Verified)
    purchase_orders = [
        {
            "po_id": "PO-10021",
            "store_id": store_id,
            "supplier_id": "sup_01",
            "supplier_name": "Metro Wholesale Hub",
            "status": "DELIVERED",
            "items": [
                {
                    "sku": "COFFEE-001",
                    "product_name": "Specialty Arabica Coffee Beans (AAA Grade)",
                    "quantity": 50.0,
                    "unit": "kg",
                    "unit_price": 840.0,
                    "discount_percentage": 11.5,
                    "line_total": 42000.0,
                    "received_quantity": 50.0
                }
            ],
            "subtotal": 42000.0,
            "tax_rate": 0.05,
            "tax_amount": 2100.0,
            "shipping_cost": 500.0,
            "total_amount": 44600.0,
            "expected_delivery_date": (now - timedelta(days=2)).strftime("%Y-%m-%d"),
            "actual_delivery_date": (now - timedelta(days=2)).strftime("%Y-%m-%d"),
            "approved_by": "Arjun Rao",
            "approved_at": (now - timedelta(days=5)).isoformat(),
            "verification_status": "VERIFIED",
            "verification_notes": "All 50 kg received in sealed condition. Batch #MB-881.",
            "created_at": (now - timedelta(days=5)).isoformat(),
            "updated_at": (now - timedelta(days=2)).isoformat()
        },
        {
            "po_id": "PO-10022",
            "store_id": store_id,
            "supplier_id": "sup_03",
            "supplier_name": "Kaveri Organic Dairy Co-op",
            "status": "DELIVERED",
            "items": [
                {
                    "sku": "DAIRY-001",
                    "product_name": "Pasteurized Full Cream Barista Milk",
                    "quantity": 100.0,
                    "unit": "litres",
                    "unit_price": 60.8,
                    "discount_percentage": 5.0,
                    "line_total": 6080.0,
                    "received_quantity": 92.0 # 8 litres missing discrepancy for demo!
                }
            ],
            "subtotal": 6080.0,
            "tax_rate": 0.05,
            "tax_amount": 304.0,
            "shipping_cost": 200.0,
            "total_amount": 6584.0,
            "expected_delivery_date": (now - timedelta(days=1)).strftime("%Y-%m-%d"),
            "actual_delivery_date": (now - timedelta(days=1)).strftime("%Y-%m-%d"),
            "approved_by": "Arjun Rao",
            "approved_at": (now - timedelta(days=3)).isoformat(),
            "verification_status": "DISCREPANCY_FLAGGED",
            "verification_notes": "Physical count showed 92 litres delivered against 100 litres billed.",
            "created_at": (now - timedelta(days=3)).isoformat(),
            "updated_at": (now - timedelta(days=1)).isoformat()
        },
        {
            "po_id": "PO-10023",
            "store_id": store_id,
            "supplier_id": "sup_10",
            "supplier_name": "GreenLeaf Packaging & Containers",
            "status": "IN_TRANSIT",
            "items": [
                {
                    "sku": "PACK-001",
                    "product_name": "12oz Double Wall Kraft Coffee Cups (50pk)",
                    "quantity": 50.0,
                    "unit": "packets",
                    "unit_price": 312.8,
                    "discount_percentage": 8.0,
                    "line_total": 15640.0,
                    "received_quantity": None
                }
            ],
            "subtotal": 15640.0,
            "tax_rate": 0.18,
            "tax_amount": 2815.2,
            "shipping_cost": 450.0,
            "total_amount": 18905.2,
            "expected_delivery_date": (now + timedelta(days=1)).strftime("%Y-%m-%d"),
            "approved_by": "Arjun Rao",
            "approved_at": (now - timedelta(days=1)).isoformat(),
            "verification_status": "AWAITING_DELIVERY",
            "created_at": (now - timedelta(days=1)).isoformat(),
            "updated_at": (now - timedelta(days=1)).isoformat()
        }
    ]

    # Pre-seeded Invoice Audits (Multimodal Discrepancy Demos)
    invoice_audits = [
        {
            "audit_id": "AUD-2026-001",
            "store_id": store_id,
            "invoice_number": "INV-10428",
            "supplier_id": "sup_01",
            "supplier_name": "Metro Wholesale Hub",
            "matching_po_id": "PO-10021",
            "status": "GREEN",
            "overall_risk": "LOW",
            "extracted_data": {
                "supplier_name": "Metro Wholesale Hub",
                "supplier_gstin": "29AABCM1234F1Z8",
                "invoice_number": "INV-10428",
                "invoice_date": (now - timedelta(days=2)).strftime("%Y-%m-%d"),
                "purchase_order_id": "PO-10021",
                "items": [
                    {
                        "sku": "COFFEE-001",
                        "name": "Arabica Coffee Beans (AAA Grade)",
                        "quantity": 50.0,
                        "unit_price": 840.0,
                        "line_total": 42000.0,
                        "hsn_sac": "0901"
                    }
                ],
                "subtotal": 42000.0,
                "tax_amount": 2100.0,
                "total_amount": 44600.0,
                "extraction_confidence": 0.98,
                "raw_ocr_summary": "TAX INVOICE INV-10428. Metro Wholesale Hub to Deccan Roast. 50 kg Arabica Beans @ ₹840 = ₹42,000 + GST ₹2,100 + Freight ₹500 = ₹44,600."
            },
            "discrepancies": [],
            "total_variance_inr": 0.0,
            "audit_summary": "Verified 100% match with Purchase Order PO-10021. Quantities, prices, and GST calculation aligned.",
            "recommended_action": "Approve for scheduled payment release.",
            "reviewed_by": "Arjun Rao",
            "reviewed_at": (now - timedelta(days=2)).isoformat(),
            "created_at": (now - timedelta(days=2)).isoformat(),
            "updated_at": (now - timedelta(days=2)).isoformat()
        },
        {
            "audit_id": "AUD-2026-002",
            "store_id": store_id,
            "invoice_number": "INV-KAV-8842",
            "supplier_id": "sup_03",
            "supplier_name": "Kaveri Organic Dairy Co-op",
            "matching_po_id": "PO-10022",
            "status": "RED",
            "overall_risk": "HIGH",
            "extracted_data": {
                "supplier_name": "Kaveri Organic Dairy Co-op",
                "supplier_gstin": "29AABCK8891D1ZQ",
                "invoice_number": "INV-KAV-8842",
                "invoice_date": (now - timedelta(days=1)).strftime("%Y-%m-%d"),
                "purchase_order_id": "PO-10022",
                "items": [
                    {
                        "sku": "DAIRY-001",
                        "name": "Pasteurized Full Cream Barista Milk",
                        "quantity": 100.0,
                        "unit_price": 60.8,
                        "line_total": 6080.0,
                        "hsn_sac": "0401"
                    }
                ],
                "subtotal": 6080.0,
                "tax_amount": 304.0,
                "total_amount": 6584.0,
                "extraction_confidence": 0.96,
                "raw_ocr_summary": "KAVERI DAIRY TAX INVOICE INV-KAV-8842. Billed: 100 litres Barista Milk @ ₹60.80 = ₹6,080. Total ₹6,584."
            },
            "discrepancies": [
                {
                    "type": "QUANTITY_MISMATCH",
                    "sku": "DAIRY-001",
                    "item_name": "Pasteurized Full Cream Barista Milk",
                    "ordered_value": 100.0,
                    "invoiced_value": 100.0,
                    "received_value": 92.0,
                    "variance_amount": 486.4,
                    "variance_percentage": 8.0,
                    "description": "8.0 litres missing from delivery. Delivery note confirms 92.0 litres received while invoice charges for 100.0 litres.",
                    "severity": "HIGH"
                }
            ],
            "total_variance_inr": 486.4,
            "audit_summary": "Critical Discrepancy: 8 units missing between physical receipt and supplier invoice. Potential overbilling of ₹486.40 + GST.",
            "recommended_action": "Hold payment and request revised credit note from Kaveri Dairy for 8 missing litres.",
            "created_at": (now - timedelta(days=1)).isoformat(),
            "updated_at": (now - timedelta(days=1)).isoformat()
        }
    ]

    # Pre-seeded Negotiation Proposals & Pending Approvals
    negotiation_proposals = [
        {
            "proposal_id": "PROP-2026-081",
            "store_id": store_id,
            "supplier_id": "sup_01",
            "supplier_name": "Metro Wholesale Hub",
            "sku": "COFFEE-001",
            "product_name": "Specialty Arabica Coffee Beans (AAA Grade)",
            "quantity": 100.0,
            "current_quote_unit_price": 950.0,
            "historical_avg_unit_price": 860.0,
            "target_unit_price": 880.0,
            "total_original_cost": 95000.0,
            "total_target_cost": 88000.0,
            "expected_savings": 7000.0,
            "supplier_reliability_score": 91.0,
            "lead_time_days": 2,
            "rationale": "Stock projected to deplete in 2.8 days due to 32% demand surge. Volume commitment of 100kg qualifies for Tier 2 discount (7.5%). Proposed target ₹880/kg is within supplier's historical volume margin.",
            "data_points_used": [
                "Current stock: 36 kg (below 41.5 kg reorder point)",
                "Run-rate: 13.0 kg/day + 32% weekend surge",
                "Metro Wholesale reliability: 91/100, on-time: 96%",
                "Historical agreed price: ₹840/kg in PO-10021"
            ],
            "draft_negotiation_message": "Hi Vikram,\n\nBased on our upcoming café expansion and a 100 kg order of Arabica Coffee Beans (AAA Grade), would Metro Wholesale be open to confirming this at ₹880/kg with guaranteed 2-day delivery to our Yeshwanthpur hub?\n\nLooking forward to your confirmation.\n\nWarm regards,\nArjun Rao | Deccan Roast",
            "status": "PENDING_APPROVAL",
            "scenarios": [
                {
                    "scenario_id": "SCENARIO-A",
                    "name": "Scenario A: Single Supplier (Metro Wholesale)",
                    "strategy": "Order 100kg from Metro Wholesale at standard volume price",
                    "total_cost": 90250.0,
                    "unit_price": 902.5,
                    "lead_time_days": 2,
                    "supplier_allocations": [{"supplier_id": "sup_01", "supplier_name": "Metro Wholesale Hub", "quantity": 100.0, "cost": 90250.0}],
                    "risk_level": "MEDIUM",
                    "stockout_risk": "LOW",
                    "savings_vs_quote": 4750.0,
                    "pros": ["Fast 2-day lead time", "Single delivery point", "High 96% on-time rate"],
                    "cons": ["Higher unit cost than direct farm source", "Single point of failure"],
                    "is_recommended": False
                },
                {
                    "scenario_id": "SCENARIO-B",
                    "name": "Scenario B: Split Order Strategy (AI Recommended)",
                    "strategy": "Split 100kg: 40kg Fast-Delivery (Metro) + 60kg Direct Planters (Malnad)",
                    "total_cost": 86328.0,
                    "unit_price": 863.28,
                    "lead_time_days": 2,
                    "supplier_allocations": [
                        {"supplier_id": "sup_01", "supplier_name": "Metro Wholesale Hub", "quantity": 40.0, "cost": 36100.0},
                        {"supplier_id": "sup_02", "supplier_name": "Malnad Coffee Planters Direct", "quantity": 60.0, "cost": 50228.0}
                    ],
                    "risk_level": "LOW",
                    "stockout_risk": "LOW",
                    "savings_vs_quote": 8672.0,
                    "pros": ["Lowest blended unit cost (₹863.28)", "Immediate 40kg buffer arrives in 2 days", "Reduces vendor dependency"],
                    "cons": ["Two separate invoices and deliveries to receive"],
                    "is_recommended": True,
                    "ai_recommendation_reason": "Optimizes cash savings while eliminating stockout risk by providing a 40kg buffer within 48 hours."
                },
                {
                    "scenario_id": "SCENARIO-C",
                    "name": "Scenario C: Delay Purchase (Just-In-Time)",
                    "strategy": "Wait 3 days and place single order for 80kg",
                    "total_cost": 72200.0,
                    "unit_price": 902.5,
                    "lead_time_days": 2,
                    "supplier_allocations": [{"supplier_id": "sup_01", "supplier_name": "Metro Wholesale Hub", "quantity": 80.0, "cost": 72200.0}],
                    "risk_level": "HIGH",
                    "stockout_risk": "CRITICAL",
                    "savings_vs_quote": 3800.0,
                    "pros": ["Delays immediate cash outflow by 72 hours"],
                    "cons": ["88% probability of stockout during peak Saturday rush", "Zero safety buffer"],
                    "is_recommended": False
                }
            ],
            "selected_scenario_id": "SCENARIO-B",
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        }
    ]

    # Pre-seeded Approvals
    approvals = [
        {
            "approval_id": "APPR-2026-081",
            "store_id": store_id,
            "type": "PURCHASE_ORDER",
            "title": "Procurement Proposal: 100 kg Arabica Coffee Beans (Split Order)",
            "description": "Approve split procurement across Metro Wholesale (40kg) and Malnad Planters (60kg) to resolve critical stockout risk.",
            "cost_inr": 86328.0,
            "potential_savings_inr": 8672.0,
            "risk_level": "LOW",
            "proposal_id": "PROP-2026-081",
            "supplier_name": "Metro Wholesale & Malnad Planters",
            "sku": "COFFEE-001",
            "what_will_happen": "Two purchase orders will be generated (PO for Metro Wholesale ₹36,100 + PO for Malnad Planters ₹50,228). Stock levels will be secured for 14 operational days.",
            "why_recommended": "Coffee stock is at 36kg with 13.0kg daily run-rate. Without action, stockout will occur within 2.8 days.",
            "expected_benefit": "Zero business downtime, ₹8,672 in negotiated savings, diversified supplier risk.",
            "data_sources_used": [
                "Inventory Ledger: SKU COFFEE-001",
                "Historical 90-day consumption trends",
                "Vendor SLA & Reliability matrices"
            ],
            "payload_snapshot": {
                "sku": "COFFEE-001",
                "total_quantity": 100.0,
                "strategy": "SPLIT_ORDER"
            },
            "status": "PENDING",
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        }
    ]

    # Pre-seeded Operations Timeline Events
    timeline_events = [
        {
            "event_id": "EVT-0914",
            "store_id": store_id,
            "timestamp_display": "09:14 AM",
            "stage": "DETECT",
            "agent": "Inventory Intelligence Agent",
            "title": "Projected Stockout Detected",
            "description": "Arabica Coffee Beans (COFFEE-001) stock (36 kg) fell below reorder threshold (41.5 kg). Projected stockout in 2.8 days.",
            "badge_type": "rose",
            "entity_id": "COFFEE-001",
            "entity_type": "SKU",
            "created_at": (now - timedelta(minutes=25)).isoformat()
        },
        {
            "event_id": "EVT-0915",
            "store_id": store_id,
            "timestamp_display": "09:15 AM",
            "stage": "SIMULATE",
            "agent": "Procurement Agent",
            "title": "Procurement Scenarios Evaluated",
            "description": "Simulated 3 procurement scenarios across 3 suppliers. Scenario B (Split Order) selected for optimal cost & risk score.",
            "badge_type": "cyan",
            "entity_id": "PROP-2026-081",
            "entity_type": "PROPOSAL",
            "created_at": (now - timedelta(minutes=24)).isoformat()
        },
        {
            "event_id": "EVT-0916",
            "store_id": store_id,
            "timestamp_display": "09:16 AM",
            "stage": "NEGOTIATE",
            "agent": "Vendor Negotiation Agent",
            "title": "Target Negotiation Drafted",
            "description": "Calculated target price ₹880/kg (saving ₹7,000 to ₹8,672). Prepared structured outreach proposal for manager review.",
            "badge_type": "indigo",
            "entity_id": "PROP-2026-081",
            "entity_type": "PROPOSAL",
            "created_at": (now - timedelta(minutes=23)).isoformat()
        },
        {
            "event_id": "EVT-0917",
            "store_id": store_id,
            "timestamp_display": "09:17 AM",
            "stage": "APPROVAL",
            "agent": "Orchestrator",
            "title": "Approval Request Dispatched",
            "description": "High-impact procurement action routed to Operations Manager Arjun Rao. Waiting for human sign-off.",
            "badge_type": "amber",
            "entity_id": "APPR-2026-081",
            "entity_type": "APPROVAL",
            "created_at": (now - timedelta(minutes=22)).isoformat()
        }
    ]

    # Pre-seeded Risk Events
    risk_events = [
        {
            "event_id": "RSK-001",
            "store_id": store_id,
            "dimension": "Stockout Risk",
            "severity": "HIGH",
            "title": "Imminent Stockout on Core Coffee SKU",
            "description": "Specialty Arabica Coffee Beans (AAA Grade) has 2.8 days of inventory remaining.",
            "affected_sku": "COFFEE-001",
            "supporting_metrics": {"current_stock": 36.0, "daily_usage": 13.0, "reorder_point": 41.5},
            "recommended_action": "Execute Split-Order PO immediately (Approval APPR-2026-081).",
            "is_resolved": False,
            "created_at": (now - timedelta(hours=2)).isoformat()
        },
        {
            "event_id": "RSK-002",
            "store_id": store_id,
            "dimension": "Invoice Discrepancies",
            "severity": "HIGH",
            "title": "Unresolved Invoice Shortage: Kaveri Dairy",
            "description": "Invoice INV-KAV-8842 billed for 100L milk but delivery was short by 8L (₹486.40 variance).",
            "affected_supplier_id": "sup_03",
            "supporting_metrics": {"variance_inr": 486.4, "missing_units": 8.0},
            "recommended_action": "Issue debit note / hold invoice payment pending vendor credit.",
            "is_resolved": False,
            "created_at": (now - timedelta(hours=5)).isoformat()
        },
        {
            "event_id": "RSK-003",
            "store_id": store_id,
            "dimension": "Supplier Reliability",
            "severity": "MEDIUM",
            "title": "Supplier Response Time Degradation: Spices Karnataka",
            "description": "Average response time increased to 65 min; discrepancy rate rose to 9.0%.",
            "affected_supplier_id": "sup_07",
            "supporting_metrics": {"reliability_score": 79.0, "discrepancy_rate": 9.0},
            "recommended_action": "Route critical syrup/spice orders to Metro Wholesale as primary.",
            "is_resolved": False,
            "created_at": (now - timedelta(days=1)).isoformat()
        }
    ]

    dataset = {
        "store_info": store_info,
        "suppliers": suppliers,
        "inventory": inventory_items,
        "sales": sales_history,
        "purchase_orders": purchase_orders,
        "invoice_audits": invoice_audits,
        "negotiation_proposals": negotiation_proposals,
        "approvals": approvals,
        "timeline_events": timeline_events,
        "risk_events": risk_events
    }
    
    return dataset

if __name__ == "__main__":
    data = generate_seed_data()
    
    # Save to backend data directory
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend", "app", "data")
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, "seeded_store_data.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"[SUCCESS] Successfully seeded LEADSTOHELP AI dataset:")
    print(f"   * Store: {data['store_info']['name']}")
    print(f"   * Suppliers: {len(data['suppliers'])}")
    print(f"   * Inventory SKUs: {len(data['inventory'])}")
    print(f"   * Sales History Records: {len(data['sales'])}")
    print(f"   * Purchase Orders: {len(data['purchase_orders'])}")
    print(f"   * Invoice Audits: {len(data['invoice_audits'])}")
    print(f"   * Saved to: {output_path}")
