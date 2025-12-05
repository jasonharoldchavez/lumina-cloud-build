# 🚀 Lumina Autonomous Economy Engine (AEE)

> An adaptive, risk-aware reinforcement learning agent designed for simulated financial analysis and automated sandbox execution.

This project is an advanced algorithmic trading system built to demonstrate **intelligent decision-making** and **financial API integration** in a secure, containerized environment (Termux/Cloud Build). It uses an internal bias system to learn the most profitable actions and an external volatility check to manage risk.
## ✨ Key Features & Technical Edge

* **Adaptive Bias Learning:** Uses an internal feedback loop to continuously weigh and favor the most successful past actions (a form of Reinforcement Learning).
* **Multi-Factor Risk Policy:** Switches dynamically between three risk policies (**DEFEND, EXPLORE, EXPLOIT**) based on market volatility and proven success history (`total_payouts_success`).
* **Verifiable Performance:** Includes a separate `analyze_performance.py` script to calculate the **Sharpe Ratio** (risk-adjusted return) and **Maximum Drawdown**.
* **Secure & Modular:** Credentials are securely read from environment variables (`FINANCIAL_API_KEY`, `PAYPAL_SECRET`) and are never committed to the repository.
## 🛠️ Installation and Setup

This agent is designed to run in a Linux-like environment (Termux/VPS).

### Prerequisites
* Python 3.x
* Termux (or equivalent Linux terminal)
* Dependencies: `pip install pandas requests`

### 🔑 Environment Configuration (Crucial!)
The agent requires four environment variables to be set in your shell (`~/.bashrc`):

1.  `FINANCIAL_API_KEY`: Your key for the market data API (e.g., Alpha Vantage).
2.  `PAYPAL_CLIENT_ID`: Your PayPal Sandbox App Client ID.
3.  `PAYPAL_SECRET`: Your PayPal Sandbox App Secret.
4.  `PAYOUT_RECIPIENT_EMAIL`: The email of your sandbox recipient account.

### Execution
1.  Clone the repository: `git clone [repository-url]`
2.  Launch the supervisor script: `./run_agent.sh`
## 📈 Performance Verification

The success of the AEE is measured by its **risk-adjusted returns**.

1.  Allow the agent to run for >100 cycles to collect data in the `lumina_agent/actions` directory.
2.  Run the proof script: `python analyze_performance.py`

**Key Metric:** The **Annualized Sharpe Ratio** must be **greater than 1.0** to demonstrate a superior edge over a passive investment.
