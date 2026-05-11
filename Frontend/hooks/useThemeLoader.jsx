import { useState, useEffect } from 'react';

export function useThemeLoader(theme, page) {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    if (!theme || !page) return;
    import(`../themes/${theme}/${page}/index.json`)
      .then((m) => setConfig(m.default || m))
      .catch(() => setConfig(null));
  }, [theme, page]);
  return config;
}
