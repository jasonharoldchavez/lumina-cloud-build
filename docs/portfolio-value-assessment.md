# Portfolio value assessment and near-term revenue direction

**Assessment date:** 2026-11-15  
**Purpose:** Identify the strongest existing assets, distinguish verified engineering from hypotheses, and choose a focused route to first revenue.  
**Important:** This is a technical/product assessment, not a business valuation, legal opinion, or claim of customer demand.

## Executive decision

Do not abandon Living Atlas, but do not make it the only route to revenue.

The strongest near-term *technical product candidate* found in the public GitHub portfolio is a focused combination of:

- **Streaming Guardian** (`jasonharoldchavez/oses_test`): sequential change-detection / telemetry-monitoring toolkit with a reproducible synthetic benchmark and CI tests.
- **Lumen SDK** (`jasonharoldchavez/lumen-sdk`): SQLite-backed event ledger, HMAC-authenticated records, hash/Merkle verification, and forensic audit tooling.

Together they could become a small, self-hosted **telemetry monitoring and evidence-integrity product** for a narrow class of engineering teams. This is a product hypothesis, not a validated market opportunity. The two projects should remain independently maintained libraries until an integration has been tested.

Why this direction: it combines two concrete engineering capabilities, addresses a business problem (monitoring a stream while retaining verifiable event history), and is more differentiated than selling a generic dashboard or generic AI app. It must be compared honestly with established observability and tamper-evident-log products.

**Do not start a new unrelated project yet.** First make one existing technical asset solve one customer's problem and test willingness to pay.

## Portfolio assessment

### 1. Streaming Guardian — strongest focused product candidate

Repository: https://github.com/jasonharoldchavez/oses_test

Verified from the default-branch README, source, tests, benchmark, package metadata, and license file:
- Python sequential change-detection / telemetry-monitoring toolkit.
- Adaptive CUSUM-style detector. Its own README correctly calls it a heuristic, not a calibrated probabilistic model.
- Synthetic benchmark runner uses seeded scenarios, separate baseline-only no-change trials, false-alarm and detection measures, conditional delay, and Wilson intervals.
- Tests cover detector input behavior, benchmark metrics/configuration, and certificate-related checks.
- GitHub Actions is configured to test Python 3.10–3.13.
- Package metadata describes version 1.0.0.

Limitations:
- Synthetic benchmark performance is not evidence of performance on real customer streams.
- No verified customer deployment, production telemetry evaluation, revenue, or customer willingness to pay.
- README and license text need legal/packaging reconciliation: `pyproject.toml` points to `LICENSE.txt`, which contains Apache 2.0 followed by a separate commercial-license agreement. Do not assume the combined file's legal effect is settled. Have the intended open-source/commercial model reviewed and split/clarify the files before distribution.

Best next proof:
- Run a benchmark against at least two transparent baseline detectors on identical seeded and held-out scenarios.
- Add replay tests from representative, non-sensitive public telemetry datasets.
- Report false alarms per hour/day, missed-change rate, detection delay, CPU/memory, and confidence intervals, with complete scenario and version metadata.
- Never label an alarm as proof of a fault.

### 2. Lumen SDK — strongest reusable integrity component

Repository: https://github.com/jasonharoldchavez/lumen-sdk  
PyPI: https://pypi.org/project/lumen-sdk/

Verified:
- Public Python package published on PyPI as version 0.5.0 on 2026-07-20.
- The current GitHub `pyproject.toml` identifies package version 0.5.0, Python >=3.10, and Apache-2.0.
- Repository contains SQLite ledger, HMAC signing, Merkle-tree functions, verification logic, and tests for blind corruption, chaos, resiliency, scale, release validation, and verifier regressions.
- The ledger stores transaction manifests, event journal entries, detector-state history, and optional model/manifold data.
- Repository includes an Apache 2.0 LICENSE and a separate commercial-license document.

Limitations:
- A hash/HMAC/Merkle scheme can detect certain changes under its key and checkpoint assumptions; it does not automatically prevent tampering, prove truth of the input, prove who entered it, or provide regulatory certification.
- Key generation, storage, rotation, recovery, access control, trusted external checkpoints, backup/restore, and independent verification need a full security review.
- The PyPI page currently shows 0.5.0. Do not repeat a README's later version claim unless the actual package release is confirmed.
- Apache 2.0 permits commercial use subject to its terms. Any additional commercial licensing language needs legal review and must not be presented as withdrawing rights already granted under Apache 2.0.

Best next proof:
- Test key-provider failures, key rotation, database rollback/restore, concurrent writers, crash recovery, and independent verification from exported evidence.
- Document exactly which attacks are detected and which are not.
- Produce a small CLI that seals an export and verifies it on a second clean environment.

### 3. Causal Engine SDK / ASIE — research and developer-tool asset

Repository: https://github.com/jasonharoldchavez/causal_engine_sdk

Verified from README, package metadata, and test directory:
- NumPy-based Python framework for lagged prediction, structural-equation simulation, model experimentation, and validation utilities.
- Published release identified in the README as v0.2.1.
- Tests include ASIE behavior, causal-matrix validation, and internal-coherence checks.
- README explicitly states that predictive associations are not, by themselves, identified causal effects.

Limitations:
- Do not sell this as a validated causal-discovery engine.
- Causal identification requires explicit assumptions, appropriate design/identification methods, ground-truth evaluation, and independent validation.
- The commercial-license contact details and licensing package need review before selling.
- The most defensible near-term use is forecasting/predictive analytics and simulation support, with careful naming and documentation.

Recommendation: keep it as a research/developer asset; do not make it the first paid product.

### 4. INN System (also called Ian Systems in prior discussion) — distinct simulation/control asset

Prior local verification reported a runnable Python closed-loop simulation, syntax/import checks, UDP telemetry, safe shutdown, and 13 passing tests in a focused run. It is not among the 16 repositories currently returned by the linked GitHub account, so its current source state was not re-inspected for this assessment.

Known limitations from the earlier code review:
- It is a simulation/control prototype, not hardware-in-the-loop proof.
- Some model details and units need correction or clarification.
- No controlled-versus-uncontrolled experiment has established a measurable benefit.

Potential future value: simulation and control experiments for energy/battery/embedded applications. Keep it separate from Neotropic Node. Do not sell it as validated battery management or safety control.

### 5. Neotropic Node — high-risk, longer-term embedded research asset

Repository: https://github.com/jasonharoldchavez/neotropic_node

Verified from Cargo.toml and `src/main.rs`:
- Rust `no_std` / Cortex-M embedded project with modules for sensors, power, storage, LoRa/networking, and prognostics.
- The inspected entry point uses mock SPI, I2C, and GPIO peripherals; fixed/mock telemetry; and a `ToyStreamCipher`.
- This is a firmware architecture/prototype, not demonstrated deployed hardware, secure encryption, validated swarm consensus, or field-tested prognostics.

Potential value: future edge-device telemetry and low-power distributed sensing, after hardware integration, real drivers, reviewed cryptography, tests, and field trials. Not a near-term revenue priority.

### 6. Living Atlas / Maker Arcade — strongest consumer/education vision, not fastest revenue proof

Repository: https://github.com/jasonharoldchavez/lumina-cloud-build

The development branch contains interactive labs, an 118-element data index, a four-entry sample timeline, four schematic map locations, and private local perspective drafts. Automated Node tests and a debug Android build passed on the recorded CI run.

Limitations:
- Four timeline events and four locations are a demonstrator, not an atlas-scale history database.
- The map is schematic, not historical GIS.
- Scientific values need property-level sourcing and independent review.
- A successful debug APK build is not a device usability test or production release.
- Data and code licences need careful review before paid distribution.
- No paying educators, learners, retention, or conversion data have been verified.

Potential value: distinctive education product if a complete learning journey is developed and tested with real educators. Build one polished topic pack first; don't try to compete head-on with broad course libraries.

### 7. Other work requiring fresh inspection

The local Workspace, Revenue Recovery Engine, Invariant Monitor, document parser, Gumroad staging packages, and other Termux projects were not available for source inspection through the connected GitHub repositories in this assessment. Prior conversation notes report packaged prototypes and some tests, but that is not enough to rank them above the verified GitHub assets or claim commercial readiness.

Keep **INN System** and **Neotropic Node** as separate projects. Do not fold either into the telemetry product without an explicit technical reason.

## Competitive landscape and differentiation

This is a crowded market. Examples include:
- Datadog, a broad observability platform with infrastructure monitoring and anomaly-detection features. Its pricing page lists Infrastructure Pro starting at $15 per host/month when billed annually: https://www.datadoghq.com/pricing/
- Grafana and the open-source observability ecosystem.
- SigNoz and other OpenTelemetry-oriented monitoring products.
- Dedicated tamper-evident audit-log products such as ImmutableLog: https://immutablelog.com/en/
- Audit-ledger tooling such as Bernstein: https://docs.bernstein.run/en/stable/use-cases/tamper-evident-audit-trail/

Therefore, “monitoring + tamper-evident logs” alone is not unique. A viable wedge must be narrower and demonstrably better for a defined buyer.

Proposed initial wedge to test:
**Local-first telemetry drift monitoring with independently verifiable evidence exports for small engineering teams that cannot or do not want to send sensitive telemetry to a hosted monitoring service.**

Possible differentiators to test, not yet proven:
- Data stays in the customer's environment by default.
- Small deployment footprint and transparent storage.
- Clear alarm metrics with replayable benchmark reports.
- Exportable evidence package that a second party can verify offline.
- Open input/export formats and no mandatory proprietary cloud account.

Do not claim compliance, forensic admissibility, attack-proof security, or superior detection without external review and evidence.

## First customer and revenue experiment

Target one narrow group first: small industrial-IoT integrators, equipment-monitoring consultants, or embedded/telemetry engineering teams. These are hypotheses; interview actual potential buyers before building the product around them.

Offer a **paid pilot service**, not a large SaaS platform:
1. Customer supplies a sanitized sample CSV/JSONL telemetry stream or uses a synthetic public sample.
2. We configure a replayable benchmark and document the detector's false alarms, missed detections, and delay.
3. We demonstrate a tamper-evident event export and offline verification.
4. We deliver a short integration report and a local proof-of-concept.
5. The customer decides whether it solves a real problem and whether to pay for an integration.

Do not use customer-sensitive data without written permission and a privacy/security plan.

Initial pricing hypothesis to test only after interviews:
- Small fixed-scope evaluation: $250–$750.
- Custom integration pilot: $1,000–$3,000.
These are experimental quotes, not market-validated rates. The customer must see a clear measurable benefit before being asked to pay.

## 30-day execution order

### Days 1–3: evidence and packaging
- Freeze feature scope.
- Reconcile license files, package metadata, ownership, and commercial terms for both projects.
- Produce a one-command demo using only synthetic/public data.
- Add a threat-model and limitations page for the integrity ledger.

### Days 4–10: comparative technical proof
- Compare Streaming Guardian with simple baseline detectors under the same scenarios.
- Test on at least one public time-series dataset with documented provenance.
- Add integration tests proving that each telemetry batch is recorded and that intentional edits are detected by the verifier.
- Run CI on all supported Python versions and publish raw benchmark outputs.

### Days 11–17: buyer validation
- Prepare a two-minute demo and one-page technical brief.
- Contact 15 carefully selected prospective users/consultants; ask about their current monitoring, false-alarm costs, audit/evidence needs, and willingness to pay.
- Do not claim customer interest until someone actually responds.

### Days 18–30: paid pilot attempt
- Deliver a pilot only if a buyer agrees to a defined scope and price.
- Record time to integrate, defects, resource usage, measured benefit, and support burden.
- If nobody shows willingness to pay, change the target problem before adding features.

## What not to do now

- Do not create another broad platform or add unrelated features.
- Do not buy paid plugins or services before a customer need is known.
- Do not integrate payment processing until a real paid offer, terms, refunds, privacy notice, and delivery process exist.
- Do not put Stripe secret keys, customer data, or private telemetry into GitHub.
- Do not merge the Living Atlas draft PR merely to make progress appear larger.
- Do not treat PyPI downloads, GitHub stars, CI passes, or a generated APK as revenue evidence.

## Plugin and tool decision

No additional plugin is required to validate the technical product. GitHub Actions, the existing Python test/benchmark stack, and a static demo are sufficient for the next proof stage. Render is not required for the local-first pilot and its separate failing Resonance service should not be repurposed blindly.

Only add a payment connector after a buyer agrees to purchase. Only add email/CRM integrations if actual customer outreach volume justifies them. Prefer no-cost tools until revenue supports more.

## Bottom line

Yes: there is substantive work here. The most credible technical assets are **Streaming Guardian** and **Lumen SDK**, with real source code, tests/benchmarks, package/repository history, and a plausible combined engineering use case. That does not mean they are already valuable businesses. Their value becomes real when an independent user can solve a problem with them, verify the result, and is willing to pay.

The next milestone is not another grand invention. It is one reproducible demo, one measured customer problem, and one paid pilot.
