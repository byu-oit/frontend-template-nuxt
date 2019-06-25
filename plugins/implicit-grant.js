import * as implicit from '~/assets/js/implicit-grant'
import * as authn from '@byuweb/browser-oauth/byu-browser-oauth.mjs'

const authnInfo = require('~/static/config.json')

export default (context) => {
  implicit.configure({
    clientId: authnInfo.clientId,
    callbackUrl: authnInfo.callbackUrl
  })

  // eslint-disable-next-line no-new
  new authn.AuthenticationObserver(({ state, token, user }) => {
    switch (state) {
      case 'unauthenticated':
        window.sessionStorage.setItem(
          'studentVotingAdminPreauthPath',
          context.route.path
        )
        authn.login()
        break
      case 'error':
        context.store.commit('needManualRefresh')
        break
      case 'authenticated': {
        if (window.opener) {
          window.opener.document.dispatchEvent(
            new CustomEvent('byu-browser-oauth-state-changed', {
              detail: { state, token, user }
            })
          )
          window.close()
        }
        checkRefresh(token.expiresAt.getTime())
        context.$axios.setToken(token.authorizationHeader)
        context.store.commit('setToken', token.bearer)
        context.store.dispatch('authenticate', user)
        const prePath = window.sessionStorage.getItem('studentVotingAdminPreauthPath')
        window.sessionStorage.removeItem('studentVotingAdminPreauthPath')
        if (prePath) {
          context.redirect(prePath)
        }
      }
    }
  })

  const checkRefresh = (expirationTimeInMs) => {
    // Simply using setTimeout for an hour in the future
    // doesn't work; setTimeout isn't that precise over that long of a period.
    // So re-check every five seconds until we're past the expiration time

    const expiresInMs = expirationTimeInMs - Date.now()

    if (expiresInMs < 0 || expiresInMs > 3300000) {
      // If we've expired OR if the WSO2 five-minute grace period was not added, then trigger a refresh.
      // Wait an extra 5 seconds to avoid WSO2 clock skew problems
      // Existing token *should* have a five-minute grace period after expiration:
      // a new request will generate a new token, but the old token should still
      // work during that grace period
      return setTimeout(authn.refresh, 5000)
    }

    setTimeout(() => checkRefresh(expirationTimeInMs), 5000)
  }
}
