/**
* Copyright 2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

const clustalRegex = /^(?:\s*)(\S+)(?:\s+)(\S+)(?:\s*)(\d*)(?:\s*|$)/g;

export function parse(text) {
  let lines;
  const seqs = [];
  if (Object.prototype.toString.call(text) === '[object Array]') {
    lines = text;
  } else {
    lines = text.split("\n");
  }
  // The first line in the file must start with the words "CLUSTAL"
  if (lines[0].slice(0, 6) === !"CLUSTAL") {
    throw new Error("Invalid CLUSTAL Header");
  }
  let k = 0;
  // 0: reading sequences, 1: reading new lines
  let blockstate = 1;
  // count the sequence for every block
  let seqCounter = 0;
  while (k < lines.length) {
    k++;
    let line = lines[k];
    if ((line == null) || line.length === 0) {
      blockstate = 1;
      continue;
    }
    // okay we have an empty line
    if (line.trim().length === 0) {
      blockstate = 1;
      continue;
    } else {
      // ignore annotations
      if (line.indexOf("*") >= 0) {
        continue;
      }
      if (blockstate === 1) {
        // new block recognized - reset
        seqCounter = 0;
        blockstate = 0;
      }
      const match = clustalRegex.exec(line);
      if (match !== null) {
        const label = match[1];
        const sequence = match[2];
        // check for the first block
        if (seqCounter >= seqs.length) {
          seqs.push({sequence, name: label});
        } else {
          seqs[seqCounter].sequence += sequence;
        }
        seqCounter++;
      } else {
        console.log("parse error", line);
      }
      // reset RegExp
      clustalRegex.lastIndex = 0;
    }
  }
  return seqs;
}
export default parse;
