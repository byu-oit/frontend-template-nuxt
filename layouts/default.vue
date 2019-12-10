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
      <v-dialog
        :value="networkErrors.length"
        content-class="dialog-auto-width"
        class="network-errors-dialog"
        @input="v => v || clearNetworkErrors()"
      >
        <v-card>
          <v-card-title class="headline error white--text">
            Error<span v-if="networkErrors.length > 1">s</span>
          </v-card-title>
          <v-card-text>
            <div v-if="networkErrors.length == 1" id="single-network-error">
              {{ networkErrors[0] }}
            </div>
            <div v-else>
              <ul>
                <li v-for="(msg, index) in networkErrors" :key="index">
                  {{ msg }}
                </li>
              </ul>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click.stop="clearNetworkErrors">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        :value="manualRefreshRequired"
        content-class="dialog-auto-width"
        persistent
        class="authentication-dialog"
        @input="v => v || clearManualRefresh()"
      >
        <v-card>
          <v-card-title class="headline warning white--text">
            Re-authentication Required
          </v-card-title>
          <v-card-text>
            CAS Authentication has expired.<br />
            <br />
            Click this "Re-authenticate" button. You will log in through a separate tab and then immediately return to
            this page.
            <div v-if="refreshBecausePostFailed">
              <br />
              If you were in the middle of saving data, you may have to click "Save" again.
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" large @click.stop="popupAuth()">
              Re-authenticate
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import { Action, Component, Getter, Mutation, State, Vue } from 'nuxt-property-decorator'
import * as authn from '@byuweb/browser-oauth'
import { User } from '~/types'

@Component
export default class DefaultLayout extends Vue {
  @State authenticated!: boolean
  @State manualRefreshRequired!: boolean
  @State networkErrors!: string[]
  @State refreshBecausePostFailed!: boolean
  @State user!: User
  @Action clearNetworkErrors!: () => void
  @Mutation clearManualRefresh!: () => void
  @Getter username!: string

  get isSandbox() {
    return this.user?.rawUserInfo?.['http://wso2.org/claims/keytype'] === 'SANDBOX'
  }

  popupAuth() {
    authn.refresh('popup')
    this.clearManualRefresh()
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
