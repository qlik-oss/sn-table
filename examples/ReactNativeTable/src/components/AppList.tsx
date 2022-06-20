import {useNavigation} from '@react-navigation/native';
import {useAtomValue} from 'jotai';
import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Divider} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {loadableAppListAtom} from '../atoms';
import AppCard from './AppCard';
import ConnectionCard from './ConnectionCard';

const AppList = () => {
  const navigation = useNavigation();
  const appList = useAtomValue<any>(loadableAppListAtom);

  const renderItem = useCallback(({item}: any) => {
    return (
      <AppCard
        appId={item.resourceId}
        title={item.name}
        thumbnail={item.resourceAttributes?.thumbnail}
      />
    );
  }, []);
  return (
    <SafeAreaView style={styles.body} edges={['left', 'right', 'bottom']}>
      {appList.state === 'loading' ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={appList.data.data}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
          windowSize={3}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  addFab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 16,
  },
});

export default AppList;
