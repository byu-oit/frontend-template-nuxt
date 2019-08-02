import { mount, createLocalVue } from '@vue/test-utils'
import layout from '~/layouts/error.vue'

const localVue = createLocalVue()

describe('layouts/error', () => {
  test('exists', () => {
    const wrapper = mount(layout, {
      localVue,
      propsData: { error: { message: 'An error occurred' } },
      stubs: ['nuxt-link']
    })

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toContain('An error occurred')
  })
})
