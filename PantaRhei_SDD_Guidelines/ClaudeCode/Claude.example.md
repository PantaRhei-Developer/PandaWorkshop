This document defines the project's rules, objectives, and progress management methods. Proceed with the project according to the following content.

# Common Guidelines
- You must think exclusively in English. However, you are required to respond in Japanese.
- We practice Specification-Driven Development (SDD). First, we and you write accurate specifications, and then implement them.
- To maximize efficiency, if you need to execute multiple independent processes, invoke those tools concurrently, not sequentially.
- To understand how to use a library, always use the Contex7 MCP to retrieve the latest information.

## Programming Rules

- Avoid hard-coding values unless absolutely necessary.
- Do not use `any` or `unknown` types in TypeScript.
- You must not use a TypeScript `class` unless it is absolutely necessary (e.g., extending the `Error` class for custom error handling that requires `instanceof` checks).


## How to write specifications

This section defines the rules to be followed when you are instructed to create a specification document.

1. Self-Review Requirement: Once the specification document is complete, you must perform a self-review.
2. Scoring and Revision: If your self-evaluation score is not 90 points or higher, you must revise the document again.
3. Core Review Criterion: The core criterion for the self-review is: "If this specification were given to 10 different people, would all 10 of them build the exact same thing?"
4. Prioritize Reproducibility: Prioritize reproducibility above all else. This includes precise details like button placement, consistent design application, and business logic.

5. Component Reuse: Always reuse existing components when available. Do not duplicate similar logic or functionality.

6. Clarification: If anything is unclear, you must ask questions until it is completely resolved.

# Write Spec Guidelines
## Specification Directory Structure

```
/docs
├── structure.md
└── spec/
    ├── components/
    ├── screens/
    ├── models/
    ├── services/
    ├── themes/
    ├── repositories/
    └── providers/
```

### structure.md

Project directory structure diagram (not for docs, but for the entire project)
Limited to approximately 4 hierarchy levels of directory structure.

### components

Reusable UI components specifications. Each component should have its own specification file describing:
- Component interface (props, events)
- Visual design and behavior
- States and interactions
- Usage examples and constraints

### screens

One specification per screen. If URL doesn't change, represent it as a component instead.
Each screen specification should include:
- Screen layout and UI structure
- User interactions and navigation flow
- Data requirements and state management
- Error handling and edge cases

### models

Data model definitions and specifications. Include:
- Entity relationships and structure
- Data validation rules
- Type definitions and interfaces
- Database schema if applicable

### services

Business logic and external service integration specifications. Define:
- API endpoints and data contracts
- Service methods and their responsibilities
- Error handling and retry logic
- Authentication and authorization requirements

### themes

Design system and styling specifications. Cover:
- Color palette and typography
- Spacing and layout guidelines
- Component styling variants
- Responsive design breakpoints

### repositories

Data access layer specifications. Document:
- Data source abstractions
- CRUD operations and query methods
- Caching strategies
- Data synchronization logic

### providers

State management and context provider specifications. Include:
- Global state structure
- State update patterns
- Provider dependencies and initialization
- Performance considerations



# Coding Guidelines
TBD
# Github Guidelines
TBD
