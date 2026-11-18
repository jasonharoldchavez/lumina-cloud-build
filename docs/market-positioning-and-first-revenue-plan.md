# Living Atlas — market position and first-revenue strategy

**Prepared:** 2026-11-15  
**Status:** Strategy hypothesis for the development branch, not a revenue forecast or a claim of product-market fit.

## 1. The product to build

Do not position Living Atlas as another encyclopedia, periodic table, generic AI tutor, or map app. Those categories already have strong, mature competitors.

**Proposed position:** An offline-first discovery atlas that connects the physical world to human history through small interactive experiments, sourced timelines, places, and carefully labelled perspectives.

The central experience should be a connected learning journey:

1. Choose a material, element, scientific idea, or invention.
2. Explore its properties with a usable interactive model.
3. Follow its development through time and place.
4. See the people, communities, tools, and earlier work involved.
5. Inspect the sources and distinguish documented evidence, testimony, memory, and interpretation.
6. Save the activity or use it as a lesson.

The distinctive value is in the *connections*, not the individual widgets. A periodic table, timeline, or calculator by itself is not a competitive moat.

## 2. Competitive landscape

This is a directional comparison of adjacent products, based on their public product pages reviewed on 2026-11-15. It is not a user study or a market-share analysis.

| Product | What it does well | What that means for Living Atlas |
|---|---|---|
| PhET Interactive Simulations | Free, research-based science and mathematics simulations; its design principles include inquiry, interactivity, multiple representations, and immediate feedback. PhET says it extensively tests and evaluates simulations for educational effectiveness. | We should not claim comparable educational validation. We can learn from its experiment design and eventually test our own activities with learners. |
| Brilliant | Guided, polished interactive courses in math, coding, science, and data analysis; offers step-by-step feedback and a personal tutor. Premium pricing is shown on its site at $20/month or $40/month for a family plan, with annual billing. | We should not try to out-course Brilliant. Our opportunity is cross-linking materials, science, history, geography, and sources rather than reproducing a broad course catalogue. |
| Wolfram|Alpha Pro | Computational knowledge, step-by-step solutions, practice, guided calculators, file analysis, and downloadable results. Its public pricing page shows Pro at $5/month when billed annually and Pro Premium at $8.25/month when billed annually. | We should not claim to be a general computational engine. Our lab calculations must stay narrow, transparent, and independently checked. |
| Google Arts & Culture | Large cultural collections and exploration by artists, movements, historical events, figures, places, and time, including museum and immersive experiences. | It is much stronger in cultural collection breadth and media. Living Atlas needs smaller, deeper, clearly sourced journeys that connect culture to science and materials. |
| World History Encyclopedia | Editorial history content, timelines, maps, teaching materials, primary-source links, a large media library, and a membership/donation model. | We should not compete as a general history encyclopedia. We can connect selected historical stories to experiments, materials, and scientific ideas. |

### The honest competitive assessment

The current prototype is far smaller and less mature than these products:

- Four basic interactive labs are not a replacement for PhET's researched simulation library.
- Four timeline entries and four mapped locations are only a demonstrator, not a meaningful historical database.
- The 118-element index is useful as a reference starting point, but it is not by itself a reason to pay.
- Perspective contributions are private local drafts. There is no public archive, moderation system, contributor account, or editorial review service.
- The current map is a schematic coordinate plot, not a historical GIS or an interactive 3D world.
- The current build has automated syntax and Node tests, but not yet comprehensive browser/device usability testing or independent scientific/educational validation.

These are product gaps to close, not features to advertise as finished.

## 3. Best initial customer

Start with **homeschool educators, independent science educators, and informal learning groups** rather than attempting to sell immediately to school districts or universities.

Why:
- They can evaluate a small, self-contained lesson without a long procurement process.
- They need activities that can be used on a phone or laptop and do not require every learner to create an account.
- A printable lesson/activity pack is a simpler first purchase than a recurring software subscription.
- Their feedback can tell us which connected journeys are genuinely useful.

The first audience is a hypothesis. It must be tested with actual educators and learners.

## 4. The first product worth charging for

Build one complete, unusually good journey rather than adding dozens of shallow features.

### Pilot: Copper — from element to human technology

Include:
- A sourced copper element/material reference.
- A safe, accurate density/conductivity activity with units and clear limitations.
- A timeline covering selected, verified uses and technological changes.
- A map with dated locations and explicit geographic uncertainty.
- A short history of mining, metalworking, trade, and electrical uses, with contributions credited carefully rather than attributing complex changes to one inventor.
- A source panel that distinguishes primary sources, scholarly sources, and general references.
- A printable educator guide, learner worksheet, activity instructions, and answer notes.
- Offline use after installation/download.

The journey should teach something coherent from beginning to end. It must not encourage hazardous home metalworking or chemical experiments.

Other possible follow-up journeys include iron and steel, glass and optics, and silicon and computing. Do not build all of them before the first pilot has been tested.

## 5. Revenue model to test

These are **test prices**, not validated market prices or commitments.

### Free foundation
Keep the core explorer useful: basic labs, the element reference with attribution, a small set of sourced timeline entries, and private local saves.

### One-time exploration packs
Test a $4.99–$9.99 individual pack containing an original guided journey, interactive activity, cited source notes, and printable materials.

### Educator pack
Test a $19–$39 educator licence for one topic pack with classroom/homeschool lesson plans, printable student activities, answer guidance, and offline-use instructions. Ask educators to evaluate the pack before setting the final price.

### Later: school, museum, and group licences
Only pursue annual or multi-seat licences after there is evidence of repeat use, clear support requirements, and a stable distribution/update process.

Do not start with a subscription. A subscription needs recurring value, regular new content, reliable support, and retention evidence that this prototype does not yet have.

## 6. First validation milestones

1. Finish and verify one complete Copper journey.
2. Ask 10–15 target educators or homeschool facilitators to try it; observe where they get stuck and what they actually use.
3. Ask whether they would pay for the educator pack, what budget it would come from, and what would prevent a purchase.
4. Offer a small paid pilot only after the content, licence notices, and delivery flow are checked.
5. Continue only if real users complete the journey and at least some demonstrate willingness to pay.

Do not count page views, GitHub stars, app installs, or compliments as revenue validation. Track completed activities, repeat use, referrals, paid conversions, refunds, and support time.

## 7. Product-quality gates before charging

- **Scientific accuracy:** independently check formulas, units, assumptions, edge cases, and displayed values. Label models and predictions.
- **Historical accuracy:** use credible sources; separate established facts, contested claims, oral testimony, and editorial interpretation.
- **Data provenance:** record the source, licence, date accessed, units, and transformation for each dataset and, where feasible, each property.
- **Accessibility:** keyboard operation, screen-reader labels, contrast, readable small-screen layout, and reduced-motion support.
- **Device testing:** install and operate the Android build on real phones; test offline mode and data persistence.
- **Security and privacy:** keep local drafts local; never collect personal testimony publicly until consent, moderation, reporting, correction, deletion, and appeal processes are implemented.
- **Dependencies:** triage the high-severity npm audit findings reported in the repository before a production release.
- **Legal:** establish the source-code licence and contributor rights. The repository currently has an Apache-2.0 package metadata field but no root LICENSE file was found in the inspected branch. Do not treat that metadata field alone as a completed code-licensing review.

## 8. Element-data licence and commercial implications

The current element-data attribution file says the bundled dataset is a derivative that includes Bowserinator Periodic-Table-JSON material under CC BY-SA 3.0, merged with other datasets that have their own terms.

The Creative Commons BY-SA 3.0 deed permits commercial reuse and adaptations, but requires attribution and ShareAlike for adaptations, and does not permit adding restrictions that prevent others from exercising the licensed rights. Keep the applicable data and notices clearly identified and available. Do not imply that the entire application is automatically under the same licence, or that the application code is automatically cleared for sale. Have the complete source chain and final distribution method reviewed before taking payments.

A safer commercial design is to earn revenue from original lesson design, guided learning journeys, educator materials, convenience, and support—while keeping the reused data under its required licence and preserving the user's ability to access the licence notices.

## 9. Decisions

- Make Living Atlas the flagship product for this line of work; do not split effort across duplicate app storefronts.
- Keep the broken `lumina-resonance-system` Render web service separate from the Living Atlas static site until its purpose is resolved. It is not currently a revenue feature and should not be silently repurposed.
- Keep the Living Atlas feature branch as development until the PR is reviewed and explicitly merged.
- Build one complete learning journey, test it with real people, and validate willingness to pay before adding payment code.
- Do not claim product-market fit, educational efficacy, scientific validation, or a business valuation without evidence.

## Research references

- PhET, About and design principles: https://phet.colorado.edu/en/about
- Brilliant, FAQ and Premium pricing: https://brilliant.org/faq/ and https://brilliant.org/subscribe/
- Wolfram|Alpha Pro pricing: https://www.wolframalpha.com/pro/pricing/
- Google Arts & Culture, Explore: https://artsandculture.google.com/explore
- World History Encyclopedia: https://www.worldhistory.org/
- Creative Commons BY-SA 3.0 deed: https://creativecommons.org/licenses/by-sa/3.0/
- Element-data attribution maintained in this repository: `data/ELEMENT-DATA-ATTRIBUTION.md`
