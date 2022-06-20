import React from 'react';
import {View, StyleSheet} from 'react-native';
import Visualization from './Visualization';

const Canvas = () => {
  return (
    <View style={styles.body}>
      <Visualization />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

export default Canvas;
