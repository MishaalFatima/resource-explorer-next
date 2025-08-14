// hooks/useFavorites.ts
import { useCallback, useEffect, useState } from "react";

type FavMap = Record<number, true>;
const STORAGE_KEY = "rx_favorites_v1";

/**
 * useFavorites
 * - favorites stored as an object map { "<id>": true }
 * - toggle(id) and isFavorite(id) helpers
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavMap>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      setFavorites({});
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore write errors (e.g. storage full / private mode)
    }
  }, [favorites]);

  const toggle = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: number) => !!favorites[id], [favorites]);

  return { favorites, toggle, isFavorite };
}
