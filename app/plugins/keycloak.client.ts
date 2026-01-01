import Keycloak from 'keycloak-js'

type AuthState = {
  ready: boolean
  authenticated: boolean
  token: string | null
  keycloak: Keycloak | null
  error: string | null
}

function normalizeKeycloakError(e: unknown): { code?: string; message?: string } {
  // Keycloak иногда кидает объект вида { error: 'login_required', error_description: ... }
  if (e && typeof e === 'object') {
    const anyE = e as any
    const code = anyE.error ?? anyE.code
    const message =
      anyE.message ??
      anyE.error_description ??
      anyE.error ??
      (() => {
        try {
          return JSON.stringify(anyE)
        } catch {
          return String(anyE)
        }
      })()

    return { code, message }
  }

  if (typeof e === 'string') return { message: e }
  return { message: String(e) }
}

export default defineNuxtPlugin(async () => {
  console.log('[keycloak] plugin loaded ✅')

  const config = useRuntimeConfig()

  const auth = useState<AuthState>('auth', () => ({
    ready: false,
    authenticated: false,
    token: null,
    keycloak: null,
    error: null,
  }))

  const kcUrl = config.public.keycloakUrl
  const kcRealm = config.public.keycloakRealm
  const kcClientId = config.public.keycloakClientId

  console.log('[keycloak] config:', { kcUrl, kcRealm, kcClientId })

  if (!kcUrl || !kcRealm || !kcClientId) {
    auth.value.error = 'Keycloak config is empty. Check .env and restart dev server.'
    auth.value.ready = true
    return
  }

  const keycloak = new Keycloak({
    url: kcUrl,
    realm: kcRealm,
    clientId: kcClientId,
  })

  auth.value.keycloak = keycloak

  try {
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,

      // чтобы не было "#fragment" в url
      responseMode: 'query',
    })

    // const url = new URL(window.location.href)
    const url = new URL(window.location.href)
    const hasCallbackParams =
      url.searchParams.has('code') ||
      url.searchParams.has('state') ||
      url.searchParams.has('session_state') ||
      url.searchParams.has('iss') ||
      url.searchParams.has('error')

    if (hasCallbackParams) {
      // чистим только когда уже есть результат авторизации
      // (иначе можно словить странные эффекты при check-sso)
      const keysToDrop = ['error', 'error_description', 'state', 'session_state', 'iss', 'code']
      for (const k of keysToDrop) url.searchParams.delete(k)

      window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : '') + url.hash)
    }

    auth.value.authenticated = authenticated
    auth.value.token = keycloak.token ?? null
    auth.value.error = null // ✅ важно: чистим ошибку при успехе
    auth.value.ready = true

    console.log('[keycloak] init ok, authenticated=', authenticated)
  } catch (e: unknown) {
    const { code, message } = normalizeKeycloakError(e)

    // ⛔ НЕ ошибка — просто нет SSO-сессии
    if (code === 'login_required') {
      console.log('[keycloak] no SSO session')
      auth.value.authenticated = false
      auth.value.token = null
      auth.value.error = null
      auth.value.ready = true
      return
    }

    // ❗ Реальная ошибка
    console.error('[keycloak] init failed:', e)

    auth.value.authenticated = false
    auth.value.token = null
    auth.value.error = message ?? 'Keycloak init failed'
    auth.value.ready = true
  }


  // refresh token (чтобы сессия не отваливалась)
  setInterval(async () => {
    if (!auth.value.keycloak) return
    if (!auth.value.authenticated) return

    try {
      const refreshed = await auth.value.keycloak.updateToken(30)
      if (refreshed) {
        auth.value.token = auth.value.keycloak.token ?? null
      }
    } catch {
      auth.value.authenticated = false
      auth.value.token = null
    }
  }, 10_000)
})
