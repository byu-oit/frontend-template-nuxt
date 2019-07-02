import { mount } from '~/node_modules/@vue/test-utils'
import index from '~/pages/index.vue'

const stubs = [
  'nuxt-link'
]

const wrap = () => mount(index, { stubs })

const wrapper = wrap()
describe('pages/index', () => {
  test('exists', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
