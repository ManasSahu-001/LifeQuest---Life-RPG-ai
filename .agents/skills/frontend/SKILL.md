---
name: frontend
description: >-
  Frontend engineering, accessible design systems, responsive UI layout,
  and interactive animation best practices for modern React applications.
---

# Frontend Engineering & Design System Standards

This skill guides the construction of high-performance, accessible, and themeable React user interfaces.

## Standards & Best Practices

1. **Theme Isolation**:
   - Themes must be pure presentation layers.
   - Shared components (`QuestCard`, `CharacterPanel`, `ProgressBar`, `Navbar`) must consume CSS variables and theme tokens dynamically.
   - Never duplicate component logic across themes.
2. **Accessible Interaction (WCAG AA)**:
   - Ensure high contrast ratios on text and background pairs.
   - Support full keyboard navigation with visible focus rings (`focus-visible:ring-2`).
   - Use semantic HTML tags (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`).
3. **Motion & Feedback**:
   - Use Framer Motion for intentional, lightweight micro-interactions.
   - Reward loops: XP gains, level-up celebrations, and quest completions must provide instant sensory feedback without freezing the UI.
4. **Resilient Data Fetching**:
   - Always display meaningful empty states, loading skeletons, and graceful error alerts.
   - Never render a blank screen on network or API failures.
