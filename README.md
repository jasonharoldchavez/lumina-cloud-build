# Maker Arcade + Living Atlas — ChronoQuest candidate v0.7.1

This candidate restores the saved **Living Atlas Integrated Intelligence Workbench v0.7.0** as the product base, rather than narrowing the experience to the four-lab prototype. The original creative canvas, research surfaces and seven core application modules are preserved within the single-file local-first app.

## Added in this candidate

- **ChronoQuest:** 44 curated, category-matched mini-missions covering every World Library field across 11 collections. Each mission has four answer choices and an explanatory response. Answer order is shuffled on each play.
- **Field-level launch:** every field brief includes a button that starts its matching quest.
- **Timeways:** a 14-milestone, source-linked science-and-technology chronology from Euclid to the 2012 Higgs-boson announcement, with period filters and an oldest-to-newest ordering challenge.
- **Local progress:** completed missions and points are stored in browser local storage only. No network ingestion, accounts, leaderboards, cameras, microphones, location, or background observation are used by the new game layer.
- **Single-file local edition:** the app is self-contained at `www/index.html`; the Render static site can continue publishing the `www` directory.

## Existing Living Atlas capabilities preserved

The v0.7.0 base includes the Maker Arcade art canvas, 44-field World Library, interactive science benches, Integrated Intelligence Workbench, Multidimensional Synthesis, Pattern Forge, Equation Studio, Coupled Resonance Lab, connected knowledge graph, cultural motifs/history catalog, dataset/reference catalog, Synthesis Foundry, research notebook and exports. These remain distinct modules; the page does not claim to execute external ASIE, INN, Neotropic or Lumen runtimes without an explicit tested adapter.

## Verification

- JavaScript syntax checks passed for all seven preserved core scripts and ChronoQuest before bundling.
- Three Node tests passed locally, covering 44 field missions, the 14 chronological source-linked milestones, and local progress configuration.
- Static HTML checks found no duplicate element IDs and confirmed the page has no external script or stylesheet dependencies.
- A matching repository test is included to run in GitHub Actions.

## Release status and limitations

This is a **candidate, not a public release**. Physical Android installation, cross-browser/device testing, accessibility review, dependency advisory triage, legal/licensing review, release signing and final release validation remain outstanding. The deployed `main` branch is unchanged by this feature branch until the pull request is reviewed and merged.
