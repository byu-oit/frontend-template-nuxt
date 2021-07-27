import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import { Store } from 'vuex-mock-store'
import layout from '~/layouts/default.vue'
import { state as indexState } from '~/store/index'

const stubs = ['byu-header', 'byu-user-info', 'byu-menu', 'nuxt-link', 'nuxt', 'byu-footer']

const localVue = createLocalVue()
Vue.use(Vuetify)
const state = indexState()
const vuetify = new Vuetify({})
state.authenticated = true
const $store = new Store({ state, getters: { username: 'Dummy User' } })
const mocks = { $store, $nuxt: { $route: { path: '/' } } }

// Need to test different initial conditions in some tests, so
// expose "wrap" as its own function
const wrap = (): Wrapper<Vue> =>
  mount(layout, {
    mocks,
    stubs,
    localVue,
    vuetify
  })
const wrapper = wrap()

describe('layouts/default', () => {
  afterEach(() => $store.reset())

  test('exists', () => {
    $store.state.authenticated = false
    const wrapper = wrap()
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.html()).toContain('Loading')
  })

  test('is logged in', () => {
    expect(wrapper.html()).not.toContain('Logging in...')
  })

  test('username displayed', () => {
    expect(wrapper.html()).toContain('Dummy User')
  })
})
