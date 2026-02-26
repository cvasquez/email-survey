const BOT_PATTERNS = [
  // Email security scanners
  /safelinks/i,
  /barracuda/i,
  /proofpoint/i,
  /mimecast/i,
  /googleimageproxy/i,
  /fortiguard/i,
  /symantec/i,
  /fireeye/i,
  /trendmicro/i,

  // Generic bot identifiers
  /bot\b/i,
  /crawler/i,
  /spider/i,
  /\bscan/i,
  /preview/i,
  /prefetch/i,
  /slurp/i,
  /archiver/i,

  // Automated HTTP clients
  /\bcurl\b/i,
  /\bwget\b/i,
  /python-requests/i,
  /python-urllib/i,
  /Go-http-client/i,
  /Java\//i,
  /Apache-HttpClient/i,
  /node-fetch/i,
  /axios\//i,
  /libwww-perl/i,
  /http_request/i,
  /okhttp/i,
]

export function isSuspectedBot(userAgent: string | null): boolean {
  if (!userAgent || userAgent.trim().length === 0) return true
  if (userAgent.trim().length < 20) return true

  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent))
}
