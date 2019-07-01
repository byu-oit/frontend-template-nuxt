import * as authn from '@byuweb/browser-oauth/byu-browser-oauth.mjs'

export default (context) => {
  // External library, so we cannot avoid "new" constructor
  // eslint-disable-next-line no-new
  new authn.AuthenticationObserver(({ state, token, user }) => {
    switch (state) {
      case 'unauthenticated':
        window.sessionStorage.setItem(
          'lockerAdminPreauthPath',
          context.route.path
        )
        authn.login()
        break
      case 'error':
        context.store.commit('needManualRefresh')
        break
      case 'authenticated': {
        context.$axios.setToken(token.authorizationHeader)
        context.store.dispatch('authenticate', user)
        const prePath = window.sessionStorage.getItem('lockerAdminPreauthPath')
        window.sessionStorage.removeItem('lockerAdminPreauthPath')
        if (prePath) {
          context.redirect(prePath)
        }
      }
    }
  })
}
