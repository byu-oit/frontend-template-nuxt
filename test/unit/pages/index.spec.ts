import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import index from '~/pages/index.vue'

const stubs = ['nuxt-link']

const localVue = createLocalVue()
Vue.use(Vuetify)

const vuetify = new Vuetify({})
const wrapper = mount(index, {
  localVue,
  vuetify,
  stubs
})

describe('pages/index', () => {
  test('exists', () => {
    expect(wrapper.vm).toBeTruthy()
  })
})
