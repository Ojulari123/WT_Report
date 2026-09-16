# Work Term Report — Website

A multi-term co-op work term report, designed as a website rather than a document.

## Where things are

| | |
|---|---|
| Research on the genre and rubric | [docs/RESEARCH.md](docs/RESEARCH.md) |
| Design decisions and verification | [docs/V2_DIRECTION.md](docs/V2_DIRECTION.md) |
| Component source (mirror of the canvas) | [src/](src) |
| Generated photography | [assets/generated/](assets/generated) |
| Design spec and section mapping | [docs/DESIGN_SPEC.md](docs/DESIGN_SPEC.md) |
| MagicPath project (canvas) | `450653382588375040` |
| MagicPath component | `gracefully-home-3274` |
| Live preview | https://api.magicpath.ai/v1/gracefully-home-3274 |

## Design in one line

A typeset technical report that lives on the web. The front matter conventions of a real work
term report (typographic title page, signed letter of submittal, numbered contents, numbered
sections and figures, appendix, signature block) make it legible as one.

All four co-ops sit behind a switcher rather than stacked down one page. The latest loads
first; selecting a term from the contents list, from Exhibit A, or from a Table 5.1 column
heading swaps it into sections 2.0 to 4.0, which report every placement at the same depth.
Table 5.1 tracks four recurring goals across all four terms, which is where the reflection
lives.

See [docs/V2_DIRECTION.md](docs/V2_DIRECTION.md) for the design decisions and verification.


## Content status

**The report text is sample content.** Everything in `reportData.ts` is a placeholder written
to the right shape and length — employers, roles, dates, goals, and reflections are invented.
Replace the values; the structure maps 1:1 onto the six graded sections.

To pull the component source locally:

```bash
npx magicpath-ai inspect gracefully-home-3274 -o json
```

## Grading notes worth keeping in mind

Guelph's rubric separates "Good" from "Outstanding" on two things only: depth of reflection,
and imagery. That is why the site includes a system diagram and a visual goal-progression
matrix rather than decorative photography, and why unmet goals are given the same visual
weight as met ones.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` produces the production build, `npm run lint`
runs ESLint. The design tokens (palette, type scale, print rules) all live in
`src/app/globals.css`; there is no `tailwind.config.js`.
