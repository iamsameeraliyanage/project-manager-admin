# Widgets

This folder contains widgets, which are reusable UI blocks composed of multiple atomic components.

## Purpose

- Serve as higher-level UI compositions that bring together multiple components from the components/ folder.
- Promote reuse of grouped UI logic and presentation across pages.
- Useful for building feature-specific blocks (e.g., a user card, testimonial slider, feature grid).

## Characteristics

- Widgets can include layout logic and local state if needed.
- Often used within pages, layouts, or even other widgets.
- Serve as a middle ground between atomic components/ and full pages/.

## What Not to Do

- Do not place low-level atomic UI elements here — those belong in components/.
- Do not include unrelated business logic or API calls — use modules/ for that.
