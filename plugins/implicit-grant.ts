import * as authn from '@byuweb/browser-oauth'
import dynamicImportPolyfill from 'dynamic-import-polyfill'
import { Context } from '@nuxt/types'
import AuthRefreshRequired from '~/components/network/AuthRefreshRequired.vue'

declare function __import__(url: string): Promise<any>

export default (context: Context) => {
  // TODO: If Edge ever natively supports dynamic imports (i.e. "import(xxx)" returns a Promise), then use native
  dynamicImportPolyfill.initialize()
  __import__(/* webpackIgnore: true */ 'https://cdn.byu.edu/browser-oauth-implicit/latest/implicit-grant.min.js').then(
    implicit =>
      fetch(`${context.base}config.json`)
        .then(response => response.json())
        .then(config => implicit.configure(config))
  )

  // External library, so we cannot avoid "new" constructor
  // eslint-disable-next-line no-new
  new authn.AuthenticationObserver(({ state, token, user }) => {
    switch (state) {
      case authn.STATE_UNAUTHENTICATED:
        window.sessionStorage.setItem('sitePreauthPath', context.route.path)
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
        if (prePath) {
          context.redirect(prePath)
        }
      }
    }
  })
}
