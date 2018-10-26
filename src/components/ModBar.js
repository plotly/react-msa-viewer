/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { PureComponent } from 'react';

// Check https://plotly-icons.now.sh for a listing
import AutoscaleIcon from 'plotly-icons/lib/components/AutoscaleIcon';
//import SaveIcon from 'plotly-icons/lib/components/SaveIcon';
import ZoomPlusIcon from 'plotly-icons/lib/components/ZoomPlusIcon';
import ZoomMinusIcon from 'plotly-icons/lib/components/ZoomMinusIcon';

function PlotlyIcon(){
  // TODO: Not part of plotly-icons
  return (
    <svg height="1em" width="1.542em" viewBox="0 0 1542 1000">
      <path d="m0-10h182v-140h-182v140z m228 146h183v-286h-183v286z m225 714h182v-1000h-182v1000z m225-285h182v-715h-182v715z m225 142h183v-857h-183v857z m231-428h182v-429h-182v429z m225-291h183v-138h-183v138z" transform="matrix(1 0 0 -1 0 850)" fill="rgb(68, 122, 219)"></path>
    </svg>);
}

// TODO: show as soon as the mouse enters
// TODO: transition effect
// TODO: tooltips
class ModBar extends PureComponent {

  render() {
    const iconWidth = 20;
    const iconHeight = 20;
    const style = {
      opacity: 0.9,
      backgroundColor: "white",
      ...this.props.style,
    };
    const linkStyle = {
      position: "relative",
      fontSize: "16px",
      padding: "3px 4px",
      cursor: "pointer",
      lineHeight: "normal",
      textDecoration: "none",
      color: "black",
    };
    // fill with rgba(0, 31, 95, 0.3);
    //
        //<a href="" style={linkStyle}>
          //<SaveIcon width={iconWidth} height={iconHeight} />
        //</a>
    return (
      <div style={style}>
        <div style={linkStyle}>
          <ZoomPlusIcon width={iconWidth} height={iconHeight} />
        </div>
        <div style={linkStyle}>
          <ZoomMinusIcon width={iconWidth} height={iconHeight} />
        </div>
        <div style={linkStyle}>
          <AutoscaleIcon width={iconWidth} height={iconHeight} />
        </div>
        <a href="https://plot.ly/"
          target="_blank"
          rel='noreferrer noopener'
          data-title="Produced with Plotly"
          style={linkStyle}
        >
          <PlotlyIcon width={iconWidth} height={iconHeight} />
        </a>
      </div>
    );
  }
}

export default ModBar;
