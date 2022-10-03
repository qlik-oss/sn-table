import AsyncStorage from '@react-native-async-storage/async-storage';

const getKey = (app, layout) => {
  if (layout.resourceId) {
    return `${layout.resourceId}`;
  }
  return `${app.id}`;
};

export const loadColumnWidths = async (app, layout, viewPortWidth) => {
  try {
    const loadDefault = () => {
      const { qHyperCube } = layout;
      const numCols = qHyperCube.columnWidths.length || qHyperCube.columnOrder.length;
      let defaultWidth = 0;
      if (numCols <= 4) {
        defaultWidth = (viewPortWidth - 16) / numCols;
      }
      return new Array(numCols).fill(defaultWidth);
    };

    const storageKey = getKey(app, layout);
    const data = await AsyncStorage.getItem(storageKey);
    if (data) {
      const widths = JSON.parse(data);
      const containsObject = layout.qInfo.qType in widths;
      if (!containsObject || widths[layout.qInfo.qType].length !== layout.qHyperCube.columnWidths.length) {
        return loadDefault();
      }
      return widths[layout.qInfo.qType];
    }
    return loadDefault();
  } catch (error) {
    console.log('Error loading widths', error);
  }
  return undefined;
};

export const storeColumnWidths = async (app, layout, widths) => {
  try {
    const storageKey = getKey(app, layout);
    let data = await AsyncStorage.getItem(storageKey);
    if (!data) {
      data = {};
    } else {
      data = JSON.parse(data);
    }
    data[layout.qInfo.qType] = widths;
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.log('Error saving stable columns', error);
  }
};
