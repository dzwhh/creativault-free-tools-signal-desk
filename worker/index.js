const assetRequest = (request, pathname) => {
  const url = new URL(request.url)
  url.pathname = pathname
  return new Request(url, request)
}

export default {
  async fetch(request, env) {
    if (!env?.ASSETS?.fetch) {
      return new Response('Static asset binding unavailable', { status: 503 })
    }

    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404 || request.method !== 'GET') return response

    const pathname = new URL(request.url).pathname
    const isApplicationRoute = !pathname.split('/').pop()?.includes('.')
    if (!isApplicationRoute) return response

    return env.ASSETS.fetch(assetRequest(request, '/index.html'))
  },
}
