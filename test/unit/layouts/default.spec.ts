import { createLocalVue, mount } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'
import Vue from 'vue'
import Vuetify from 'vuetify'
import { state as indexState } from '~/store/index'
import layout from '~/layouts/default.vue'

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
const wrap = () =>
  mount(layout, {
    mocks,
    stubs,
    localVue,
    vuetify
  })
const wrapper = wrap()

afterEach(() => $store.reset())

describe('layouts/default', () => {
  test('exists', () => {
    $store.state.authenticated = false
    const wrapper = wrap()
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toContain('Loading')
  })

  test('is logged in', () => {
    expect(wrapper.html()).not.toContain('Logging in...')
  })

  test('username displayed', () => {
    expect(wrapper.html()).toContain('Dummy User')
  })
})
