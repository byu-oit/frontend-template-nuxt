<template>
  <v-app>
    <byu-header home-url="//url.byu.edu">
      <span slot="site-title">Frontend App</span>
      <byu-user-info slot="user">
        <a slot="login" href="#login">Sign In</a>
        <a slot="logout" href="//api.byu.edu/logout">Sign Out</a>
        <span slot="user-name">{{ username }}</span>
      </byu-user-info>
    </byu-header>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <byu-footer />
  </v-app>
</template>

<script>
import 'vuetify/dist/vuetify.min.css'
import * as authn from '@byuweb/browser-oauth/byu-browser-oauth.mjs'

export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'bubble_chart',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  computed: {
    username () {
      return this.$store.state.username
    }
  },
  mounted () {
    // oauth
    // eslint-disable-next-line
    new authn.AuthenticationObserver(
      ({ state, token, user, error }) => {
        // React to change
        if (token) {
          this.$store.commit('setToken', token)
        }
        if (state === authn.STATE_UNAUTHENTICATED) {
          authn.login().catch((e) => {
            console.log(e.message())
          })
        }
        if (state === authn.STATE_EXPIRED) {
          // Need to refresh the token
          authn.refresh().catch((e) => {
            console.log(e.message())
          })
        }
        if (error) {
          // Do nothing
        }
        if (user) {
          this.$store.commit('setLoggedInUser', user.name.displayName)
        }
      }
    )
  }
}
</script>
