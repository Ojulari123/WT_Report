# v2 redesign — direction and state

Paused mid-build on 2026-09-15 at the user's request. Nothing half-built was submitted;
the MagicPath canvas still shows the working v1. Resume from here.

## Why v1 failed

v1 looked like a SaaS portfolio template: neutral grey, pill nav, rounded cards, sans
throughout. Nothing about it said "academic document submitted for assessment." The genre
cues were all missing.

## The v2 concept

**A typeset technical report that lives on the web.** Keep Guelph's six required sections as
the content; dress them in the front-matter conventions that make a work term report legible
as one. Those conventions are real and were confirmed in research:

- Title page with course code, employer, term dates, submission date
- **Letter of submittal**, signed, addressed to the report coordinator (required by Waterloo
  Civil and MME; Software Engineering explicitly dropped it, so it is a genuine convention
  rather than an invention)
- Table of contents, numbered, with a list of figures
- Numbered body sections (1.0, 2.0, ...) that the contents actually references
- Figure and table captions that carry numbers (Figure 3.1, Table 5.1, Exhibit A)
- Appendix A for the professional log
- Signature and submission block
- A confidentiality note

Plus web affordances a paper report cannot have: reading progress, term switcher, the
expandable goal ledger, and the cross-term progression matrix.

## Design read

Reading this as: an academic report document for a faculty assessor and future recruiters,
with a typeset-publication language, leaning toward Tailwind v4 + the IBM Plex trio +
Tufte-style margin notes.

Dials: `DESIGN_VARIANCE 6 / MOTION_INTENSITY 3 / VISUAL_DENSITY 4`

## Locked decisions

| Decision | Value | Reasoning |
|---|---|---|
| Type | IBM Plex Serif (display + body), IBM Plex Sans (labels, nav), IBM Plex Mono (numbers, figure labels) | Publication/manuscript register. Plex has genuine technical-institutional character. Not Fraunces, not Instrument Serif. |
| Corner radius | 0 everywhere | The single biggest reason v1 read as a template. Documents do not have 16px rounded cards. |
| Containers | Hairlines and rules, not cards | Grouping by rule is the document idiom. |
| Accent | Guelph red, one accent, locked page-wide | It is the institution the report is submitted to, so the accent is not arbitrary. |
| Theme | Light only, locked | The skill's print-emulating-editorial exception to the dual-mode default. |
| Motion | CSS transitions only. Hover/active, accordion, term swap, reading progress. | A document should not animate. Motion is reserved for feedback. No Motion library needed, which is just as well since the sandbox does not have one. |
| Icons | Typographic marks (`+` `-` `→`) plus real Simple Icons SVGs via CDN for the tech stack | No icon library in the sandbox, and hand-rolled icon paths are banned. Typographic marks are correct for a document anyway. |
| Section numbering | Kept | Normally an AI tell, but here the table of contents and figure captions genuinely reference it. Numbering replaces eyebrows rather than adding to them. |
| Em-dashes | Zero, audited | Non-negotiable. Also ration the middle dot to one per line. |

## Sandbox constraints (verified, not assumed)

Available: `react`, `clsx`, `class-variance-authority`, `tailwind-merge`, Tailwind v4.
Not available: Motion / Framer Motion, any icon library.

Editable paths only: `src/App.tsx`, `src/index.css`, `src/components/generated/**`,
`assets/**`.

## Assets

Four documentary photographs generated with `magicpath-ai image generate` and preserved in
[assets/generated/](../assets/generated). Consistent desaturated cool palette, no text, no
people, shot-on-film character.

- `cover.png` (16:9) container yard at blue hour, for the title plate
- `term1.png` (4:3) hospital network room, Work Term 1
- `term2.png` (4:3) small office interior, Work Term 2
- `term3.png` (4:3) logistics operations room at night, Work Term 3

Copy them back into the MagicPath working directory's `assets/` before submitting, and
reference them as `../../../assets/cover.png` from a generated component.

## Planned section order and layout families

Deliberately no two sections share a layout family.

1. Cover plate | full-bleed photograph, title block, metadata rail
2. Letter of submittal | single narrow measure, letter format, signature
3. Contents and list of figures | numbered index with leader rules
4. 1.0 Introduction | wide measure plus margin notes
5. Exhibit A, term chronology | full-width typeset exhibit with the three photographs
6. 2.0 Employer information, 3.0 Job description | photographic plate plus text, with Figure 3.1
7. 4.0 Goals | ledger, state in the margin, expandable entries
8. 5.0 Goal progression | real data table, terms as columns
9. 6.0 Conclusions | numbered prose
10. 7.0 Acknowledgments, Appendix A, signature block | document footer

## Build status: four terms behind a switcher, complete

Component `gracefully-home-3274`. Four placements, one on screen at a time, latest loaded
first.

### Structure

| Section | Content |
|---|---|
| Title page | Set entirely in type. No photograph. The four placements as a ruled table |
| Letter of Submittal | Signed, addressed to the report coordinator |
| Contents | Sections with leader rules, plus a work-term list that swaps the placement, plus figures and tables |
| 1.0 | Introduction, with margin notes |
| Exhibit A | Chronology. Four entries, roving tabindex, each showing its goal states as marks |
| 2.0 | Employer Information, for the selected term. Plate and facts in the side column |
| 3.0 | Role and Project. Figure 3.1 appears on the latest term only |
| 4.0 | Goals. Numbered 4.1 onward, expanding to target, outcome, evidence |
| 5.0 | Goal Progression. Table 5.1, four columns, with numbered notes |
| 6.0 | Conclusions |
| 7.0 | Acknowledgments, for the selected term |
| Appendix A | Professional log, one row per term |

Section numbers are fixed rather than per chapter, because only one placement is on screen at
a time. Each head carries a sub-line naming the term it is currently reporting.

### Three decisions that were reversed, and why

1. **Photograph on the title page, removed.** Two subjects were tried: a container yard, which
   belonged to one invented employer rather than to the student, and a desk still life. Neither
   landed. The cover is now pure type, which also matches the typography the student said they
   preferred. Imagery for the rubric still comes from the four plates and Figure 3.1.
2. **Four inline chapters, reverted to a switcher.** All four terms inline at equal depth ran to
   20,135px and read as an endless page. Behind a switcher the document is 10,195px and no term
   is summarised, because selecting one reports it in full. This was the earlier structure, and
   returning to it was the student's call.
3. **Interstitials became carried-in notes.** With one term on screen there is no "between two
   chapters", so the connective text now attaches to the top of the term it leads into, labelled
   "Carried in from Work Term N". Work Term 1 correctly has none.

### Verified

Driven against the live preview at 1265px and 390px.

| Check | Result |
|---|---|
| Title page carries no image | 0 images in the cover section |
| Default load | Work Term 4, Meridian Logistics, tab index 3 selected |
| Swap from the contents work-term list | 4 entries, all swap correctly |
| Swap from the chronology tablist | Works, updates `aria-selected` |
| Swap from a Table 5.1 column heading | 4 headings, all swap correctly |
| What a swap updates | Employer heading, all three section sub-lines, goal count, acknowledgments, carried-in note, tab state |
| Figure 3.1 scoping | Present on the latest term only, absent on the other three |
| Carried-in notes | Terms 2, 3, 4 have one; Term 1 has none |
| Document length | 10,195px at 1265px, down from 20,135px |
| Mobile at 390px | No overflow, chronology to one column, Table 5.1 to 4 stacked blocks, cover table keeps 4 rows |
| Em-dashes and middle dots | Zero |

### Verification limit

`IntersectionObserver` reports zero callbacks while the host's browser pane is collapsed,
including its initial one, because intersection needs rendering. Screenshots past the first
viewport come back blank for the same reason. So the observer-driven behaviour, meaning the
running-head label, the nav highlight and the header revealing itself past the title page,
**has never been exercised**. The logic returns the correct section when evaluated directly
against element rects, but it wants a look in a normally rendered browser.

### Notes for future edits

- After any submit that includes images, MagicPath rewrites asset URLs and the local working
  directory goes stale. Re-run `code start --component 450659130168991744 --dir <workdir>`
  before editing again.
- That resync reformats the source, so string-match patches written against the pre-resync file
  will not apply, including multi-line prop signatures collapsing to one line. Re-read first.
- The resync also restores previously deleted files. Delete them again before submitting.

## Still outstanding

The report prose is all placeholder, including the invented third placement, and the
Guelph-versus-Northeastern question is still open. See [DESIGN_SPEC.md](DESIGN_SPEC.md).
