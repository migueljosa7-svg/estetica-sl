/**
 * FavoritesContext — lista de favoritos persistida en localStorage.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS, readStorage, writeStorage } from '@/lib/storage'

interface FavoritesContextValue {
  ids: string[]
  isFavorite: (id: string) => boolean
  toggle: (id: string) => void
  clear: () => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.favorites, []),
  )

  useEffect(() => {
    writeStorage(STORAGE_KEYS.favorites, ids)
  }, [ids])

  const toggle = useCallback((id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }, [])

  const clear = useCallback(() => setIds([]), [])

  const value = useMemo<FavoritesContextValue>(
    () => ({
      ids,
      isFavorite: (id: string) => ids.includes(id),
      toggle,
      clear,
    }),
    [ids, toggle, clear],
  )

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  )
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites debe usarse dentro de <FavoritesProvider>')
  return ctx
}
