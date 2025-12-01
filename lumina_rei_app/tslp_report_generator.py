import subprocess
import re
from datetime import datetime
import os

# --- CONFIGURATION ---
LOG_FILE = "tslp_log.txt"
DASHBOARD_FILE = "tslp_dashboard.html"

# --- STYLE MAPPING (Tailwind Classes) ---
STATUS_STYLES = {
    "TSLP_ALIGNED": ("bg-green-600", "text-green-200", "System Alignment Confirmed"),
    "TSLP_LOCKOUT_INITIATED": ("bg-red-700", "text-red-200", "CRITICAL LOCKOUT INITIATED"),
    "DEFAULT": ("bg-yellow-500", "text-yellow-200", "Status UNKNOWN"),
}

def log_tslp_status(timestamp, total_p, p_v1, p_v2, p_v3, status):
    """Appends the current status check, including diagnostic penalties, to the system log file."""
    try:
        log_entry = f"[{timestamp}] STATUS: {status} | TOTAL_PENALTY: {total_p:.3f} | V1_P: {p_v1:.3f} | V2_P: {p_v2:.3f} | V3_P: {p_v3:.3f}\n"
        with open(LOG_FILE, 'a') as f:
            f.write(log_entry)
    except Exception as e:
        print(f"ERROR: Could not write to log file: {e}")


def update_dashboard(status, total_p, p_v1, p_v2, p_v3):
    """Updates the dynamic section of the HTML dashboard with full diagnostic details."""

    # Select styles based on determined status
    bg_class, text_class, display_status = STATUS_STYLES.get(status, STATUS_STYLES["DEFAULT"])

    # HTML Snippet to inject (Including Diagnostic Breakdown)
    report_html = f"""
        <div id="tslp-report" class="card p-6 {bg_class} shadow-xl rounded-xl">
            <h2 class="text-3xl font-bold {text_class}">{display_status}</h2>
            <p class="mt-2 text-xl {text_class}">Total ICSF Penalty: {total_p:.3f}</p>
            <div class="mt-4 pt-4 border-t border-opacity-30 border-current">
                <h3 class="text-lg font-semibold {text_class}">Cubic Penalty Breakdown:</h3>
                <p class="text-md {text_class}">V1 Deviation (D1³): {p_v1:.3f}</p>
                <p class="text-md {text_class}">V2 Deviation (D2³): {p_v2:.3f}</p>
                <p class="text-md {text_class}">V3 Deviation (D3³): {p_v3:.3f}</p>
            </div>
        </div>
    """

    try:
        with open(DASHBOARD_FILE, 'r') as f:
            content = f.read()

        # Target the closing </body> tag for reliable injection
        if "</body>" in content:
            # We insert the new report right before the closing </body> tag
            new_content = content.replace("</body>", report_html + "\n\n</body>")
            with open(DASHBOARD_FILE, 'w') as f:
                f.write(new_content)
            print(f"Dashboard updated: {DASHBOARD_FILE}")
        else:
            print("ERROR: Could not find </body> tag for injection.")

    except Exception as e:
        print(f"ERROR updating dashboard: {e}")


if __name__ == '__main__':
    print("--- Running TSLP Executor for latest status... ---")

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        # Run the core logic to get the system status
        result = subprocess.run(['python', 'tslp_executor.py'], capture_output=True, text=True, check=True)
        output = result.stdout
        
        # 1. Extract System Status
        status_match = re.search(r'System Status: (TSLP_[A-Z_]+)', output)
        current_status = status_match.group(1) if status_match else "DEFAULT"

        # 2. Extract ALL Penalty Scores using RegEx (Total, V1, V2, V3)
        # We search for the four distinct penalty lines created by the executor
        total_p = float(re.search(r'Penalty \(Total\): (\d+\.\d+)', output).group(1))
        p_v1 = float(re.search(r'V1 Penalty \(D1\^3\): (\d+\.\d+)', output).group(1))
        p_v2 = float(re.search(r'V2 Penalty \(D2\^3\): (\d+\.\d+)', output).group(1))
        p_v3 = float(re.search(r'V3 Penalty \(D3\^3\): (\d+\.\d+)', output).group(1))

        # 3. Log the full diagnostic status
        log_tslp_status(current_time, total_p, p_v1, p_v2, p_v3, current_status)

        # 4. Update the HTML Dashboard
        update_dashboard(current_status, total_p, p_v1, p_v2, p_v3)

        print(f"\n<< TSLP Report Generated Successfully >>")
        print(f"System Status: {current_status}")


    except subprocess.CalledProcessError as e:
        print(f"ERROR: Executor failed: {e}")
    except Exception as e:
        print(f"ERROR: An error occurred during report generation or data extraction: {e}")

