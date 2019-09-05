import { createLocalVue, mount } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'
import * as authn from '@byuweb/browser-oauth'
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
const $store = new Store({ state })
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
    expect(wrapper.html()).toContain('Logging in...')
  })

  test('is logged in', () => {
    expect(wrapper.html()).not.toContain('Logging in...')
  })

  test('re-auth popup', async () => {
    const dialog = wrapper.find('.authentication-dialog')

    expect(dialog.html()).toContain('display: none')
    $store.state.manualRefreshRequired = true
    await dialog.vm.$nextTick()
    expect(dialog.html()).not.toContain('display: none')

    const vm: any = wrapper.vm
    vm.popupAuth()

    expect(authn.refresh).toHaveBeenCalledWith('popup')
    expect($store.commit).toHaveBeenCalledWith('clearManualRefresh')
  })

  test('network error', () => {
    const dialog = wrapper.find('.network-errors-dialog')

    expect(dialog.html()).toContain('display: none')
    $store.state.networkErrors.push('Network error occurred!')
    expect(dialog.html()).not.toContain('display: none')
  })

  test('username displayed', () => {
    $store.state.username = 'Dummy User'
    expect(wrapper.html()).toContain('Dummy User')
  })
})
