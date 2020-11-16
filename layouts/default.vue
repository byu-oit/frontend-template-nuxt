<template>
  <v-app>
    <byu-header>
      <span slot="site-title">
        Frontend Template
        <!-- TODO change site title -->
        <span v-if="isSandbox" class="sandbox-notification">DEV</span>
      </span>
      <byu-user-info v-if="authenticated" slot="user">
        <a slot="login" href="#">Sign In</a>
        <a slot="logout" href="#" @click.stop.prevent="logout">Sign Out</a>
        <span slot="user-name">{{ username }}</span>
      </byu-user-info>
    </byu-header>

    <v-main>
      <v-container>
        <nuxt v-if="authenticated" />
        <v-row v-else align="center" justify="center">
          <h1>
            Loading
            <v-progress-circular indeterminate />
          </h1>
        </v-row>
      </v-container>
    </v-main>

    <byu-footer />
  </v-app>
</template>

<script lang="ts">
import { Component, Getter, State, Vue } from 'nuxt-property-decorator'
import * as authn from '@byuweb/browser-oauth'
import { User } from '~/types'

@Component
export default class DefaultLayout extends Vue {
  @State authenticated!: boolean
  @State user!: User
  @Getter username!: string

  get isSandbox() {
    return this.user?.rawUserInfo?.['http://wso2.org/claims/keytype'] === 'SANDBOX'
  }

  logout() {
    authn.logout()
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
