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
        <nuxt/>
      </v-container>
    </v-content>
    <byu-footer/>
  </v-app>
</template>

<script>
import 'vuetify/dist/vuetify.min.css'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class DefaultLayout extends Vue {
  get username () {
    return this.$store.state.username
  }
}
</script>
