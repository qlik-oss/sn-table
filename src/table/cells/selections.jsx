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
      const isSelected = !!selectionObj.selected.find((s) => s.qElemNumber === cell.qElemNumber);
      const style = isSelected ? { 'background-color': '#00ff00' } : {};
      return <CellComponent {...this.props} style={style} onClick={() => handleSelect(cell, colIdx, selectionObj)} />;
    }
  }
  return HOC;
}

/* TODO
- move actual selection logic out, just pass it into this file through 'selections'
- onClick runs selections.selectCell
- how can we use useState here?
*/
