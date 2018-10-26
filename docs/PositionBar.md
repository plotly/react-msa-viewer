# `PositionBar` (component)

Displays the sequence names with an arbitrary Marker component

## Props

### `cacheElements`

defaultValue: `10`


### `font`

Font of the sequence labels, e.g. `20px Arial`

type: `string`


### `height`

Height of the PositionBar (in pixels), e.g. `100`

type: `number`
defaultValue: `15`


### `markerAttributes`

Attributes to apply to each marker.

type: `object`


### `markerComponent`

Component to create markers from.

type: `union(object|func)`


### `markerSteps`

At which steps the position labels should appear, e.g. `2` for (1, 3, 5)

type: `number`
defaultValue: `2`


### `markerStyle`

Inline styles to apply to each marker.

type: `object`
defaultValue: `{}`


### `startIndex`

At which number the PositionBar marker should start counting.
Typical values are: `1` (1-based indexing) and `0` (0-based indexing).

type: `number`
defaultValue: `1`


### `style`

Inline styles to apply to the PositionBar component

type: `object`
defaultValue: `{
  font: "12px Arial",
}`

