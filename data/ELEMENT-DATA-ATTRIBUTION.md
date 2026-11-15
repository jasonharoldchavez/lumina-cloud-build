# Living Atlas — Element data attribution

## Data included

The offline element reference is a reduced derivative of the compiled `src/data/elements.json` from Open Apps Studio's open-source periodic-table project:
https://github.com/Open-Apps-Studio/periodic-table

Upstream file:
https://raw.githubusercontent.com/Open-Apps-Studio/periodic-table/master/src/data/elements.json

The source project documents that its element dataset merges:
- Bowserinator / Periodic-Table-JSON — core element data, CC BY-SA 3.0.
  https://github.com/Bowserinator/Periodic-Table-JSON
- PubChem Periodic Table (NLM/NCBI) — selected properties and discovery metadata; U.S. government data is public domain.
  https://pubchem.ncbi.nlm.nih.gov/periodic-table/
- periodic-table-data-complete by Scott Weaver — extended material, magnetic, hardness, resistivity and conductivity properties; MIT.
  https://github.com/sweaver2112/periodic-table-data-complete
- Wikidata — supplemental entity and discovery metadata; CC0.
  https://www.wikidata.org/wiki/Wikidata:Data_access

See the upstream attribution record:
https://github.com/Open-Apps-Studio/periodic-table/blob/master/ATTRIBUTION.md

## Changes made for Living Atlas

Living Atlas keeps a selected subset of structured fields for the 118 confirmed elements: identifiers, periodic-table positions, category, phase, atomic mass, density, melting/boiling temperatures, Mohs hardness, magnetic type, electrical and thermal conductivity, electron configuration, electronegativity, discovery attribution, discovery location, year, and a reference link. Images and long-form summaries are not redistributed in this subset.

Missing upstream values are kept as null and displayed as unavailable—not guessed or replaced with zero. Values for superheavy elements may be theoretical predictions and are marked as such in the interface. Density units are g/cm³, temperatures are K, Mohs hardness is on the Mohs scale, electrical conductivity is S/m, and thermal conductivity is W/(m·K), following the compiled source transformation documented in the upstream build script.

## Licensing notice

This extracted data includes material derived from Bowserinator's CC BY-SA 3.0 dataset. The adapted Bowser-derived element data is therefore provided under CC BY-SA 3.0, with attribution and a link to the license:
https://creativecommons.org/licenses/by-sa/3.0/

Additional merged values retain their upstream terms as described above. This data file is not covered solely by the application's code license. Do not remove this attribution when copying or redistributing the element data.

The app's own source code may have a separate license; check the repository's code license independently before commercial distribution.
