import { Context } from '@nuxt/types'
import * as authn from '@byuweb/browser-oauth'
import dynamicImportPolyfill from 'dynamic-import-polyfill'
import AuthRefreshRequired from '~/components/network/AuthRefreshRequired.vue'

declare function __import__(url: string): Promise<any>

export default (context: Context) => {
  if (!context.env.oauth?.clientId) {
    // $dialog isn't fully configured when this code runs, so setTimeout bumps this call to the end of the event queue
    setTimeout(() =>
      context.$dialog.error({
        title: 'Configuration Error',
        text: 'This site is not configured correctly',
        persistent: true
      })
    )
    console.error('OAuth environment variables (OAUTH_CLIENT_ID, OAUTH_CALLBACK_URL) not set')
    return
  }

  // TODO: If Edge ever natively supports dynamic imports (i.e. "import(xxx)" returns a Promise), then use native
  dynamicImportPolyfill.initialize()
  __import__(
    /* webpackIgnore: true */ 'https://cdn.byu.edu/browser-oauth-implicit/latest/implicit-grant.min.js'
  ).then(implicit => implicit.configure(context.env.oauth))

  // External library, so we cannot avoid "new" constructor
  // eslint-disable-next-line no-new
  new authn.AuthenticationObserver(({ state, token, user }) => {
    switch (state) {
      case authn.STATE_UNAUTHENTICATED:
        window.sessionStorage.setItem('sitePreauthPath', context.route.fullPath)
        authn.login()
        break
      case authn.STATE_ERROR:
        context.$dialog.show(AuthRefreshRequired, { persistent: true })
        break
      case authn.STATE_AUTHENTICATED: {
        context.$axios.setToken(token.authorizationHeader)
        context.store.dispatch('authenticate', user)
        const prePath = window.sessionStorage.getItem('sitePreauthPath')
        window.sessionStorage.removeItem('sitePreauthPath')
        if (prePath && prePath !== context.route.fullPath) {
          context.redirect(prePath)
        }
      }
    }
  })
}
