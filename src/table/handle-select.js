export default function handleSelect(qElemNumber, colIdx, selectionObj) {
  const { api, setState } = selectionObj;
  // const newState = state.concat();
  // newState.push(qText);

  if (api) {
    // let newState;
    // if (node.data.elemNo < 0 && node.data.elemNo !== -3) {
    //   return;
    // }
    // if (node.data.isLocked) {
    //   return;
    // }
    // if (!api.isActive() || !state) {
    //   api.begin('/qHyperCubeDef');
    //   newState = [];
    // } else {
    //   newState = state.concat();
    // }

    // const ind = newState.indexOf(node.data.elemNo);
    // const activate = ind === -1;
    // let linkedIds = [];

    // if (!singleSelect) {
    //   linkedIds = getAllTreeElemNo(node, activate);
    // }
    // if (!activate) {
    //   newState.splice(ind, 1);
    //   linkedIds.forEach(id => {
    //     const idInd = newState.indexOf(id);
    //     idInd !== -1 && newState.splice(idInd, 1);
    //   });
    // } else {
    //   newState.push(node.data.elemNo);
    //   linkedIds.forEach(id => {
    //     if (newState.indexOf(id) === -1) {
    //       newState.push(id);
    //     }
    //   });
    // }
    const newState = [qElemNumber];

    if (newState.length === 0) {
      api.clear();
    } else {
      api.select({
        method: 'selectHyperCubeValues',
        params: ['/qHyperCubeDef', colIdx, newState, false],
      });
    }
    setState(newState);
  }
}
