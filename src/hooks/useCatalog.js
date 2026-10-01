import { useCallback, useEffect, useState } from 'react'
import { getCachedCatalog, loadCatalog, resetCatalogCache } from '../lib/catalog'

export function useCatalog() {
  const cached = getCachedCatalog()
  const [state, setState] = useState(() =>
    cached ? { status: 'ready', catalog: cached, error: null } : { status: 'loading', catalog: null, error: null },
  )

  const load = useCallback(() => {
    let active = true
    setState((s) => (s.catalog ? s : { status: 'loading', catalog: null, error: null }))
    loadCatalog()
      .then((catalog) => active && setState({ status: 'ready', catalog, error: null }))
      .catch((error) => active && setState({ status: 'error', catalog: null, error }))
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (state.status === 'ready') return
    return load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const retry = useCallback(() => {
    resetCatalogCache()
    load()
  }, [load])

  return { ...state, retry }
}
