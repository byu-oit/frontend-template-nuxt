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
    <v-dialog
      :value="$store.state.networkErrors.length"
      content-class="dialog-auto-width"
      @input="v => v || $store.commit('clearNetworkErrors')"
    >
      <v-card>
        <v-card-title class="headline red darken-2 white--text">
          Error<span v-if="$store.state.networkErrors.length > 1">s</span>
        </v-card-title>
        <v-card-text>
          <div v-if="$store.state.networkErrors.length == 1">
            {{ $store.state.networkErrors[0] }}
          </div>
          <div v-else>
            <ul>
              <li
                v-for="(msg, index) in $store.state.networkErrors"
                :key="index"
              >
                {{ msg }}
              </li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click.stop="$store.commit('clearNetworkErrors')"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      :value="$store.state.manualRefreshRequired"
      content-class="dialog-auto-width"
      persistent
      @input="v => v || $store.commit('clearManualRefresh')"
    >
      <v-card>
        <v-card-title class="headline yellow darken-2">
          Re-authentication Required
        </v-card-title>
        <v-card-text>
          CAS Authentication has expired.<br>
          <br>
          Click this "Re-authenticate" button. You will log in through a
          separate tab and then immediately return to this page.
          <div v-if="$store.state.refreshBecausePostFailed">
            <br>
            If you were in the middle of saving data, you may have to click
            "Save" again.
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
        <nuxt v-if="$store.state.authenticated"/>
        <v-layout v-else justify-center align-center>
          <v-flex>
            <v-card class="text-xs-center">
              <v-card-text class="headline">Login required. Redirecting to CAS</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <byu-footer />
  </v-app>
</template>

<script lang="ts">
import 'vuetify/dist/vuetify.min.css'
import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import * as implicit from '../assets/js/implicit-grant'

@Component
export default class DefaultLayout extends Vue {
  @Mutation clearManualRefresh!: () => void

  get username () {
    return this.$store.state.username
  }

  popupAuth () {
    implicit.startRefresh(true)
    this.clearManualRefresh()
  }
}
</script>
