# Phase 3: Polish + Publish - Context

**Gathered:** 2026-01-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the package accessible and documented for publication to npm. Includes ARIA accessibility for assistive technology, README documentation with examples, and body part slug reference. Does not include new features or API changes.

</domain>

<decisions>
## Implementation Decisions

### README structure
- Visual first — show screenshot/GIF of the component before installation instructions
- Include link to live demo (CodeSandbox or StackBlitz)
- Full API reference in README — complete prop descriptions, types, defaults
- Brief mention of v4 being a web-only rewrite, no migration guide needed

### Slug documentation
- Alphabetical list of all 44 slugs
- Simple list format — no view information (front/back/both)
- Separate file (BODY_PARTS.md or similar) linked from README
- No TypeScript type definition shown — just the slug strings

### Code examples
- Lead with full interactive example (click to toggle highlights)
- TypeScript examples only
- 1-2 examples in README (keep minimal)
- Show male/female and front/back variants explicitly in examples

### Claude's Discretion
- Accessibility ARIA pattern specifics
- Screenshot/GIF creation approach
- Which CodeSandbox/StackBlitz to use
- Exact README section ordering beyond visual-first
- Slug file naming (BODY_PARTS.md vs SLUGS.md vs similar)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for accessibility and documentation.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-polish-publish*
*Context gathered: 2026-01-18*
