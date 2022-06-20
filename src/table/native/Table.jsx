import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
import ReactNativeStraightTableViewManager from '@qlik/react-native-simple-grid';
import { RowProps } from './Props';
import SelectionCaches from './SelectionCaches';
import DataCacheStream from './DataCachesStream';
import { loadColumnWidths, storeColumnWidths } from './ColumnWidthStorage';

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  table: {
    flex: 1,
  },
});

const Table = ({ layout, model, manageData, selectionsAPI, changeSortOrder, app, rect }) => {
  const selectionsCaches = useRef(new SelectionCaches(selectionsAPI));
  const windowDims = useWindowDimensions();
  const [tableData, setTableData] = useState(undefined);
  const [clearSelections, setClearSelections] = useState('no');
  const dataStreamCaches = useRef(new DataCacheStream(manageData));
  const tableTheme = useRef({ ...RowProps });
  const mounted = useRef(false);
  useEffect(() => {
    const handleData = async () => {
      const data = await dataStreamCaches.current.invalidate(model, layout, {
        page: 0,
        rowsPerPage: 100,
        rowsPerPageOptions: [],
      });
      // only load from storage if it just got mounted
      if (!mounted.current) {
        mounted.current = true;
        const columnWidths = await loadColumnWidths(app, layout, windowDims.width);
        const { qHyperCube } = layout;
        const activeSortHeader = qHyperCube?.qEffectiveInterColumnSortOrder[0] || 0;
        data.columns = data.columns.map((e, index) => ({
          ...e,
          width: columnWidths[index],
          active: index === activeSortHeader,
        }));
      } else {
        const { qHyperCube } = layout;
        const activeSortHeader = qHyperCube?.qEffectiveInterColumnSortOrder[0] || 0;
        data.columns = data.columns.map((e, index) => ({
          ...e,
          active: index === activeSortHeader,
        }));
      }
      setTableData(data);
    };
    handleData();
  }, [app, layout, model, windowDims]);

  const onHeaderPressed = async (event) => {
    try {
      const column = JSON.parse(event.nativeEvent.column);
      changeSortOrder(layout, column, true);
    } catch (error) {
      console.log('error with sorting', error);
    }
  };

  useEffect(() => {
    selectionsAPI.on('canceled', () => {
      setClearSelections('yes');
    });
    selectionsAPI.on('cleared', () => {
      setClearSelections('yes');
    });
  }, [selectionsAPI]);

  const onEndReached = async () => {
    const data = await dataStreamCaches.current.next();
    setTableData(data);
  };

  const onSelectionsChanged = (event) => {
    selectionsCaches.current.toggleSelected(event.nativeEvent.selections);
    setClearSelections('no');
  };

  const onColumnsResized = (event) => {
    storeColumnWidths(app, layout, event.nativeEvent.widths);
  };

  return tableData ? (
    <View style={[styles.body, { marginTop: layout?.showTitles ? 40 : 0 }]}>
      <ReactNativeStraightTableViewManager
        theme={tableTheme.current}
        cols={{ header: tableData.columns, footer: layout?.totals.show ? layout.qHyperCube.qGrandTotalRow : undefined }}
        rows={{ rows: tableData.rows, reset: tableData.reset }}
        style={styles.table}
        size={layout.qHyperCube.qSize}
        onEndReached={onEndReached}
        containerWidth={rect.width}
        onSelectionsChanged={onSelectionsChanged}
        onColumnsResized={onColumnsResized}
        clearSelections={clearSelections}
        onHeaderPressed={onHeaderPressed}
      />
    </View>
  ) : null;
};

Table.propTypes = {
  layout: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  manageData: PropTypes.func.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  changeSortOrder: PropTypes.func.isRequired,
  rect: PropTypes.object.isRequired,
};

export default Table;
