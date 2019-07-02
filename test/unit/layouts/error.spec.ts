import { mount, createLocalVue } from '@vue/test-utils'
import layout from '~/layouts/error.vue'

describe('layouts/error', () => {
  test('exists', () => {
    const wrapper = mount(layout, {
      localVue: createLocalVue(),
      propsData: { error: { message: 'An error occurred' } },
      stubs: ['nuxt-link']
    })

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toContain('An error occurred')
  })
})
