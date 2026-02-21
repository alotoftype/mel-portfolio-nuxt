let sanityDisabledForSession = false
let hasWarnedAboutFallback = false

function getErrorCode(error: unknown) {
  const maybeError = error as { code?: string; cause?: { code?: string } }
  return String(maybeError?.code ?? maybeError?.cause?.code ?? '')
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error || '')
}

function isNetworkError(error: unknown) {
  const code = getErrorCode(error).toUpperCase()
  const message = getErrorMessage(error).toLowerCase()

  return (
    code === 'ABORT_ERR' ||
    code === 'ENOTFOUND' ||
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    code === 'EAI_AGAIN' ||
    code === 'ENETUNREACH' ||
    message.includes('aborted') ||
    message.includes('timeout') ||
    message.includes('enotfound') ||
    message.includes('network') ||
    message.includes('fetch failed')
  )
}

export function canUseSanityInProcess() {
  return !sanityDisabledForSession
}

export function handleSanityFetchError(context: string, error: unknown) {
  if (isNetworkError(error)) {
    sanityDisabledForSession = true
    if (!hasWarnedAboutFallback) {
      const code = getErrorCode(error)
      const suffix = code ? ` (${code})` : ''
      console.warn(
        `[Sanity] ${context} failed${suffix}. Falling back to local content for the rest of this run.`
      )
      hasWarnedAboutFallback = true
    }
    return
  }

  console.warn(`[Sanity] ${context} failed, using fallback data:`, error)
}
