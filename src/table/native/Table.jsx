/* eslint-disable no-restricted-syntax */
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import ReactNativeStraightTableViewManager from '@qlik/react-native-simple-grid';
import { RowProps } from './Props';
import SelectionCaches from './SelectionCaches';
import DataCacheStream from './DataCachesStream';
import { getKey } from './ColumnWidthStorage';
import { freezeFirstColumn } from '../utils/scrolling-props';
import { getBodyCellStyle, getHeaderStyle } from '../utils/styling-utils';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    overflow: 'hidden',
  },
  table: {
    flex: 1,
    overflow: 'hidden',
  },
});

const Table = ({ layout, model, manageData, selectionsAPI, changeSortOrder, app, rect, theme }) => {
  const selectionsCaches = useRef(new SelectionCaches(selectionsAPI));
  const [tableData, setTableData] = useState(undefined);
  const [clearSelections, setClearSelections] = useState('no');
  const dataStreamCaches = useRef(new DataCacheStream(manageData));
  const tableTheme = useRef({ ...RowProps });

  const name = useMemo(() => {
    return getKey(app, layout);
  }, [app, layout]);

  const contentStyle = useMemo(() => {
    const cellStyle = getBodyCellStyle(layout, theme);
    const headerStyle = getHeaderStyle(layout, theme);
    cellStyle.fontSize = parseInt(cellStyle.fontSize, 10);
    headerStyle.fontSize = parseInt(headerStyle.fontSize, 10);
    return { cellStyle, headerStyle };
  }, [layout, theme]);

  useEffect(() => {
    const handleData = async () => {
      function transformRepresentation(e) {
        if (e.representation?.miniChart?.colors && theme) {
          const { colors } = e.representation.miniChart;
          for (const [key, value] of Object.entries(colors)) {
            if ((colors[key]?.color !== 'none' && value.index > 0) || !colors[key].color) {
              colors[key].index -= 1;
              colors[key].color = theme.getColorPickerColor(colors[key]);
            }
          }
          e.representation.miniChart.colors = colors;
        }
        return e.representation;
      }

      const data = await dataStreamCaches.current.invalidate(model, layout, {
        page: 0,
        rowsPerPage: 100,
        rowsPerPageOptions: [],
      });

      const { qHyperCube } = layout;
      const activeSortHeader = qHyperCube?.qEffectiveInterColumnSortOrder[0] || 0;
      data.columns = data.columns.map((e, index) => ({
        ...e,
        active: index === activeSortHeader,
        representation: transformRepresentation(e, theme),
      }));
      setTableData(data);
    };
    handleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app, layout, model]);

  const onHeaderPressed = useCallback(
    async (event) => {
      try {
        const column = JSON.parse(event.nativeEvent.column);
        if (column) {
          changeSortOrder(layout, column, true);
        }
      } catch (error) {
        console.log('error with sorting', error);
      }
    },
    [changeSortOrder, layout]
  );

  useEffect(() => {
    selectionsAPI.on('canceled', () => {
      setClearSelections('yes');
    });
    selectionsAPI.on('cleared', () => {
      setClearSelections('yes');
    });
  }, [selectionsAPI]);

  const onEndReached = useCallback(async () => {
    const data = await dataStreamCaches.current.next();
    if (data) {
      setTableData(data);
    }
  }, []);

  const onSelectionsChanged = useCallback((event) => {
    selectionsCaches.current.toggleSelected(event.nativeEvent.selections);
    setClearSelections('no');
  }, []);

  return tableData ? (
    <View style={styles.body}>
      <ReactNativeStraightTableViewManager
        theme={tableTheme.current}
        cols={{
          header: tableData?.columns,
          footer: layout?.totals.show ? layout.qHyperCube.qGrandTotalRow : undefined,
          totals:
            layout?.totals?.show || layout?.totals?.position !== 'noTotals'
              ? { ...layout.totals, rows: layout.qHyperCube.qGrandTotalRow }
              : undefined,
        }}
        rows={{ rows: tableData?.rows, reset: tableData?.reset }}
        style={styles.table}
        size={layout.qHyperCube.qSize}
        onEndReached={onEndReached}
        containerWidth={rect.width}
        onSelectionsChanged={onSelectionsChanged}
        clearSelections={clearSelections}
        onHeaderPressed={onHeaderPressed}
        freezeFirstColumn={freezeFirstColumn(layout)}
        cellContentStyle={contentStyle.cellStyle}
        headerContentStyle={contentStyle.headerStyle}
        name={name}
        isDataView={layout?.isDataView}
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
  theme: PropTypes.object.isRequired,
};

export default Table;
