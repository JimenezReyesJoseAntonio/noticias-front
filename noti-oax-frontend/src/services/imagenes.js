import api from './api'

export function getUrlImagen(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return new URL(url, `${new URL(api.defaults.baseURL).origin}/`).href
}
