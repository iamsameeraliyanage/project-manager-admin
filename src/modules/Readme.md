# Modules

This folder contains reusable modules used across the project. Each module may include logic, state management, and API integrations that are encapsulated and self-contained, ensuring they do not affect other parts of the app unexpectedly.

## Purpose

- Encapsulate feature-specific logic, such as API calls, data transformation, or state handling.
- Promote modularity and separation of concerns in the codebase.
- Modules can be reused across pages or components without tight coupling.

## Characteristics

- May include API calls, but are designed to avoid side effects outside their scope.
- Can include custom hooks, helpers, or internal state if needed.
- Should expose clean, predictable interfaces.

## What Not to Do

- Do not include presentational UI components (put those in the components/ folder).
- Do not tightly couple module logic with specific pages or layouts.
