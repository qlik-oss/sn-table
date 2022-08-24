import saveSoftProperties from '../save-soft-properties';
import JSONPatch from '../json-patch';

describe('saveSoftProperties', () => {
  const model = {
    applyPatches: jest.fn(),
  } as unknown as EngineAPI.IGenericObject;
  const prevEffectiveProperties = { qHyperCubeDef: {} } as unknown as EngineAPI.IGenericObjectProperties;
  const effectiveProperties = { qHyperCubeDef: {} } as unknown as EngineAPI.IGenericObjectProperties;
  const patches = [
    {
      op: 'replace',
      path: '/qHyperCubeDef/qInterColumnSortOrder',
      value: [1, 0, 2, 3],
    },
    {
      op: 'replace',
      path: '/qHyperCubeDef/qColumnOrder',
      value: [0, 1, 2, 3],
    },
  ];
  JSONPatch.generate = jest.fn(() => patches);

  it('should call applyPatches when there is patches ', () => {
    saveSoftProperties(model, prevEffectiveProperties, effectiveProperties);
    expect(model.applyPatches).toBeCalledTimes(1);
    expect(model.applyPatches).toBeCalledWith(
      [
        { qOp: 'replace', qPath: '/qHyperCubeDef/qInterColumnSortOrder', qValue: '[1,0,2,3]' },
        { qOp: 'replace', qPath: '/qHyperCubeDef/qColumnOrder', qValue: '[0,1,2,3]' },
      ],
      true
    );
  });

  it('should return promises when model is not defined ', async () => {
    await saveSoftProperties(undefined, prevEffectiveProperties, effectiveProperties).then((data) => {
      expect(data).toBe(undefined);
    });
  });
});
