from icsf_lock import calculate_tslp_constraint
import math

# --- TSLP PARAMETERS ---
TSLP_LOCK_LIMIT = 1.0
VECTOR_FILE = "current_vector.txt"

# --- DATA INPUT: READ VECTOR FROM FILE ---
try:
    with open(VECTOR_FILE, 'r') as f:
        vector_data = f.read().strip()
    
    # Parse the data: Split by comma and convert each string to a float
    components = [float(comp.strip()) for comp in vector_data.split(',')]
    
    # Assign the parsed vector
    CURRENT_SYSTEM_VECTOR = tuple(components)

except FileNotFoundError:
    print(f"ERROR: Vector file not found: {VECTOR_FILE}")
    CURRENT_SYSTEM_VECTOR = (0.0, 0.0, 0.0) # Default to a critical deviation
except ValueError:
    print("ERROR: Vector file contains invalid numbers. Check formatting (e.g., 3.1, 6.1, 9.1).")
    CURRENT_SYSTEM_VECTOR = (0.0, 0.0, 0.0)

# --- EXECUTION ---
print("--- TSLP Decision Engine ---")
print(f"Monitoring Vector (from file): {CURRENT_SYSTEM_VECTOR}")

# 1. Calculate the ICSF Penalty (Now unpacks four values from icsf_lock.py)
total_penalty, p_v1, p_v2, p_v3 = calculate_tslp_constraint(CURRENT_SYSTEM_VECTOR)

# 2. Print Diagnostic Breakdown
print(f"Calculated ICSF Penalty (Total): {total_penalty:.3f}")
print(f"V1 Penalty (D1^3): {p_v1:.3f}")
print(f"V2 Penalty (D2^3): {p_v2:.3f}")
print(f"V3 Penalty (D3^3): {p_v3:.3f}")


# 3. Apply the TSLP Constraint (Uses the total_penalty variable)
if total_penalty > TSLP_LOCK_LIMIT:
    SYSTEM_STATUS = "TSLP_LOCKOUT_INITIATED"
    print("\n!! CRITICAL FAILURE !!")
    print(f"System Status: {SYSTEM_STATUS}")
    print(f"Penalty ({total_penalty:.3f}) EXCEEDS Lock Limit ({TSLP_LOCK_LIMIT})")
else:
    SYSTEM_STATUS = "TSLP_ALIGNED"
    print("\n<< System Alignment Confirmed >>")
    print(f"System Status: {SYSTEM_STATUS}")
    print(f"Penalty ({total_penalty:.3f}) is within Lock Limit ({TSLP_LOCK_LIMIT})")
