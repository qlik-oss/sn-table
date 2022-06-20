import {useNavigation} from '@react-navigation/native';
import {useAtomValue} from 'jotai';
import React, {useCallback} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {FAB, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {loadableStoredConnectionListAtom} from '../atoms';
import ConnectionCard from './ConnectionCard';

const ConnectionsList = () => {
  const navigation = useNavigation();
  const connectionList = useAtomValue<any>(loadableStoredConnectionListAtom);

  const handleAdd = () => {
    navigation.navigate('Connection');
  };

  const renderItem = useCallback(({item, index}: any) => {
    return <ConnectionCard connection={item} index={index} />;
  }, []);
  return (
    <SafeAreaView style={styles.body}>
      <Text style={styles.title}>Your Connections</Text>
      <FlatList data={connectionList.data} renderItem={renderItem} />
      <FAB style={styles.addFab} icon="plus" onPress={handleAdd} />
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 8,
    marginVertical: 16,
  },
});

export default ConnectionsList;
