# EvidenceBench v0.1

A self-contained, local-first paired-experiment analyzer. Open `index.html` in a modern browser; no build step, account, server, or third-party runtime dependency is required.

## Current functionality

- Imports a CSV file locally in the browser.
- Lets the analyst choose pair ID, condition, and numeric outcome columns.
- Matches complete pairs and reports incomplete/ignored rows.
- Calculates the mean paired difference (B − A), sample standard deviation, and paired standardized effect size.
- Produces a deterministic percentile bootstrap interval (10,000 resamples; fixed seed).
- Runs a two-sided sign-flip permutation test (exact through 18 pairs; Monte Carlo with 20,000 draws above 18).
- Exports a JSON analysis record and a CSV of matched pairs.
- Includes sample data for a quick smoke test.

## Data format

One row per observation, with a stable pair identifier, a condition label, and a numeric outcome. Each pair should have exactly one observation for each of the two selected condition labels. Duplicate pair/condition rows are rejected. Incomplete pairs are excluded and counted; no imputation is performed.

## Important limitations

This is an early utility, not a validated statistical package. The analyst is responsible for the study design, sampling process, measurement validity, and assumptions. The bootstrap interval is a percentile interval and may have imperfect coverage, especially with small samples. The sign-flip test requires an appropriate exchangeability/symmetry justification. The tool does not perform causal identification, multiple-comparison correction, power analysis, missing-data imputation, or independent validation.

The report records the selected columns, method settings, counts, results, and matched observations. The report timestamp is generated on the user's device. No telemetry or data upload is implemented.

## Release status

Prototype / internal evaluation only. Before charging for it or describing it as validated, add automated tests for CSV edge cases and statistical calculations, independently verify the numerical methods against trusted reference implementations, review the parent repository's license and dependencies, conduct mobile-browser testing, and obtain appropriate legal review. No paid features or payment processing are included.
