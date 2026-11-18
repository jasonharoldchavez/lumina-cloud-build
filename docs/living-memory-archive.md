# Living Atlas: Many Voices, One History

Status: product specification and implementation foundation (not yet a public contribution service).

## Purpose

Preserve and explore human accounts of the past alongside documentary history. A contribution can add a perspective, memory, family story, interpretation, or source—not silently rewrite the historical record.

The feature belongs inside Living Atlas and connects to the existing place-and-time exploration model.

## First release: safe, useful scope

1. Browse curated historical events and places.
2. Open a perspective view for an event.
3. Read contributions grouped by evidence type.
4. Inspect provenance, dates, attribution choice, and attached sources.
5. Save a private draft locally.
6. Export a draft for later review or submission.

Do not launch open public publishing in the first release. Public submission requires a server-side review queue, moderation, abuse reporting, consent handling, privacy controls, and a documented correction/takedown process.

## Evidence labels

Every contribution must have exactly one primary label:

- **Documented history** — factual claims supported by cited historical sources. The label describes the claim's evidence, not the contributor's status.
- **Personal testimony** — a first-person account by someone who says they experienced or witnessed something.
- **Family or community memory** — an inherited or community-held account; not necessarily firsthand.
- **Interpretation** — analysis, explanation, or an argument about events.
- **Disputed account** — an account with material conflicts, uncertain provenance, or insufficient corroboration.

Do not automatically treat popularity, repetition, or contributor identity as proof. A personal account may be valuable even when independent verification is unavailable.

## Contribution record

Required:
- stable contribution ID
- title and body
- primary evidence label
- event/place/time association (each may be unknown, approximate, or disputed)
- creation timestamp
- attribution mode: named, pseudonymous, or anonymous
- consent confirmation for material the contributor submits
- provenance note describing how the contributor knows the account

Optional:
- source references and citations
- approximate date range
- language
- community or perspective tags
- media references with rights/permission status
- related contribution IDs
- correction or context notes

Never require a contributor to reveal a legal name, exact home address, family relationship, or sensitive personal details.

## Trust and provenance

- Keep contributor statements separate from editorial summaries.
- Record who added or changed a record and when.
- Preserve revision history; corrections should not silently erase prior versions.
- Distinguish original sources, later copies, oral testimony, family lore, and editorial interpretation.
- Mark AI-generated transcription, translation, or summaries as machine-assisted and retain access to the original where permission allows.
- A citation is a lead to inspect, not a guarantee that the source proves every claim.
- Show disagreement respectfully; do not force a single consensus narrative where evidence remains contested.

## Privacy, consent, and safety requirements

Before public submissions exist:
- explicit permission to publish each text, image, recording, or document
- clear rights/ownership declaration for uploaded media
- visibility choices and pseudonym support
- special care for living people, minors, sensitive family details, and traumatic testimony
- no publication of private contact details or precise residential locations
- report, block, correction, and takedown workflows
- human moderation before public visibility
- rate limits, spam controls, audit logs, and appeal process
- retention and deletion policy, including backups
- accessible plain-language community standards

Do not solicit private records or identifying details about living people. Do not permit harassment, threats, doxxing, incitement, or dehumanizing content.

## Perspective Explorer interaction

1. User selects an event, place, or time period.
2. Atlas presents a sourced historical overview with uncertainty clearly stated.
3. A perspective rail groups available accounts by evidence label and viewpoint.
4. Selecting a contribution opens its text, provenance, sources, date precision, attribution mode, and revision history.
5. Related perspectives can be compared side by side.
6. A visible note explains that testimony and interpretation are not automatically independently verified.

## Initial implementation sequence

### Phase 0 — foundation
- Adopt the contribution data contract in `data/historical-contribution.schema.json`.
- Add a small, reviewed seed dataset with public-domain or permission-cleared material.
- Build a read-only Perspective Explorer against seed records.
- Add local-only draft creation and JSON export; no network publishing.

### Phase 1 — private pilot
- Add a server-side submission API and private review queue.
- Add authenticated reviewer roles, moderation actions, abuse reporting, and audit trail.
- Conduct a privacy and security review before inviting contributors.

### Phase 2 — public archive
- Publish only approved records.
- Add correction, appeal, and takedown workflows.
- Add community moderation with escalation and transparent policy.
- Measure quality by provenance and usefulness, not submission volume.

## Acceptance criteria for the first usable increment

- Every displayed contribution has a valid evidence label and provenance note.
- Unknown or approximate dates and locations are represented honestly.
- No user draft is transmitted over the network.
- Drafts can be edited, deleted, and exported by the user.
- UI never presents an unreviewed draft as public or verified history.
- The app works on a narrow Android screen and with keyboard/screen-reader navigation.
- Tests cover schema validation, unsafe/missing required fields, and local draft persistence.

## Explicit non-goals

- No crowdsourced rewriting of established facts.
- No automated truth score or credibility ranking.
- No face recognition, people tracking, or surveillance.
- No public upload endpoint before moderation and privacy controls are implemented.
- No implication that a first-person account is false merely because corroboration is absent.
