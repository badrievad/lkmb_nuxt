type Organization = {
  id: number
  name: string
}

const SELECTED_ORG_KEY = 'selectedOrgId'

export function useUserOrgs() {
  const { token } = useAuth()
  
  const organizations = useState<Organization[]>('userOrganizations', () => [])
  const selectedOrg = useState<Organization | null>('selectedOrganization', () => null)
  const loading = useState<boolean>('userOrgsLoading', () => false)
  const error = useState<string | null>('userOrgsError', () => null)

  async function loadUserOrganizations() {
    loading.value = true
    error.value = null
    
    try {
      // Запрос организаций пользователя (не всех!)
      const query = `
        query GetUserOrgs {
          me {
            orgs {
              id
              name
            }
          }
        }
      `
      
      const result = await graphqlRequest<{ me: { orgs: Organization[] } }>(
        query,
        {},
        token.value
      )
      
      organizations.value = result.me.orgs ?? []
      
      // Попытка восстановить выбранную организацию из localStorage
      if (process.client) {
        const savedOrgId = localStorage.getItem(SELECTED_ORG_KEY)
        
        if (savedOrgId) {
          const savedOrg = organizations.value.find(org => org.id === parseInt(savedOrgId))
          if (savedOrg) {
            selectedOrg.value = savedOrg
            return
          }
        }
      }
      
      // Если нет сохраненной организации или она недоступна - выбираем первую
      if (!selectedOrg.value && organizations.value.length > 0) {
        selectedOrg.value = organizations.value[0]
        saveSelectedOrgToStorage(organizations.value[0].id)
      }
    } catch (e: any) {
      error.value = e?.message || 'Не удалось загрузить организации'
      console.error('Failed to load user organizations:', e)
    } finally {
      loading.value = false
    }
  }

  function saveSelectedOrgToStorage(orgId: number) {
    if (process.client) {
      localStorage.setItem(SELECTED_ORG_KEY, orgId.toString())
    }
  }

  function selectOrganization(org: Organization) {
    selectedOrg.value = org
    saveSelectedOrgToStorage(org.id)
  }

  async function refreshOrganizations() {
    await loadUserOrganizations()
  }

  return {
    organizations: readonly(organizations),
    selectedOrg: readonly(selectedOrg),
    loading: readonly(loading),
    error: readonly(error),
    loadUserOrganizations,
    selectOrganization,
    refreshOrganizations,
  }
}