type SanityFetchClient = {
  fetch: <T = unknown>(
    query: string,
    params?: Record<string, unknown>,
    options?: Record<string, unknown>
  ) => Promise<T>
}

export async function sanityFetchWithTimeout<T>(
  client: SanityFetchClient,
  query: string,
  params: Record<string, unknown> = {}
) {
  const config = useRuntimeConfig()
  const timeoutMs = Number(config.public.sanityFetchTimeoutMs || 1200)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await client.fetch<T>(query, params, { signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}
