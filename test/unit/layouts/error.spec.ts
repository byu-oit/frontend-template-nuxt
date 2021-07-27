import { createLocalVue, mount } from '@vue/test-utils'
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
    expect(wrapper.vm).toBeTruthy()
    // @ts-ignore direct call to custom vm method
    expect(wrapper.vm.head()).toEqual({ title: 'An error occurred' })
    expect(wrapper.html()).toContain('An error occurred')
  })
})
