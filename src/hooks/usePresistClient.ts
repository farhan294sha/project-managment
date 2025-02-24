import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { useQueryClient } from '@tanstack/react-query'
import {
  persistQueryClient,
  removeOldestQuery,
  type PersistedClient,
} from '@tanstack/react-query-persist-client'
import { useEffect } from 'react';


const usePersistQueryClient = () => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
      throttleTime: 1000,
      retry: removeOldestQuery,
      serialize: data => JSON.stringify(data),
      deserialize: data => JSON.parse(data)  as PersistedClient,
    })

    persistQueryClient({
      queryClient,
      persister: localStoragePersister,
      maxAge: 60 * 60 * 24,
    })
  })
}

export default usePersistQueryClient