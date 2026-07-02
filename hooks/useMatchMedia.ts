import { useCallback, useSyncExternalStore } from "react";

const useMatchMedia = (mediaQuery: string, initialValue: boolean) => {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(mediaQuery);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [mediaQuery],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(mediaQuery).matches,
    [mediaQuery],
  );

  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export default useMatchMedia;
