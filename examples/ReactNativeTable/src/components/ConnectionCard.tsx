import React from 'react';
import {Button, Card, Subheading, Title} from 'react-native-paper';
import {selectedConnectionAtom, storedConnectionListAtom} from '../atoms';
import {ConnectionConfig} from '../atoms/connectionAtom';
import {useUpdateAtom} from 'jotai/utils';
import {useNavigation} from '@react-navigation/native';

export type ConnectionCardProps = {
  connection: ConnectionConfig;
  index: number;
};

const ConnectionCard: React.FC<ConnectionCardProps> = ({connection, index}) => {
  const updateStorage = useUpdateAtom(storedConnectionListAtom);
  const selectConnection = useUpdateAtom(selectedConnectionAtom);
  const navigation = useNavigation();

  const onDelete = () => {
    updateStorage((prv: Array<ConnectionConfig>) => {
      return prv.filter(
        (_item: ConnectionConfig, idx: number) => idx !== index,
      );
    });
  };

  const openConnection = () => {
    selectConnection(connection);
    navigation.push('AppList');
  };

  return (
    <Card onPress={openConnection}>
      <Card.Content>
        <Card.Cover
          source={{uri: `https://picsum.photos/300?${connection.tenant}`}}
        />
        <Title>{connection.tenant}</Title>
        <Subheading>{connection.vizType}</Subheading>
      </Card.Content>
      <Card.Actions>
        <Button onPress={onDelete} compact>
          Delete
        </Button>
        <Button compact>Edit</Button>
      </Card.Actions>
    </Card>
  );
};

export default ConnectionCard;
