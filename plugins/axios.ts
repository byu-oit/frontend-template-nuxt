import { Context } from '@nuxt/types'
import axios from 'axios'
import { get } from 'lodash'
import AuthRefreshRequired from '~/components/network/AuthRefreshRequired.vue'

let refreshDialogVisible = false
const errorMessages: string[] = []

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
      if (!refreshDialogVisible) {
        const failDuringPost = error.config.method !== 'get'
        refreshDialogVisible = true
        context.$dialog
          .show(AuthRefreshRequired, { failDuringPost, persistent: true, waitForResult: true })
          // @ts-ignore: Third-party Typescript definition file is not correct: "show" can return a Promise
          .then(() => (refreshDialogVisible = false))
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

    // Only pop up one copy of each error message at a time
    if (!errorMessages.includes(text)) {
      errorMessages.push(text)
      context.$dialog.error({ title: 'Error', icon: false, text }).then(() => {
        const index = errorMessages.indexOf(text)
        if (index !== -1) {
          errorMessages.splice(index, 1)
        }
      })
    }
  })
}
