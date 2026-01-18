# Body Part Slugs

Complete alphabetical list of all 44 body part slugs available in react-body-highlighter.

## All Slugs

- abs
- hair
- head
- left-adductors
- left-ankles
- left-biceps
- left-calves
- left-chest
- left-deltoids
- left-feet
- left-forearm
- left-gluteal
- left-hamstring
- left-hands
- left-knees
- left-lower-back
- left-neck
- left-obliques
- left-quadriceps
- left-tibialis
- left-trapezius
- left-triceps
- left-upper-back
- neck
- right-adductors
- right-ankles
- right-biceps
- right-calves
- right-chest
- right-deltoids
- right-feet
- right-forearm
- right-gluteal
- right-hamstring
- right-hands
- right-knees
- right-lower-back
- right-neck
- right-obliques
- right-quadriceps
- right-tibialis
- right-trapezius
- right-triceps
- right-upper-back

## Usage

```tsx
import { Body, BodyPartSlug } from 'react-body-highlighter';

const slug: BodyPartSlug = 'left-biceps';

<Body data={[{ slug, color: '#ff6b6b' }]} />
```

## Notes

- Bilateral muscles use `left-` and `right-` prefixes
- `neck` is centerline for front view; `left-neck`/`right-neck` are for back view
- All slugs are lowercase kebab-case
