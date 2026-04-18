# Course Section Visual Scope

## Goal

Ship a focused CourseSection update that improves homepage conversion at the
decision gate without mixing in unrelated homepage polish.

## In scope

1. Extract homepage pricing/support subcomponents from
   [D:\V2\v2badminton-next\src\components\home\sections\CourseSection.tsx](D:/V2/v2badminton-next/src/components/home/sections/CourseSection.tsx)
2. Add a single homepage anchor source of truth in
   [D:\V2\v2badminton-next\src\lib\anchors.ts](D:/V2/v2badminton-next/src/lib/anchors.ts)
3. Rewrite CourseSection cards toward the Figma marketing-pitch pattern:
   - stronger badge hierarchy
   - image overlay + level chip
   - clearer copy rhythm
   - full-width primary CTA
   - secondary schedule CTA stays functional

## Out of scope

- scan optimization across the whole homepage
- hero, testimonials, or schedule redesign
- analytics event renaming
- legacy schedule migration
- CMS/schema changes

## Done when

- CourseSection remains behavior-compatible
- homepage anchors come from one shared source
- `lint`, `build`, and homepage smoke pass all succeed
- changes ship in two commits:
  1. cleanup/contracts
  2. visual/card language
