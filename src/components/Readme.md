# Purpose

- Centralized place for atomic and composite UI elements (e.g., buttons, modals, inputs).
- Promotes consistency and reusability across the app.
- Components here are presentational only — they do not handle business logic or data fetching.

# What not to do

- Do not call API endpoints from components in this folder.
- Do not include page-specific logic or layout structures here.

# Best Practices

- Keep components stateless and focused on rendering.
- Use props to make components flexible and customizable.
- If a component has side effects or needs data, lift that logic to a higher level (e.g., hooks or containers).
