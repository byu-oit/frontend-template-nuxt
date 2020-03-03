import { Context } from '@nuxt/types'
import axios from 'axios'
import { get } from 'lodash'
import AuthRefreshRequired from '~/components/network/AuthRefreshRequired.vue'

let refreshDialog: any = null

export default (context: Context) => {
  context.$dialog.component('authRefreshRequired', AuthRefreshRequired)

  context.$axios.onResponseError(error => {
    if (axios.isCancel(error)) {
      // Explicit cancellation, so do not show "error" message
      return
    }
    if (error.config && error.response?.status === 401 && error.response?.data?.includes?.('code>90090')) {
      // WSO2 "Invalid Credentials", "Token Expired", etc, are code "90090[X]".
      // We don't bother parsing the full XML doc, just check if that chunk appears in the raw XML string
      // Auto-refresh should happen in iframe background in ./implicit-grant.js
      // If that fails, then we can't auto-refresh, so...
      if (!refreshDialog || !refreshDialog?.showed) {
        // placeholder until actual Dialog appears
        refreshDialog = { showed: true }

        const failDuringPost = error.config.method !== 'get'
        context.$dialog
          .show(AuthRefreshRequired, { failDuringPost, persistent: true })
          // @ts-ignore: Third-party Typescript definition file is not correct: "show" returns a Promise
          .then(dialog => (refreshDialog = dialog))
      }
      return false
    }

    const text =
      get(error, 'response.data.errorMessage') ||
      get(error, 'response.data.readable_message') ||
      get(error, 'response.data.metadata.validation_response.message') ||
      get(error, 'response.data.ResolveIdentityService.errors.0.message') ||
      get(error, 'response.data.message') ||
      error.message ||
      'Unknown Error'

    // @ts-ignore: "icon" has wrong type definition in source file (should be "string | boolean" instead of just "string")
    context.$dialog.error({ title: 'Error', icon: false, text })
  })
}
