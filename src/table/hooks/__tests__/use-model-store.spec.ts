import modelStore from '../use-model-store';

describe('use-model-store', () => {
  test('should not return value when nothing in store', () => {
    expect(modelStore.get('fakeId')).toEqual(undefined);
  });

  test('should return object set object', () => {
    const object1 = { object: 'entry' } as unknown as EngineAPI.IField;
    modelStore.set('object1', object1);
    expect(modelStore.get('object1')).toEqual(object1);
  });
});
