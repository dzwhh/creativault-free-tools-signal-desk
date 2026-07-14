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

    const pathname = new URL(request.url).pathname
    const isApplicationRoute = !pathname.split('/').pop()?.includes('.')
    const response = await env.ASSETS.fetch(request)
    const isAssetMiss = response.status === 404 || (response.status >= 300 && response.status < 400)
    if (request.method !== 'GET' || !isApplicationRoute || !isAssetMiss) return response

    return env.ASSETS.fetch(assetRequest(request, '/'))
  },
}
