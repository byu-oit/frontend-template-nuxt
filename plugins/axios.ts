import axios from 'axios'
import { get } from 'lodash'
import { Context } from '@nuxt/types'
import AuthRefreshRequired from '~/components/network/AuthRefreshRequired.vue'

export default (context: Context) => {
  context.$dialog.component('authRefreshRequired', AuthRefreshRequired)

  context.$axios.onResponseError(error => {
    if (axios.isCancel(error)) {
      // Explicit cancellation, so do not show "error" message
      return
    }
    if (error.config && error.response?.status === 401) {
      // WSO2 token expired (or otherwise invalidated)
      // Auto-refresh should happen in iframe background in ./implicit-grant.js
      // If that fails, then we can't auto-refresh, so...
      const failDuringPost = error.config.method !== 'get'
      context.$dialog.show(AuthRefreshRequired, { failDuringPost, persistent: true })
      return false
    }

    const text =
      get(error, 'response.data.readable_message') ||
      get(error, 'response.data.metadata.validation_response.message') ||
      get(error, 'response.data.ResolveIdentityService.errors.0.message') ||
      error.message ||
      'Unknown Error'

    // @ts-ignore: "icon" has wrong type definition in source file (should be "string | boolean" instead of just "string")
    context.$dialog.error({ title: 'Error', icon: false, text })
  })
}
