/* eslint-disable import/prefer-default-export */
export function generateRandomString(keyLength) {
  let result = '';
  let i;
  let j;

  for (i = 0; i < keyLength; i++) {
    j = Math.floor(Math.random() * 62);
    if (j < 10) {
      result += j;
    } else if (j > 9 && j < 36) {
      result += String.fromCharCode(j + 55);
    } else {
      result += String.fromCharCode(j + 61);
    }
  }

  return result;
}
