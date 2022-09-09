// eslint-disable-next-line import/prefer-default-export
export const getKey = (app, layout) => {
  return `${app.id}.${layout?.qInfo?.qId}.v2`;
};
