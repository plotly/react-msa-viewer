# `MSAViewer` (component)

A general-purpose layout for the MSA components

When children are passed it acts as a Context Provider for the msaStore,
otherwise it provides a default layout and forwards it props the respective
components.

## Props

### `barAttributes`

Attributes to apply to each bar.

type: `object`


### `barFillColor`

Fill color of the OverviewBar, e.g. `#999999`

type: `string`


### `barMethod`

Method to use for the OverviewBar:
 - `information-content`: Information entropy after Shannon of a column (scaled)
 - `conservation`: Conservation of a column (scaled)

type: `enum('information-content'|'conservation')`


### `barStyle`

Inline styles to apply to each bar.

type: `object`


### `colorScheme`

Colorscheme to use. Currently the follow colorschemes are supported:
`buried_index`, `clustal`, `clustal2`, `cinema`, `helix_propensity`, `hydro`,
`lesk`, `mae`, `nucleotide`, `purine_pyrimidine`, `strand_propensity`, `taylor`,
`turn_propensity`, and `zappo`.

See [msa-colorschemes](https://github.com/wilzbach/msa-colorschemes) for details.

type: `custom`


### `height`

Height of the sequence viewer (in pixels), e.g. `500`.

type: `number`


### `labelAttributes`

Attributes to apply to each label.

type: `object`


### `labelComponent`

Component to create labels from.

type: `union(object|func)`


### `labelStyle`

Inline styles to apply to each label.

type: `object`


### `layout`

Predefined layout scheme to use (only used when no child elements are provided).
Available layouts: `basic`, `inverse`, `full`, `compact`, `funky`

type: `enum('basic'|'default'|'inverse'|'full'|'compact'|'funky')`


### `markerAttributes`

Attributes to apply to each marker.

type: `object`


### `markerComponent`

Component to create markers from.

type: `union(object|func)`


### `markerStartIndex`

At which number the PositionBar marker should start counting.
Typical values are: `1` (1-based indexing) and `0` (0-based indexing).

type: `number`


### `markerSteps`

At which steps the position labels should appear, e.g. `2` for (1, 3, 5)

type: `number`


### `markerStyle`

Inline styles to apply to each marker.

type: `object`


### `msaStore`

A custom msaStore (created with `createMSAStore`).
Useful for custom interaction with other components

type: `object`


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


### `position`

Current x and y position of the viewpoint
in the main sequence viewer (in pixels).
This specifies the position of the top-left corner
of the viewpoint within the entire alignment,
e.g. `{xPos: 20, yPos: 5}`.

type: `custom`


### `sequenceBorder`

Whether to draw a border.

type: `bool`


### `sequenceBorderColor`

Color of the border. Name, hex or RGB value.

type: `string`


### `sequenceBorderWidth`

Width of the border.

type: `number`


### `sequenceOverflow`

What should happen if content overflows.

type: `enum("hidden"|"auto"|"scroll")`


### `sequenceOverflowX`

What should happen if x-axis content overflows (overwrites "overflow")

type: `enum("hidden"|"auto"|"scroll"|"initial")`


### `sequenceOverflowY`

What should happen if y-axis content overflows (overwrites "overflow")

type: `enum("hidden"|"auto"|"scroll"|"initial")`


### `sequenceScrollBarPositionX`

X Position of the scroll bar ("top or "bottom")

type: `enum("top"|"bottom")`


### `sequenceScrollBarPositionY`

Y Position of the scroll bar ("left" or "right")

type: `enum("left"|"right")`


### `sequenceTextColor`

Color of the text residue letters (name, hex or RGB value)

type: `string`


### `sequenceTextFont`

Font to use when drawing the individual residues.

type: `string`


### `sequences` (required)

Sequence data.
`sequences` expects an array of individual sequences.

`sequence`: Raw sequence, e.g. `MEEPQSDPSIEP` (required)
`name`: name of the sequence, e.g. `Sequence X`

Example:

```js
const sequences = [
  {
    name: "seq.1",
    sequence: "MEEPQSDPSIEP-PLSQETFSDLWKLLPENNVLSPLPS-QA-VDDLMLSPDDLAQWLTED",
  },
  {
    name: "seq.2",
    sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP",
  },
];
```

type: `arrayOf[SequencePropType]`


### `tileHeight`

Height of the main tiles (in pixels), e.g. `20`

type: `number`


### `tileWidth`

Width of the main tiles (in pixels), e.g. `20`

type: `number`


### `width`

Width of the sequence viewer (in pixels), e.g. `500`.

type: `number`

