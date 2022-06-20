import React, {useCallback} from 'react';
import {useAtomValue} from 'jotai';
import {loadableVizList} from '../atoms';
import Loader from './Loader';
import {FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import VizCard from './VizCard';

const VizList = () => {
  const vizList = useAtomValue<any>(loadableVizList);

  const renderItem = useCallback(({item}: any) => {
    return <VizCard model={item} />;
  }, []);

  return vizList.state === 'loading' ? (
    <Loader />
  ) : (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{flex: 1, justifyContent: 'center', marginHorizontal: 8}}>
      <FlatList renderItem={renderItem} data={vizList.data} />
    </SafeAreaView>
  );
};

export default VizList;
