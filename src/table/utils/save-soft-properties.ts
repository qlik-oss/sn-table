import extend from 'extend';
import JSONPatch from './json-patch';

const saveSoftProperties = (
  model: EngineAPI.IGenericObject,
  prevEffectiveProperties: EngineAPI.IGenericObjectProperties,
  effectiveProperties: EngineAPI.IGenericObjectProperties
) => {
  if (!model) {
    return Promise.resolve();
  }

  let patches = JSONPatch.generate(prevEffectiveProperties, effectiveProperties);
  extend(true, prevEffectiveProperties, effectiveProperties);

  if (patches && patches.length) {
    patches = patches.map((p) => ({
      qOp: p.op,
      qValue: JSON.stringify(p.value),
      qPath: p.path,
    }));

    return model.applyPatches(patches, true);
  }
  return Promise.resolve();
};

export default saveSoftProperties;
