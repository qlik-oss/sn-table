/* eslint no-param-reassign: 0, no-restricted-globals: 0 */
import originalExtend from 'extend';

const extend = originalExtend.bind(null, true);
const JSONPatch = {};
const { isArray } = Array;
function isObject(v) {
  return v != null && !Array.isArray(v) && typeof v === 'object';
}
function isUndef(v) {
  return typeof v === 'undefined';
}
function isFunction(v) {
  return typeof v === 'function';
}

/**
 * Generate an exact duplicate (with no references) of a specific value.
 *
 * @private
 * @param {Object} The value to duplicate
 * @returns {Object} a unique, duplicated value
 */
function generateValue(val) {
  if (val) {
    return extend({}, { val }).val;
  }
  return val;
}

/**
 * An additional type checker used to determine if the property is of internal
 * use or not a type that can be translated into JSON (like functions).
 *
 * @private
 * @param {Object} obj The object which has the property to check
 * @param {String} The property name to check
 * @returns {Boolean} Whether the property is deemed special or not
 */
function isSpecialProperty(obj, key) {
  return isFunction(obj[key]) || key.substring(0, 2) === '$$' || key.substring(0, 1) === '_';
}

/**
 * Compare an object with another, could be object, array, number, string, bool.
 *
 * @param {Object} a The first object to compare
 * @param {Object} a The second object to compare
 * @returns {Boolean} Whether the objects are identical
 */
function compare(a, b) {
  let isIdentical = true;

  if (isObject(a) && isObject(b)) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }
    Object.keys(a).forEach((key) => {
      if (!compare(a[key], b[key])) {
        isIdentical = false;
      }
    });
    return isIdentical;
  }
  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0, l = a.length; i < l; i += 1) {
      if (!compare(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  return a === b;
}

/**
 * Generates patches by comparing two arrays.
 *
 * @private
 * @param {Array} oldA The old (original) array, which will be patched
 * @param {Array} newA The new array, which will be used to compare against
 * @returns {Array} An array of patches (if any)
 */
function patchArray(original, newA, basePath) {
  let patches = [];
  const oldA = original.slice();
  let tmpIdx = -1;

  function findIndex(a, id, idx) {
    if (a[idx] && isUndef(a[idx].qInfo)) {
      return null;
    }
    if (a[idx] && a[idx].qInfo.qId === id) {
      // shortcut if identical
      return idx;
    }
    for (let ii = 0, ll = a.length; ii < ll; ii += 1) {
      if (a[ii] && a[ii].qInfo.qId === id) {
        return ii;
      }
    }
    return -1;
  }

  if (compare(newA, oldA)) {
    // array is unchanged
    return patches;
  }

  if ((!isUndef(newA[0]) && isUndef(newA[0].qInfo)) || newA.length === 0) {
    // we cannot create patches without unique identifiers, replace array...
    patches.push({
      op: 'replace',
      path: basePath,
      value: newA,
    });
    return patches;
  }

  for (let i = oldA.length - 1; i >= 0; i -= 1) {
    tmpIdx = findIndex(newA, oldA[i].qInfo && oldA[i].qInfo.qId, i);
    if (tmpIdx === -1) {
      patches.push({
        op: 'remove',
        path: `${basePath}/${i}`,
      });
      oldA.splice(i, 1);
    } else {
      patches = patches.concat(JSONPatch.generate(oldA[i], newA[tmpIdx], `${basePath}/${i}`));
    }
  }

  for (let i = 0, l = newA.length; i < l; i += 1) {
    tmpIdx = findIndex(oldA, newA[i].qInfo && newA[i].qInfo.qId);
    if (tmpIdx === -1) {
      patches.push({
        op: 'add',
        path: `${basePath}/${i}`,
        value: newA[i],
      });
      oldA.splice(i, 0, newA[i]);
    } else if (tmpIdx !== i) {
      patches.push({
        op: 'move',
        path: `${basePath}/${i}`,
        from: `${basePath}/${tmpIdx}`,
      });
      oldA.splice(i, 0, oldA.splice(tmpIdx, 1)[0]);
    }
  }
  return patches;
}

/**
 * Generate an array of JSON-Patch:es following the JSON-Patch Specification Draft.
 *
 * See [specification draft](http://tools.ietf.org/html/draft-ietf-appsawg-json-patch-10)
 *
 * Does NOT currently generate patches for arrays (will replace them)
 *
 * @param {Object} original The object to patch to
 * @param {Object} newData The object to patch from
 * @param {String} [basePath] The base path to use when generating the paths for
 *                            the patches (normally not used)
 * @returns {Array} An array of patches
 */
JSONPatch.generate = function generate(original, newData, basePath) {
  basePath = basePath || '';
  let patches = [];

  Object.keys(newData).forEach((key) => {
    const val = generateValue(newData[key]);
    const oldVal = original[key];
    const tmpPath = `${basePath}/${key}`;

    if (compare(val, oldVal) || isSpecialProperty(newData, key)) {
      return;
    }
    if (isUndef(oldVal)) {
      // property does not previously exist
      patches.push({
        op: 'add',
        path: tmpPath,
        value: val,
      });
    } else if (isObject(val) && isObject(oldVal)) {
      // we need to generate sub-patches for this, since it already exist
      patches = patches.concat(JSONPatch.generate(oldVal, val, tmpPath));
    } else if (isArray(val) && isArray(oldVal)) {
      patches = patches.concat(patchArray(oldVal, val, tmpPath));
    } else {
      // it's a simple property (bool, string, number)
      patches.push({
        op: 'replace',
        path: `${basePath}/${key}`,
        value: val,
      });
    }
  });

  Object.keys(original).forEach((key) => {
    if (isUndef(newData[key]) && !isSpecialProperty(original, key)) {
      // this property does not exist anymore
      patches.push({
        op: 'remove',
        path: `${basePath}/${key}`,
      });
    }
  });

  return patches;
};

export default JSONPatch;
