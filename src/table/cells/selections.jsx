import React from 'react';

const oddlyGlobalSelectionState = {};

/* eslint-disable */
function selectCell(cell, column) {
  console.log(cell.qText);
  oddlyGlobalSelectionState[cell.qElemNumber] = !oddlyGlobalSelectionState[cell.qElemNumber];
}

export default function withSelections(CellComponent) {
  class HOC extends React.Component {
    render() {
      const { cell, column } = this.props;
      const style = oddlyGlobalSelectionState[cell.qElemNumber] ? { 'background-color': '#00ff00' } : {};
      return <CellComponent {...this.props} style={style} onClick={() => selectCell(cell, column)} />;
    }
  }
  return HOC;
}

/* TODO
- move actual selection logic out, just pass it into this file through 'selections'
- onClick runs selections.selectCell
- how can we use useState here?
*/
