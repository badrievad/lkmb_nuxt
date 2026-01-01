type GraphQLResponse<T> = { data?: T; errors?: Array<{ message: string }> }

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, any>,
  token?: string | null,
) {
  const config = useRuntimeConfig()
  const url = config.public.graphqlUrl
  if (!url) throw new Error('NUXT_PUBLIC_GRAPHQL_URL is empty')

  const res = await $fetch<GraphQLResponse<T>>(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: { query, variables },
  })

  if (res.errors?.length) {
    throw new Error(res.errors.map(e => e.message).join('; '))
  }

  return res.data as T
}
