import type Keycloak from 'keycloak-js'

type AuthState = {
  ready: boolean
  authenticated: boolean
  token: string | null
  keycloak: Keycloak | null
  error: string | null
}

export function useAuth() {
  const auth = useState<AuthState>('auth')

  const ready = computed(() => !!auth.value?.ready)
  const authenticated = computed(() => !!auth.value?.authenticated)
  const token = computed(() => auth.value?.token ?? null)
  const error = computed(() => auth.value?.error ?? null)

  const login = async () => {
    const kc = auth.value?.keycloak
    if (!kc) return

    await kc.login({
      // ✅ после логина сразу на /me
      redirectUri: window.location.origin + '/me',
    })
  }

  const logout = async () => {
    const kc = auth.value?.keycloak
    if (!kc) return
    await kc.logout({ redirectUri: window.location.origin + '/login' })
  }

  return { ready, authenticated, token, error, login, logout }
}
