const encoder = new TextEncoder()
async function signingKey(secret: string) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

export async function issueSpeedToken(secret: string, now = Date.now()) {
  const payload = `${now}:${crypto.randomUUID()}`
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', await signingKey(secret), encoder.encode(payload)))
  return `${payload}.${Array.from(signature, byte => byte.toString(16).padStart(2, '0')).join('')}`
}

export async function verifySpeedToken(token: string, secret: string, now = Date.now()) {
  const [payload, signature] = token.split('.')
  if (!payload || !signature || !/^\d{13}:[0-9a-f-]{36}$/.test(payload) || !/^[0-9a-f]{64}$/.test(signature)) return false
  const issuedAt = Number(payload.split(':')[0])
  if (issuedAt > now + 30000 || now - issuedAt > 15 * 60 * 1000) return false
  const bytes = Uint8Array.from(signature.match(/.{2}/g) ?? [], value => parseInt(value, 16))
  return crypto.subtle.verify('HMAC', await signingKey(secret), bytes, encoder.encode(payload))
}