import '@nuxtjs/axios'
import { VuetifyDialog } from 'vuetify-dialog'

// Add missing nuxt-specific definition extension in third-party library
declare module '@nuxt/types' {
  interface Context {
    $dialog: VuetifyDialog
  }
}
