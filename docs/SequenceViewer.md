# `SequenceViewer` (component)

Component to draw the main sequence alignment.

## Props

### `border`

Whether to draw a border.

type: `bool`
defaultValue: `false`


### `borderColor`

Color of the border. Name, hex or RGB value.

type: `string`
defaultValue: `"black"`


### `borderWidth`

Width of the border.

type: `number`
defaultValue: `1`


### `cacheElements`

Number of residues to prerender outside of the visible viewbox.

type: `number`
defaultValue: `20`


### `onResidueClick`

Callback fired when the mouse pointer clicked a residue.

type: `func`


### `onResidueDoubleClick`

Callback fired when the mouse pointer clicked a residue.

type: `func`


### `onResidueMouseEnter`

Callback fired when the mouse pointer is entering a residue.

type: `func`


### `onResidueMouseLeave`

Callback fired when the mouse pointer is leaving a residue.

type: `func`


### `overflow`

What should happen if content overflows.

type: `enum("hidden"|"auto"|"scroll")`
defaultValue: `"hidden"`


### `overflowX`

What should happen if x-axis content overflows (overwrites "overflow")

type: `enum("hidden"|"auto"|"scroll"|"initial")`
defaultValue: `"auto"`


### `overflowY`

What should happen if y-axis content overflows (overwrites "overflow")

type: `enum("hidden"|"auto"|"scroll"|"initial")`
defaultValue: `"auto"`


### `scrollBarPositionX`

X Position of the scroll bar ("top or "bottom")

type: `enum("top"|"bottom")`
defaultValue: `"bottom"`


### `scrollBarPositionY`

Y Position of the scroll bar ("left" or "right")

type: `enum("left"|"right")`
defaultValue: `"right"`


### `showModBar`

Show the custom ModBar

type: `bool`
defaultValue: `false`


### `textColor`

Color of the text residue letters (name, hex or RGB value)

type: `string`
defaultValue: `"black"`


### `textFont`

Font to use when drawing the individual residues.

type: `string`
defaultValue: `"18px Arial"`


### `xGridSize`

Number of residues to cluster in one tile (x-axis) (default: 10)

type: `number`
defaultValue: `10`


### `yGridSize`

Number of residues to cluster in one tile (y-axis) (default: 10)

type: `number`
defaultValue: `10`

