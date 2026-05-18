import { useState, useEffect, useRef } from 'react';

export function useIntroCycle(viewMode) {
  const [introCycle, setIntroCycle] = useState(0);
  const first = useRef(true);
  const prevView = useRef(viewMode);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      setIntroCycle((n) => n + 1);
      prevView.current = viewMode;
      return;
    }

    if (prevView.current !== viewMode) {
      prevView.current = viewMode;
      setIntroCycle((n) => n + 1);
    }
  }, [viewMode]);

  return introCycle;
}
