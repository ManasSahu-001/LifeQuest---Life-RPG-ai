---
name: gsd
description: >-
  Autonomous execution protocol for delivering robust, production-grade features rapidly.
  Use when undertaking intensive multi-step development, building full-stack applications,
  or following high-velocity iterative engineering sprints.
---

# GSD Execution Protocol

The GSD (Get Stuff Done) skill guides autonomous, end-to-end execution without stall or unnecessary back-and-forth.

## Core Tenets

1. **Velocity with Rigor**: Deliver high quality without cutting corners on error handling, security, or stability.
2. **Server-Authoritative First**: Never trust frontend inputs for business logic, XP, currency, or permissions.
3. **Atomic Resilience**: Database operations spanning multiple tables must run within atomic transactions.
4. **Graceful Fallbacks**: Ensure services, APIs, and databases degrade gracefully and log clear diagnostics.
5. **Continuous Verification**: Build, test, and verify after each phase before proceeding to the next.

## Execution Workflow

1. **Scaffold & Configure**: Set up types, dependencies, scripts, and base structure cleanly.
2. **Data Model & Migrations**: Define relational integrity, foreign keys, indexes, and cascades first.
3. **API Implementation**: Create secured controllers, input validation, and user isolation.
4. **UI & Design System**: Connect shared components, theme tokens, and interactive feedback.
5. **End-to-End Verification**: Validate complete user journeys against test scenarios.
