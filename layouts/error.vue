<template>
  <v-app>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <nuxt-link to="/">
      Home page
    </nuxt-link>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ErrorLayout extends Vue {
  @Prop({ default: null }) error!: object

  pageNotFound: string = '404 Not Found'
  otherError: string = 'An error occurred'

  head() {
    const title =
      // @ts-ignore using generic object type
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 20px;
}
</style>
