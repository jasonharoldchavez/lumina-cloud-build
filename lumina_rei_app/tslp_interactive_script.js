        const G_STATE = [3.0, 6.0, 9.0];
        const TSLP_LOCK_LIMIT = 1.0;

        function calculateICSF() {
            // 1. Get input values
            const v1 = parseFloat(document.getElementById('v1_input').value) || 0;
            const v2 = parseFloat(document.getElementById('v2_input').value) || 0;
            const v3 = parseFloat(document.getElementById('v3_input').value) || 0;

            // 2. Calculate Deviation (D)
            const d1 = v1 - G_STATE[0];
            const d2 = v2 - G_STATE[1];
            const d3 = v3 - G_STATE[2];

            // 3. Calculate Individual Cubic Penalties (D³)
            const p_v1 = Math.pow(d1, 3);
            const p_v2 = Math.pow(d2, 3);
            const p_v3 = Math.pow(d3, 3);

            // 4. Calculate Total Penalty
            const total_p = p_v1 + p_v2 + p_v3;

            // 5. Determine Status
            let status = "";
            let bg_class = "";
            let display_status = "";

            if (total_p > TSLP_LOCK_LIMIT) {
                status = "TSLP_LOCKOUT_INITIATED";
                bg_class = "bg-red-700";
                display_status = "CRITICAL LOCKOUT INITIATED";
            } else {
                status = "TSLP_ALIGNED";
                bg_class = "bg-green-600";
                display_status = "System Alignment Confirmed";
            }

            // 6. Update Dashboard Display (Inject HTML)
            const reportHtml = `<div id="tslp-report-js" class="card p-6 ${bg_class} shadow-xl rounded-xl mt-6"><h2 class="text-3xl text-white font-bold">${display_status}</h2><p class="mt-2 text-xl text-white">Total ICSF Penalty: ${total_p.toFixed(3)}</p><div class="mt-4 pt-4 border-t border-opacity-30 border-white"><h3 class="text-lg font-semibold text-white">Cubic Penalty Breakdown:</h3><p class="text-md text-white">V1 Deviation (D1³): ${p_v1.toFixed(3)}</p><p class="text-md text-white">V2 Deviation (D2³): ${p_v2.toFixed(3)}</p><p class="text-md text-white">V3 Deviation (D3³): ${p_v3.toFixed(3)}</p></div></div>`;
            
            // Inject the new report above the input section
            document.getElementById('tslp-input').insertAdjacentHTML('beforebegin', reportHtml);

            // Clear the Python-generated report if it exists to avoid clutter
            const pythonReport = document.getElementById('tslp-report');
            if (pythonReport) { pythonReport.remove(); }
        }
