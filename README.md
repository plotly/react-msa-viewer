`<MSAViewer />`
=============

[![Travis](https://img.shields.io/travis/plotly/react-msa-viewer/master.svg)](https://travis-ci.org/plotly/react-msa-viewer)
[![NPM](https://img.shields.io/npm/v/@plotly/react-msa-viewer.svg)](https://www.npmjs.com/package/@plotly/react-msa-viewer)

`react-msa-viewer` is a performant, extendable, highly-customizable, production-ready
React Component that renders a Multiple Sequence Alignment (MSA).

__WARNING: Work in progress - use with caution__

Live demo
---------

<a href="https://msa.bio.sh">
  <img alt="MSAViewer example" src="https://user-images.githubusercontent.com/4370550/46425572-50a8b900-c73c-11e8-9f46-a9cac3a5000b.png" />
</a>

Checkout the storybook at https://msa.bio.sh

Getting started
---------------

```jsx
import MSAViewer from '@plotly/react-msa-viewer';

function MSA() {
  const options = {
    sequences: [
      {
        name: "seq.1",
        sequence: "MEEPQSDPSIEP-PLSQETFSDLWKLLPENNVLSPLPS-QA-VDDLMLSPDDLAQWLTED"
      },
      {
        name: "seq.2",
        sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
      },
      {
        name: "seq.3",
        sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
      },
    ],
    height: 60,
    colorScheme: "zappo",
  };
  return (
    <MSAViewer {...options} />
  );
}
```

[Open on CodePen](https://codepen.io/greenify/pen/ReJxvX?editors=0010)

### Installation

For [npm](https://www.npmjs.com) users, run:

```
npm i --save @plotly/react-msa-viewer
```

For [yarn](https://yarnpkg.com/en) users, run:

```
yarn add @plotly/react-msa-viewer
```

### Use your own layout

`<MSAViewer>` acts a Context Provider for all MSA subcomponents.
Hence, it will automatically take care of synchronization between all MSA components in its tree:

```jsx
import {
  Labels,
  MSAViewer,
  OverviewBar,
  PositionBar,
  SequenceOverview,
  SequenceViewer,
} from '@plotly/react-msa-viewer';

function MSA() {
  const options = {
    sequences: [
      {
        name: "seq.1",
        sequence: "MEEPQSDPSIEP-PLSQETFSDLWKLLPENNVLSPLPS-QA-VDDLMLSPDDLAQWLTED"
      },
      {
        name: "seq.2",
        sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
      },
      {
        name: "seq.3",
        sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
      },
    ],
    height: 60,
  };
  return (
    <MSAViewer {...options}>
      <SequenceOverview method="information-content"/>
      <div style={{display: "flex"}} >
        <div>
          <SequenceViewer/>
          <br/>
          <OverviewBar/>
          <PositionBar/>
        </div>
        <Labels/>
      </div>
    </MSAViewer>
  );
}
```

[Open on CodePen](https://codepen.io/greenify/pen/qJKpPK/left?editors=0010)

### Usage in Vanilla JS

Using the `react-msa-viewer` with React is highly recommended.
However, it can be used in Vanilla JS:

```html
<html>
<meta charset="utf-8" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/15.4.2/react-dom.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prop-types/15.5.2/prop-types.js"></script>
<script src="https://unpkg.com/@plotly/react-msa-viewer/dist/index.js"></script>
<body>
  <div id="my-msa" />
  <script>
  var options = {
    sequences: [
      {
        name: "seq.1",
        sequence: "MEEPQSDPSIEP-PLSQETFSDLWKLLPENNVLSPLPS-QA-VDDLMLSPDDLAQWLTED"
      },
      {
        name: "seq.2",
        sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
      },
      {
        name: "seq.3",
        sequence: "MEEPQSDLSIEL-PLSQETFSDLWKLLPPNNVLSTLPS-SDSIEE-LFLSENVAGWLEDP"
      },
    ],
    height: 60,
    colorScheme: "zappo",
   };
  ReactDOM.render(
    React.createElement(ReactMSAViewer.MSAViewer, options),
    document.getElementById('my-msa')
  );
  </script>
</body>
</html>
```

See an [example on CodePen](https://codepen.io/greenify/pen/xyYaWN?editors=1010).

Props
-----

__Warning__: these properties are still susceptible to a _change at any moment_.

### `MSAViewer` (component)

TBD.

### `Labels` (component)

Displays the sequence names.

#### Props

##### `engine`

Rendering engine: `canvas` or `webgl` (experimental).

type: `enum('canvas'|'webgl')`
defaultValue: `"canvas"`


##### `font`

Font of the sequence labels, e.g. `20px Arial`

type: `string`


##### `height`

Width of the component (in pixels), e.g. `100`

type: `number`
defaultValue: `100`


##### `msecsPerFps`

defaultValue: `60`


##### `msecsPerSecs`

Maximum number of frames per second, e.g. `1000 / 60`

type: `number`


##### `style`

Custom style configuration.

type: `object`


##### `width`

Width of the component (in pixels), e.g. `100`

type: `number`
defaultValue: `100`


### `OverviewBar` (component)

Creates a small overview box of the sequences for a general overview.

#### Props

##### `fillColor`

defaultValue: `"#999999"`


##### `height`

defaultValue: `50`


##### `method`

defaultValue: `"conservation"`


### `PositionBar` (component)

Creates a PositionBar of markers for every n-th sequence column.

#### Props

##### `engine`

Rendering engine: `canvas` or `webgl` (experimental).

type: `enum('canvas'|'webgl')`
defaultValue: `"canvas"`


##### `font`

Font of the sequence labels, e.g. `20px Arial`

type: `string`
defaultValue: `"12px Arial"`


##### `height`

Width of the component (in pixels), e.g. `100`

type: `number`
defaultValue: `100`


##### `markerSteps`

At which steps the position labels should appear, e.g. `2` for (1, 3, 5)

type: `number`
defaultValue: `2`


##### `msecsPerFps`

defaultValue: `60`


##### `msecsPerSecs`

Maximum number of frames per second, e.g. `1000 / 60`

type: `number`


##### `startIndex`

At which number the PositionBar marker should start counting.
Typical values are: `1` (1-based indexing) and `0` (0-based indexing).

type: `number`
defaultValue: `1`


##### `style`

Custom style configuration.

type: `object`


##### `width`

Width of the component (in pixels), e.g. `100`

type: `number`
defaultValue: `100`


### `SequenceOverview` (component)



#### Props

##### `height`

Height of the SequenceOverview (in pixels), e.g. `50`

type: `number`
defaultValue: `50`


##### `tileHeight`

Height of a tile in the OverviewBar, e.g. `5`

type: `number`
defaultValue: `5`


##### `tileWidth`

Width of a tile in the OverviewBar, e.g. `5`

type: `number`
defaultValue: `5`


### `SequenceViewer` (component)


#### Props

##### `showModBar`

defaultValue: `true`

### Creating your own MSA components

The React MSA Viewer uses an Redux store internally.
You can connect your components with it too.

```jsx
import React, {Component} from 'react';
import msaConnect from 'react-msa-viewer';

class MyFirstMSAPluginComponent extends Component {

  render() {
    return (
      <div>
        x: {this.props.xPos},
        y: {this.props.yPos}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    xPos: state.position.xPos,
    yPos: state.position.yPos,
  }
}

export default msaConnect(
  mapStateToProps,
)(MyFirstMSAPluginComponent);
```

And then use your plugin in your App:

```js
import {
  MSAViewer,
  SequenceViewer,
} from 'react-msa-viewer';

import MyFirstMSAPlugin from './MyFirstMSAPlugin'

function MyApp() {
  return (
    <MSAViewer sequences={sequences} height={60}>
      <SequenceViewer />
      <MyFirstMSA />
    </MSAViewer>
  );
}
```

Alternatively, you can also listen to events.

Development
-----------

### Getting started

Get the code:

```
git clone https://github.com/plotly/react-msa-viewer
```

Install the project `dev` dependencies:

```
npm install
```

Contributing
------------

Please, see the [CONTRIBUTING](CONTRIBUTING.md) file.

Contributor Code of Conduct
---------------------------

Please note that this project is released with a [Contributor Code of
Conduct](http://contributor-covenant.org/). By participating in this project you
agree to abide by its terms. See [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) file.

License
-------

react-msa-viewer is released under the MIT License. See the bundled
[LICENSE](LICENSE) file for details.
