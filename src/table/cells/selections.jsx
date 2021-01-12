import React from 'react';
import handleSelect from '../handle-select';

// const oddlyGlobalSelectionState = {};

/* eslint-disable */
// function selectCell(cell, column) {
//   console.log(cell.qText);
//   oddlyGlobalSelectionState[cell.qElemNumber] = !oddlyGlobalSelectionState[cell.qElemNumber];
// }

export default function withSelections(CellComponent) {
  class HOC extends React.Component {
    render() {
      const { cell, colIdx, selectionObj } = this.props;
      // const style = oddlyGlobalSelectionState[cell.qElemNumber] ? { 'background-color': '#00ff00' } : {};
      return <CellComponent {...this.props} onClick={() => handleSelect(cell.qElemNumber, colIdx, selectionObj)} />;
    }
  }
  return HOC;
}

/* TODO
- move actual selection logic out, just pass it into this file through 'selections'
- onClick runs selections.selectCell
- how can we use useState here?
*/
