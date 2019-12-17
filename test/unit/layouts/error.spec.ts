import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import layout from '~/layouts/error.vue'

const localVue = createLocalVue()
Vue.use(Vuetify)
const vuetify = new Vuetify({})

describe('layouts/error', () => {
  test('exists', () => {
    const wrapper = mount(layout, {
      localVue,
      vuetify,
      propsData: { error: { message: 'An error occurred' } },
      stubs: ['nuxt-link']
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toContain('An error occurred')
  })
})
