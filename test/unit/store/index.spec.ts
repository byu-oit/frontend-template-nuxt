import { createLocalVue } from '@vue/test-utils'
import Vuex, { Store } from 'vuex'
import { cloneDeep } from 'lodash'
import { RootState } from '~/types'
import * as index from '~/store/index'

const dummyUser = {
  email: 'test@test.com',
  byuId: '123-456-7890',
  name: {
    displayName: 'Dummy User'
  }
}

const localVue = createLocalVue()
localVue.use(Vuex)

let store: Store<RootState>

beforeEach(() => {
  store = new Vuex.Store(cloneDeep(index))
})

describe('store/index', () => {
  test('mutations/setToken', () => {
    expect(store.state.token).toEqual('')

    store.commit('setToken', 'foo')

    expect(store.state.token).toEqual('foo')
  })

  test('mutations/needManualRefresh', () => {
    expect(store.state.manualRefreshRequired).toBe(false)
    expect(store.state.refreshBecausePostFailed).toBe(false)

    store.commit('needManualRefresh', true)

    expect(store.state.manualRefreshRequired).toBe(true)
    expect(store.state.refreshBecausePostFailed).toBe(true)
  })

  test('mutations/authenticate', () => {
    expect(store.state.user).toEqual({})
    expect(store.state.username).toEqual('')

    store.commit('authenticate', dummyUser)

    expect(store.state.user).toEqual(dummyUser)
    expect(store.state.username).toEqual(dummyUser.name.displayName)
  })

  test('mutations/addNetworkError', () => {
    expect(store.state.networkErrors).toEqual([])

    store.commit('addNetworkError')

    expect(store.state.networkErrors).toEqual(['Unknown Error'])

    store.commit('addNetworkError', {
      response: { data: { readable_message: 'Testing Message' } }
    })

    expect(store.state.networkErrors.length).toBe(2)
    expect(store.state.networkErrors[1]).toEqual('Testing Message')

    store.commit('addNetworkError')

    // Do not duplicate existing "Unknown Error" message
    expect(store.state.networkErrors.length).toBe(2)
  })

  test('mutations/clearNetworkErrors', () => {
    store.commit('addNetworkError')
    store.commit('clearNetworkErrors')

    expect(store.state.networkErrors).toEqual([])
  })

  test('mutations/clearManualRefresh', () => {
    store.commit('clearManualRefresh')

    expect(store.state.manualRefreshRequired).toBe(false)
  })

  test('actions/authenticate', async () => {
    await store.dispatch('authenticate', dummyUser)

    expect(store.state.authenticated).toBe(true)
    expect(store.state.user).toEqual(dummyUser)
    expect(store.state.username).toEqual(dummyUser.name.displayName)
  })

  test('actions/clearNetworkErrors', async () => {
    await store.dispatch('clearNetworkErrors')

    expect(store.state.networkErrors).toEqual([])
  })
})
