# Work Term Report Site — Design Spec

## Concept: the timeline is the argument

Existing student sites stack terms vertically and the page becomes unreadable. This site
instead treats the sequence of terms as the primary navigation *and* as the substance of the
reflection.

The current term is the graded report. Earlier terms are present at lower resolution, and
their job is to make progression visible: a goal marked unmet in Term 1 resolves in Term 2;
a skill introduced in Term 2 becomes a responsibility in Term 3. That thread is the thing no
existing example has, and it's what the rubric's "reflection" criterion is actually asking for.

## Guelph's six required sections → site sections

Section names stay literal so an advisor grading against the checklist can find each one.

| Required | Where it lives |
|---|---|
| Abstract / Introduction | Hero + intro block. What the reader should take away. |
| Employer Information | Per-term employer panel: description, relevance to computing, notable facts |
| Goals | Per-term goals with an explicit state: `met` / `partially met` / `unmet` |
| Job Description | Per-term project detail: overview, what was unique, skills required |
| Conclusions | Closing section on the current term, drawing the cross-term thread |
| Acknowledgments | Named people, per term |

## Layout

1. **Header** — name, program, student ID, email. Contact info is a requirement, not a flourish.
2. **Introduction** — abstract. Short. States the takeaway up front.
3. **Timeline spine** — horizontal on desktop, vertical on mobile. One node per term with
   employer, role, dates. Node click switches the term detail below it. Current term is
   visually dominant and selected by default.
4. **Term detail panel** — the four per-term sections (Employer, Job Description, Goals,
   Acknowledgments), swapped by timeline selection.
5. **Goal progression view** — the differentiator. Goals tracked *across* terms, showing
   which carried forward and which closed. This is where unmet goals get honest space
   instead of being buried.
6. **Conclusions** — current term, plus the arc.
7. **Footer** — submission metadata, last updated.

## Design constraints

- **Imagery is a scored criterion.** Employer logos, architecture diagrams, screenshots of
  shipped work, the timeline itself. No stock photography — it reads as filler to a grader.
- **Unmet goals get equal visual weight to met ones.** Different state color, same size.
  Shrinking them signals evasion.
- **Must survive being sent to a recruiter.** It is read by faculty, future co-op students,
  and employers.
- **Cross-browser and cross-OS**, per the Guelph spec.
- **One interactive component, not stacked screens.** Term switching is React state.
- **Responsive at every width.** Timeline reflows horizontal → vertical.
- **Confidentiality.** Describe systems and decisions, not proprietary internals. Screenshots
  may need redaction.

## Open — needs the student's real details

- Program, year, student ID
- Per term: employer, role title, dates, what was actually built
- Which term is the graded one
- Whether employer logos/screenshots can be published
