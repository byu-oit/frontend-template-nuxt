import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import VueMeta from 'vue-meta'
import Vuetify from 'vuetify'
import index from '~/pages/index.vue'

const stubs = ['nuxt-link']

const localVue = createLocalVue()
localVue.use(VueMeta, { keyName: 'head' })
Vue.use(Vuetify)

const vuetify = new Vuetify({})
const wrapper = shallowMount(index, {
  localVue,
  vuetify,
  stubs
})

describe('pages/index', () => {
  test('exists', () => {
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.vm.$meta().refresh().metaInfo.title).toEqual('Home')
  })
})
