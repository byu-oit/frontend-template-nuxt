import { createLocalVue, createWrapper, mount } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'
import * as authn from '@byuweb/browser-oauth'
import { state as indexState } from '~/store/index'
import layout from '~/layouts/default.vue'

const stubs = [
  'byu-header',
  'byu-user-info',
  'byu-menu',
  'nuxt-link',
  'nuxt',
  'byu-footer'
]
const localVue = createLocalVue()
const state = indexState()
state.authenticated = true
const $store = new Store({ state })
const mocks = { $store, $nuxt: { $route: { path: '/' } } }

// Need to test different initial conditions in some tests, so
// expose "wrap" as its own function
const wrap = () => mount(layout, {
  mocks,
  stubs,
  localVue,
  computed: {
    username () { return 'Dummy User' }
  }
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
    const dialog = createWrapper(document.body).find('div.v-dialog')

    expect(dialog.html()).toContain('Re-authentication Required')
    expect(dialog.isVisible()).toBe(false)

    $store.state.manualRefreshRequired = true
    await wrapper.vm.$nextTick()

    expect(dialog.isVisible()).toBe(true)

    const vm: any = wrapper.vm
    vm.popupAuth()

    expect(authn.refresh).toHaveBeenCalledWith('popup')
    expect($store.commit).toHaveBeenCalledWith('clearManualRefresh')
  })

  test('network error', () => {
    $store.state.networkErrors.push('Network error occurred!')
    expect(wrapper.find('#single-network-error').isVisible()).toBe(true)
  })

  test('username displayed', () => {
    expect(wrapper.html()).toContain('Dummy User')
  })
})
