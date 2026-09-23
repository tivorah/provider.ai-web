# Provider.ai styling standard

Provider.ai uses Tailwind CSS v4 for all ordinary interface styling.

Use Tailwind utilities for:

- layout, width, height, spacing and responsive behaviour;
- typography, font size, weight and line height;
- colours, borders, radii and shadows;
- hover, focus, disabled and selected states;
- standard transitions and transforms.

Shared design tokens live in `src/tailwind.css`. Reuse the `brand`, `ink`,
`muted`, `line`, `canvas`, `positive`, `warning` and `danger` tokens instead of
introducing new hard-coded values.

Plain CSS is allowed only when a Tailwind utility would make the behaviour
materially harder to understand. Current approved exceptions are:

- the 24-hour roster time canvas and absolutely positioned shift geometry;
- drag-and-drop landing indicators and collision previews;
- keyframe animations;
- browser-specific scrollbar treatment.

New screens must not add feature stylesheets. Add utilities directly to the
React component or create a reusable Tailwind `@utility` in `src/tailwind.css`.

## Shared page patterns

- Public pages use `PublicShell`, `marketingWidth`, `marketingHeading` and
  `marketingAction`. The homepage explains the audience, jobs and product before
  secondary messages. Use actual product previews with visible demo provenance.
- Active workspace pages use `PageHeader` for the category, title, description
  and primary action. Do not recreate page-heading styles per feature.
- Summary surfaces use `summary-grid`, `summary-card`, `SummaryStat` and
  `FinanceKpi`. Keep non-status metrics neutral.
- Forms use `workspace-field`; actions use `primary-button` and
  `secondary-button`; scrollable sections can use `workspace-tabs`.
- Use DM Sans throughout. Default root size is 16px; the saved display settings
  adjust it to 14, 16, 18 or 20px. Avoid labels below 11px in workspace modules.
- Keep panels white with neutral 1px borders and 12px radii. Use a charcoal
  primary action, restrained blue for selection and links, and semantic colours
  only where status needs emphasis. Avatars use a consistent neutral-blue tone.
- On mobile, large tables and tab lists scroll inside their own containers;
  the document itself must not overflow horizontally.

The legacy stylesheet still contains specialised feature layout rules. Reuse
shared primitives for new work and remove superseded per-page rules as pages
are migrated; do not introduce another independent visual theme.
