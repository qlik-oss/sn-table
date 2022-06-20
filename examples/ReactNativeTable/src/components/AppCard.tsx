import React from 'react';
import {Button, Card, Subheading, Title} from 'react-native-paper';
import {
  ConnectionConfig,
  selectedAppAtom,
  selectedConnectionAtom,
  storedConnectionListAtom,
} from '../atoms';
import {useAtomValue, useUpdateAtom} from 'jotai/utils';
import {useNavigation} from '@react-navigation/native';

export type AppCardProps = {
  appId: string;
  title: string;
};

const AppCard: React.FC<AppCardProps> = ({appId, title}) => {
  const navigation = useNavigation();
  const selectApp = useUpdateAtom(selectedAppAtom);

  const openConnection = () => {
    selectApp({appId});
    navigation.push("VizList")
  };

  return (
    <Card onPress={openConnection}>
      <Card.Content>
        <Title>{title}</Title>
        <Subheading>{appId}</Subheading>
      </Card.Content>
    </Card>
  );
};

export default AppCard;
