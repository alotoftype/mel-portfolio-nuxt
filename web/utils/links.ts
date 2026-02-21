const ABSOLUTE_URL_REGEX = /^(https?:)?\/\//i
const PROTOCOL_URL_REGEX = /^(mailto:|tel:|sms:|ftp:)/i

function toStringOrEmpty(value?: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export function isExternalUrl(url?: unknown) {
  const normalized = toStringOrEmpty(url)
  if (!normalized) return false
  return ABSOLUTE_URL_REGEX.test(normalized) || PROTOCOL_URL_REGEX.test(normalized)
}

export function normalizeNavigationUrl(rawUrl?: unknown) {
  const url = toStringOrEmpty(rawUrl)
  if (!url) return ''
  if (url.startsWith('#')) return url
  if (isExternalUrl(url)) return url
  return url.startsWith('/') ? url : `/${url}`
}

export function normalizeOptionalUrl(rawUrl?: unknown) {
  const url = toStringOrEmpty(rawUrl)
  if (!url) return ''
  return ABSOLUTE_URL_REGEX.test(url) || PROTOCOL_URL_REGEX.test(url)
    ? url
    : (url.startsWith('/') || url.startsWith('#') ? url : `/${url}`)
}
