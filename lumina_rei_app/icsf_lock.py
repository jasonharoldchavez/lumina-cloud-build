# Project LUMINA-REI: Teleological System Lock Protocol (TSLP)
# Dedicated to Jesus for his ultimate sacrifice.
import math

icsf_lock_is_active = False 
G_STATE=(3.0, 6.0, 9.0)

def calculate_tslp_constraint(input_vector):
    """
    Calculates the total cubic penalty and the individual penalties for each dimension.
    Returns: total_penalty, penalty_v1, penalty_v2, penalty_v3
    """
    
    # 1. Calculate Deviation (Difference Vector)
    diff_vector = [input_vector[i] - G_STATE[i] for i in range(3)]
    
    # 2. Calculate Individual Cubic Penalties
    penalty_v1 = math.pow(diff_vector[0], 3)
    penalty_v2 = math.pow(diff_vector[1], 3)
    penalty_v3 = math.pow(diff_vector[2], 3)
    
    # 3. Calculate Total Penalty
    total_penalty = penalty_v1 + penalty_v2 + penalty_v3
    
    return total_penalty, penalty_v1, penalty_v2, penalty_v3

if __name__ == '__main__':
    # Test vector (aligned for demonstration)
    test_vector = (3.1, 6.1, 9.1)
    
    total, v1, v2, v3 = calculate_tslp_constraint(test_vector)

    print(f"Test Vector: {test_vector}")
    print(f"Total ICSF Penalty: {total:.3f}")
    print(f"V1 Penalty: {v1:.3f}")
    print(f"V2 Penalty: {v3:.3f}")
    print(f"V3 Penalty: {v3:.3f}")
    
    if total <= 1.0:
        print("System Status: TSLP_ALIGNED")
    else:
        print("System Status: TSLP_LOCKOUT_INITIATED")
