import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import {currentModelAtom} from '../atoms';
import {useNavigation} from '@react-navigation/native';
import {useUpdateAtom} from 'jotai/utils';

export type VizCardProps = {
  model: any;
};

const VizCard: React.FC<VizCardProps> = ({model}) => {
  const navigation = useNavigation();
  const setCurrentModel = useUpdateAtom(currentModelAtom);
  const [effectiveProperties, setEffectiveProperties] = useState<any>();

  useEffect(() => {
    const getProps = async () => {
      try {
        const props = await model.getEffectiveProperties();
        setEffectiveProperties(props);
      } catch (error) {}
    };
    getProps();
  }, [model]);

  const onPress = useCallback(() => {
    setCurrentModel(model);
    navigation.push('Canvas');
  }, [model, navigation, setCurrentModel]);

  return (
    <List.Item
      style={styles.body}
      title={effectiveProperties?.title}
      description={effectiveProperties?.qInfo.qId}
      right={(props: any) => <List.Icon {...props} icon="chevron-right" />}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    elevation: 1,
    overflow: 'hidden',
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default VizCard;
