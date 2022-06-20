import {useUpdateAtom} from 'jotai/utils';
import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ConnectionConfig, storedConnectionListAtom} from '../atoms';

const Connection = () => {
  const addConnection = useUpdateAtom(storedConnectionListAtom);
  const [tenant, setTenant] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [vizType, setVizType] = useState('');

  const onChangeTenant = useCallback((val: string) => setTenant(val), []);
  const onChangeApiKey = useCallback((val: string) => setApiKey(val), []);
  const onChangeVizType = useCallback((val: string) => setVizType(val), []);

  const onSave = useCallback(() => {
    addConnection((prv: Array<ConnectionConfig>) => {
      return [...prv, {tenant, apiKey, vizType}];
    });
  }, [addConnection, apiKey, tenant, vizType]);

  return (
    <SafeAreaView style={styles.body} edges={['left', 'bottom', 'right']}>
      <TextInput
        label="Tenant"
        placeholder="Tenant without protocol (me.us.qlikcloud.com)"
        value={tenant}
        onChangeText={onChangeTenant}
        autoCapitalize="none"
      />
      <TextInput
        label="API Key"
        placeholder="Paste your key here"
        value={apiKey}
        onChangeText={onChangeApiKey}
        autoCapitalize="none"
      />
      <TextInput
        label="Visualization Type"
        placeholder="kpi, treemap, table"
        value={vizType}
        onChangeText={onChangeVizType}
        autoCapitalize="none"
      />
      <Button onPress={onSave} uppercase={false}>
        Add
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  addFab: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default Connection;
