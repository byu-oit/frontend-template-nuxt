import axios from 'axios'

export default function(context) {
  context.$axios.onResponseError(error => {
    if (axios.isCancel(error)) {
      // Explicit cancellation, so do not show "error" message
      return
    }
    if (error.config && error.response?.status === 401) {
      // WSO2 token expired (or otherwise invalidated)
      // Auto-refresh should happen in iframe background in ./implicit-grant.js
      // If that fails, then we can't auto-refresh, so...
      context.store.commit('needManualRefresh', error.config.method !== 'get')
      return false
    }
    context.store.commit('addNetworkError', error)
  })
}
