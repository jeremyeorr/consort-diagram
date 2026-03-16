# CONSORT Flow Diagram Builder

A web-based tool for researchers to create publication-quality [CONSORT](http://www.consort-statement.org/) (Consolidated Standards of Reporting Trials) flow diagrams. Fill in your trial numbers in a simple form and get a live-updating flowchart ready for journal submission.

Based on the **CONSORT 2025** flow diagram template.

## Features

- **Live preview** — the flowchart updates instantly as you type
- **Standard CONSORT phases** — Enrolment, Allocation, Follow-Up, and Analysis
- **Multi-arm support** — start with 2 arms (Intervention / Control) and add more as needed
- **Multiple follow-up periods** — add additional follow-up time points for longitudinal studies
- **Export to SVG** — crisp vector graphics at any resolution, ideal for journal figures
- **Export to PNG** — high-resolution (3x) raster image for presentations and posters
- **Fully client-side** — no data leaves your browser; nothing is sent to a server
- **No account required** — just open the page and start building

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later

### Install and run

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

The output is in the `dist/` folder and can be deployed to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).

## How to Use

1. **Fill in your numbers** — use the form on the left to enter participant counts for each phase of your trial
2. **Watch the diagram update** — the flowchart on the right reflects your data in real time
3. **Customize arms** — click "+ Add arm" to add a third (or more) treatment group
4. **Add follow-up periods** — click "+ Add period" if your trial has multiple follow-up time points
5. **Export** — click "Export SVG" or "Export PNG" to download your finished diagram

## CONSORT Diagram Structure

The generated flowchart follows the standard CONSORT flow:

```
Assessed for eligibility ──→ Excluded
        │
    Randomised
     ┌───┴───┐
Arm 1         Arm 2        ← Allocation
  │             │
Arm 1         Arm 2        ← Follow-Up
  │             │
Arm 1         Arm 2        ← Analysis
```

Each box includes fields for participant counts (`n = `) and free-text reasons where applicable (e.g., reasons for exclusion, loss to follow-up).

## Tech Stack

- **[Svelte 5](https://svelte.dev/)** — reactive UI framework with minimal overhead
- **[Vite](https://vitejs.dev/)** — fast dev server and bundler
- **Hand-crafted SVG** — deterministic layout engine for publication-quality output (no external charting library)

## Project Structure

```
src/
  main.js                          # App entry point
  App.svelte                       # Root component (layout + state)
  lib/
    data.js                        # Data model and defaults
    layout.js                      # SVG layout engine (box positions, arrows)
    export.js                      # SVG/PNG export utilities
  components/
    form/
      FormPanel.svelte             # Scrollable form container
      EnrollmentForm.svelte        # Enrolment phase inputs
      AllocationForm.svelte        # Allocation inputs (per arm)
      FollowUpForm.svelte          # Follow-up inputs (per arm)
      AnalysisForm.svelte          # Analysis inputs (per arm)
      NumberInput.svelte            # Reusable number input component
    diagram/
      DiagramPreview.svelte        # Preview container
      DiagramSvg.svelte            # SVG renderer
    ExportMenu.svelte              # Export buttons
  styles/
    global.css                     # Global styles and CSS variables
```

## License

MIT
