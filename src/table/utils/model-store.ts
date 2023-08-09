const keyStore = (initialState: { [key: string]: EngineAPI.IField } = {}) => {
  const sharedState = initialState;
  const store = {
    get: (key: string) => {
      return sharedState[key];
    },
    set: (key: string, value: EngineAPI.IField) => {
      sharedState[key] = value;
    },
  };

  return store;
};

const modelStore = keyStore({});

export default modelStore;
