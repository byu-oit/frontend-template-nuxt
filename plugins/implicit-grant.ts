import * as authn from '@byuweb/browser-oauth'

export default context => {
  // @ts-ignore: Typescript doesn't recognize external import files
  import(/* webpackIgnore: true */ 'https://cdn.byu.edu/browser-oauth-implicit/latest/implicit-grant.min.js').then(
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
        context.$dialog.authRefreshRequired({ persistent: true })
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
