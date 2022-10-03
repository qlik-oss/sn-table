import { useTheme, useState, useEffect } from '@nebula.js/stardust';

const useExtendedTheme = () => {
  const nebulaTheme = useTheme();
  const [theme, setTheme] = useState(nebulaTheme);

  useEffect(() => {
    if (nebulaTheme) {
      const themeProxy = new Proxy(nebulaTheme, {
        get(target, prop) {
          if (prop === 'getColorPickerColor') {
            return (...args) => {
              if (args[0].index) {
                args[0].index = Math.max(0, args[0].index - 1);
              }
              return target[prop](...args);
            };
          }
          return target[prop];
        },
      });
      setTheme(themeProxy);
    }
  }, [nebulaTheme]);

  return theme;
};

export default useExtendedTheme;
