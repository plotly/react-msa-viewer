# `OverviewBar` (component)

Creates a small overview box of the sequences for a general overview.

## Props

### `engine`

Rendering engine: `canvas` or `webgl` (experimental).

type: `enum('canvas'|'webgl')`
defaultValue: `"canvas"`


### `fillColor`

Fill color of the OverviewBar, e.g. `#999999`

type: `string`
defaultValue: `"#999999"`


### `height` (required)

Width of the component (in pixels), e.g. `100`

type: `number`
defaultValue: `50`


### `method`

Method to use for the OverviewBar:
 - `information-content`: Information entropy after Shannon of a column (scaled)
 - `conservation`: Conservation of a column (scaled)

type: `enum('information-content'|'conservation')`
defaultValue: `"conservation"`


### `style`

Custom style configuration.

type: `object`


### `width` (required)

Width of the component (in pixels), e.g. `100`

type: `number`

