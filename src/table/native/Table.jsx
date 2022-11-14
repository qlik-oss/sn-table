/* eslint-disable no-restricted-syntax */
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
import { SimpleGrid } from '@qlik/react-native-simple-grid';
import { RowProps } from './Props';
import SelectionCaches from './SelectionCaches';
import DataCacheStream from './DataCachesStream';
import { getKey } from './ColumnWidthStorage';
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

function transformRepresentation(e, theme) {
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

const Table = ({ layout, model, manageData, selectionsAPI, changeSortOrder, app, rect, theme, translator }) => {
  const selectionsCaches = useRef(new SelectionCaches(selectionsAPI));
  const [tableData, setTableData] = useState(undefined);
  const [clearSelections, setClearSelections] = useState('no');
  const dataStreamCaches = useRef(new DataCacheStream(manageData));
  const tableTheme = useRef({ ...RowProps });
  const dims = useWindowDimensions();

  const name = useMemo(() => {
    return getKey(app, layout);
  }, [app, layout]);

  const translations = useMemo(
    () => ({
      menu: {
        copy: translator?.translate?.('Copy') || 'Copy',
        expand: translator?.translate?.('ExpandRow') || 'Expand Row',
        share: translator?.translate?.('Share') || 'Share',
      },
      misc: {
        of: translator?.translate?.('Of') || 'of',
      },
    }),
    [translator]
  );

  const contentStyle = useMemo(() => {
    const cellStyle = getBodyCellStyle(layout, theme);
    const headerStyle = getHeaderStyle(layout, theme);
    cellStyle.fontSize = parseInt(cellStyle.fontSize, 10);
    headerStyle.fontSize = parseInt(headerStyle.fontSize, 10);
    return { cellStyle, headerStyle };
  }, [layout, theme]);

  useEffect(() => {
    const handleData = async () => {
      try {
        const data = await dataStreamCaches.current.invalidate(model, layout, {
          page: 0,
          rowsPerPage: 100,
          rowsPerPageOptions: [],
        });

        const { qHyperCube } = layout;
        const activeSortHeader = qHyperCube?.qEffectiveInterColumnSortOrder[0] || 0;
        data.columns = data.columns.map((e) => ({
          ...e,
          active: e.dataColIdx === activeSortHeader,
          representation: transformRepresentation(e, theme),
        }));

        setTableData(data);
      } catch (error) {
        console.log('error', error);
      }
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
    const canceledSub = selectionsAPI.on('canceled', () => {
      setClearSelections('yes');
    });
    const clearedSub = selectionsAPI.on('cleared', () => {
      setClearSelections('yes');
    });
    const confirmedSub = selectionsAPI.on('confirmed', () => {
      setClearSelections('yes');
    });

    return () => {
      canceledSub?.remove();
      clearedSub?.remove();
      confirmedSub?.remove();
    };
  }, [selectionsAPI]);

  useEffect(() => {
    if (selectionsAPI) {
      selectionsAPI.cancel();
      setClearSelections('yes');
    }
  }, [dims, selectionsAPI]);

  const onEndReached = useCallback(async () => {
    const data = await dataStreamCaches.current.next();
    if (data) {
      const { qHyperCube } = layout;
      const activeSortHeader = qHyperCube?.qEffectiveInterColumnSortOrder[0] || 0;
      data.columns = data.columns.map((e) => ({
        ...e,
        active: e.dataColIdx === activeSortHeader,
      }));
      setTableData(data);
    }
  }, [layout]);

  const onSelectionsChanged = useCallback((event) => {
    selectionsCaches.current.toggleSelected(event.nativeEvent.selections);
    setClearSelections('no');
  }, []);

  const onConfirmSelections = useCallback(() => {
    setClearSelections('yes');
    selectionsCaches.current.confirm();
  }, []);

  console.log(tableData);

  return tableData ? (
    <View style={styles.body}>
      <SimpleGrid
        theme={tableTheme.current}
        tableData={tableData}
        style={styles}
        rect={rect}
        onEndReached={onEndReached}
        onSelectionsChanged={onSelectionsChanged}
        onConfirmSelections={onConfirmSelections}
        clearSelections={clearSelections}
        onHeaderPressed={onHeaderPressed}
        contentStyle={contentStyle}
        name={name}
        translations={translations}
        layout={layout}
        model={model}
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
  translator: PropTypes.object.isRequired,
};

export default Table;
