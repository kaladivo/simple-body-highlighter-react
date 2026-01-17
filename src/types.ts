import React from "react";

/**
 * All valid body part slugs for the body highlighter component.
 *
 * Includes:
 * - 38 bilateral slugs (19 muscle pairs with left/right prefixes)
 * - 4 centerline slugs (abs, head, hair, neck for front view)
 * - 2 back-view-only bilateral neck slugs (left-neck, right-neck)
 *
 * Total: 44 unique slugs
 *
 * @example
 * ```typescript
 * const slug: BodyPartSlug = "left-biceps";
 * ```
 */
export type BodyPartSlug =
  // Bilateral muscles (19 pairs = 38 slugs)
  | "left-adductors"
  | "right-adductors"
  | "left-ankles"
  | "right-ankles"
  | "left-biceps"
  | "right-biceps"
  | "left-calves"
  | "right-calves"
  | "left-chest"
  | "right-chest"
  | "left-deltoids"
  | "right-deltoids"
  | "left-feet"
  | "right-feet"
  | "left-forearm"
  | "right-forearm"
  | "left-gluteal"
  | "right-gluteal"
  | "left-hamstring"
  | "right-hamstring"
  | "left-hands"
  | "right-hands"
  | "left-knees"
  | "right-knees"
  | "left-lower-back"
  | "right-lower-back"
  | "left-obliques"
  | "right-obliques"
  | "left-quadriceps"
  | "right-quadriceps"
  | "left-tibialis"
  | "right-tibialis"
  | "left-trapezius"
  | "right-trapezius"
  | "left-triceps"
  | "right-triceps"
  | "left-upper-back"
  | "right-upper-back"
  // Centerline muscles (4 slugs)
  | "abs"
  | "head"
  | "hair"
  | "neck"
  // View-specific bilateral slugs for neck (back view only - 2 slugs)
  | "left-neck"
  | "right-neck";

/**
 * Data for highlighting a specific body part with a color.
 *
 * Both `slug` and `color` are required fields. This replaces the old
 * intensity-based coloring system with explicit per-part colors.
 *
 * @example
 * ```typescript
 * const highlight: BodyPartData = {
 *   slug: "left-biceps",
 *   color: "#ff0000"
 * };
 * ```
 */
export interface BodyPartData {
  /** The body part to highlight (must be a valid BodyPartSlug) */
  slug: BodyPartSlug;
  /** The fill color for this body part (hex, rgb, or named color) */
  color: string;
}

/**
 * Props for the Body/Model component.
 *
 * The simplified API uses explicit left/right slug prefixes instead of
 * the old `side` property on data items, and uses `onClick` instead of
 * `onBodyPartPress`.
 *
 * @example
 * ```typescript
 * <Body
 *   data={[
 *     { slug: "left-biceps", color: "#ff0000" },
 *     { slug: "right-biceps", color: "#00ff00" }
 *   ]}
 *   onClick={(slug, event) => console.log(`Clicked: ${slug}`)}
 *   gender="male"
 *   side="front"
 * />
 * ```
 */
export interface ModelProps {
  /** Array of body parts to highlight with colors */
  data: BodyPartData[];

  /**
   * Callback when a body part is clicked.
   * Receives the body part slug and the mouse event.
   */
  onClick?: (slug: BodyPartSlug, event: React.MouseEvent<SVGPathElement>) => void;

  /** Gender variant to display (default: "male") */
  gender?: "male" | "female";

  /** Which side of the body to show (default: "front") */
  side?: "front" | "back";

  /** Scale factor for the SVG (default: 1) */
  scale?: number;

  /** Color for the body outline, or "none" to hide (default: "#dfdfdf") */
  border?: string | "none";

  /** Body parts that should appear disabled (grayed out, non-interactive) */
  disabledParts?: BodyPartSlug[];

  /** Body parts that should be hidden completely (not rendered) */
  hiddenParts?: BodyPartSlug[];

  /** Default fill color for non-highlighted parts (default: "#3f3f3f") */
  defaultFill?: string;
}
