export type RepositoryState<T> = { status: 'idle' | 'loading' | 'success' | 'error'; data?: T; error?: string; attempts: number }

export async function withRetry<T>(operation: () => Promise<T>, retries = 2, onState?: (state: RepositoryState<T>) => void): Promise<T> {
  let attempts = 0
  onState?.({ status: 'loading', attempts })
  while (attempts <= retries) {
    try {
      const data = await operation()
      onState?.({ status: 'success', data, attempts })
      return data
    } catch (error) {
      attempts += 1
      if (attempts > retries) {
        const message = error instanceof Error ? error.message : 'Unknown repository error'
        onState?.({ status: 'error', error: message, attempts })
        throw error
      }
    }
  }
  throw new Error('Repository operation failed')
}

export function localRepository<T>(read: () => T, write: (value: T) => void) {
  return {
    async get() { return withRetry(async () => read()) },
    async save(value: T) { return withRetry(async () => { write(value); return value }) },
  }
}
