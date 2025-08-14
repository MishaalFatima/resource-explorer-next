// hooks/useDebounce.ts
import { useEffect, useState } from "react";

/**
 * useDebounce - returns a debounced version of value after `delay` ms.
 * Generic typed for convenience.
 */
export function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
