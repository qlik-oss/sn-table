/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Canvas from './src/components/Canvas';
import Connection from './src/components/Connection';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getHeaderTitle} from '@react-navigation/elements';
import ConnectionsList from './src/components/ConnectionsList';
import AppList from './src/components/AppList';
import VizList from './src/components/VizList';
import {Appbar} from 'react-native-paper';
import {useAtomValue} from 'jotai';
import {loadableOpenAppAtom} from './src/atoms';
import {SelectionsToolbar} from '@qlik/react-native-carbon';
import {
  supernovaStateAtom,
  supernovaToolTipStateAtom,
} from '@qlik/react-native-carbon/src/carbonAtoms';
import {useResetAtom} from 'jotai/utils';

const Stack = createNativeStackNavigator();

const App = () => {
  const openedApp = useAtomValue(loadableOpenAppAtom);

  const handleClear = useCallback(() => {
    if (openedApp.data.app) {
      openedApp.data.app.clearAll();
    }
  }, [openedApp]);

  const supernovaState = useAtomValue(supernovaStateAtom);
  const resetSupernovaState = useResetAtom(supernovaStateAtom);
  const resetTooltipState = useResetAtom(supernovaToolTipStateAtom);

  const onConfirm = () => {
    if (supernovaState) {
      supernovaState.confirmSelection();
    }
    resetSupernovaState();
    resetTooltipState();
  };

  const onCancel = () => {
    if (supernovaState) {
      supernovaState.cancelSelection();
    }
    resetSupernovaState();
    resetTooltipState();
  };

  const onClearSelections = () => {
    if (supernovaState) {
      supernovaState.clear();
    }
    resetTooltipState();
  };

  const handleToggledLasso = val => {
    if (supernovaState) {
      supernovaState.toggleLasso(val);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: ({navigation, route, options, back}) => {
            const title = getHeaderTitle(options, route.name);
            return (
              <Appbar.Header>
                {navigation.canGoBack() ? (
                  <Appbar.BackAction onPress={navigation.goBack} />
                ) : null}
                <Appbar.Content title={title} />
              </Appbar.Header>
            );
          },
        }}>
        <Stack.Screen
          name="ConnectionsList"
          component={ConnectionsList}
          options={{header: () => null}}
        />
        <Stack.Screen name="AppList" component={AppList} />
        <Stack.Screen name="Connection" component={Connection} />
        <Stack.Screen name="VizList" component={VizList} />
        <Stack.Screen
          name="Canvas"
          component={Canvas}
          options={{
            header: ({navigation, route, options, back}) => {
              const title = getHeaderTitle(options, route.name);
              return (
                <Appbar.Header>
                  {navigation.canGoBack() ? (
                    <Appbar.BackAction onPress={navigation.goBack} />
                  ) : null}
                  <Appbar.Content title={title} />
                  <Appbar.Action icon="selection-off" onPress={handleClear} />
                </Appbar.Header>
              );
            },
          }}
        />
      </Stack.Navigator>
      <SelectionsToolbar
        visible={supernovaState.active}
        position={supernovaState.position}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onClear={onClearSelections}
        onToggledLasso={handleToggledLasso}
        icons={{confirm: 'check', cancel: 'close', clear: 'selection-off'}}
      />
    </NavigationContainer>
  );
};

export default App;
