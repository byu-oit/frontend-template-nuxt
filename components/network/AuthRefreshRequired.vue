<template>
  <v-card>
    <v-card-title class="headline warning white--text">
      Re-authentication Required
    </v-card-title>
    <v-card-text>
      CAS Authentication has expired.<br />
      <br />
      Click this "Re-authenticate" button. You will log in through a separate tab and then immediately return to this
      page.
      <div v-if="failDuringPost">
        <br />
        If you were in the middle of saving data, you may have to click "Save" again.
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" large @click.stop="popupAuth">
        Re-authenticate
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import * as authn from '@byuweb/browser-oauth'

@Component
export default class AuthRefreshRequired extends Vue {
  @Prop(Boolean) failDuringPost!: boolean

  popupAuth() {
    authn.refresh('popup')
    this.$emit('submit')
  }
}
</script>
