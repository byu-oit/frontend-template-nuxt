<template>
  <div v-if="!authenticated">
    Logging in...
  </div>
  <div v-else class="containing-element">
    <v-app>
      <byu-header home-url="https://vote.byu.edu">
        <span slot="site-title">
          Frontend Template
          <span v-if="isSandbox" class="sandbox-notification">DEV</span>
        </span>
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
  </div>
</template>

<script lang="ts">
import { Component, Getter, State, Vue } from 'nuxt-property-decorator'
import { User } from '~/types'

@Component
export default class DefaultLayout extends Vue {
  @State authenticated!: boolean
  @State user!: User
  @Getter username!: string

  get isSandbox() {
    return this.user?.rawUserInfo?.['http://wso2.org/claims/keytype'] === 'SANDBOX'
  }
}
</script>

<style lang="sass">
.sandbox-notification
  font-weight: bold
  background-color: white
  color: rgb(0, 46, 93)
  padding: 5px 10px
  margin-left: 0.5em
  border-radius: 3px
</style>
