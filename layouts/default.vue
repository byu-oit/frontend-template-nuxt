<template>
  <div v-if="!$store.state.authenticated">
    Logging in...
  </div>
  <div v-else class="containing-element">
    <v-app>
      <byu-header home-url="https://vote.byu.edu">
        <span slot="site-title">Frontend Template</span>
        <byu-user-info slot="user">
          <a slot="login" href="#login">Sign In</a>
          <a slot="logout" href="//api.byu.edu/logout">Sign Out</a>
          <span slot="user-name">{{ username }}</span>
        </byu-user-info>
      </byu-header>
      <v-dialog
        :value="$store.state.networkErrors.length"
        content-class="dialog-auto-width"
        class="network-errors-dialog"
        @input="v => v || $store.dispatch('clearNetworkErrors')"
      >
        <v-card>
          <v-card-title class="headline error white--text">
            Error<span v-if="$store.state.networkErrors.length > 1">s</span>
          </v-card-title>
          <v-card-text>
            <div v-if="$store.state.networkErrors.length == 1" id="single-network-error">
              {{ $store.state.networkErrors[0] }}
            </div>
            <div v-else>
              <ul>
                <li v-for="(msg, index) in $store.state.networkErrors" :key="index">
                  {{ msg }}
                </li>
              </ul>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click.stop="$store.dispatch('clearNetworkErrors')">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        :value="$store.state.manualRefreshRequired"
        content-class="dialog-auto-width"
        persistent
        class="authentication-dialog"
        @input="v => v || $store.commit('clearManualRefresh')"
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
            <div v-if="$store.state.refreshBecausePostFailed">
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
import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import * as authn from '@byuweb/browser-oauth'

@Component
export default class DefaultLayout extends Vue {
  @Mutation clearManualRefresh!: () => void

  get username() {
    return this.$store.state.username
  }

  popupAuth() {
    authn.refresh('popup')
    this.clearManualRefresh()
  }
}
</script>
