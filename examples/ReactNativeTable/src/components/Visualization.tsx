import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Supernova} from '@qlik/react-native-carbon';
// import your SN here
import supernova from '@nebula.js/react-native-sn-table';
import theme from './theme.json';
import {useAtomValue} from 'jotai';
import {currentModelAtom, loadableOpenAppAtom} from '../atoms';
import {SafeAreaView} from 'react-native-safe-area-context';

const Visualization = () => {
  const model = useAtomValue(currentModelAtom);
  const openedApp = useAtomValue<any>(loadableOpenAppAtom);

  return (
    <SafeAreaView style={styles.body} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Supernova
          sn={supernova}
          theme={theme}
          object={model}
          app={openedApp.data.app}
          appLayout={openedApp.data.appLayout}
          jsxComponent={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: 'transparent',
    margin: 0,
    marginVertical: 16,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});

export default Visualization;
