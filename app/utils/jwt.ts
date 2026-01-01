export function decodeJwtPayload(token: string) {
  const [, payload] = token.split('.')
  if (!payload) throw new Error('Invalid JWT')

  const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)

  const json = decodeURIComponent(
    Array.from(atob(padded), c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
  )

  return JSON.parse(json)
}
