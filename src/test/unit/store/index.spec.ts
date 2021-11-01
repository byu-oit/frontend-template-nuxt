import { createLocalVue } from '@vue/test-utils'
import cloneDeep from 'lodash/cloneDeep'
import Vuex, { Store } from 'vuex'
import * as index from '~/store/index'
import { objects } from '~/test/helpers'
import { RootState } from '~/types'

const localVue = createLocalVue()
localVue.use(Vuex)

let store: Store<RootState>

describe('store/index', () => {
  beforeEach(() => {
    store = new Store(cloneDeep(index))
  })

  test('mutations/setToken', () => {
    expect(store.state.token).toEqual('')

    store.commit('setToken', 'foo')

    expect(store.state.token).toEqual('foo')
  })

  test('mutations/authenticate', () => {
    expect(store.state.user).toEqual({})
    expect(store.getters.username).toEqual('')

    store.commit('authenticate', objects.user)

    expect(store.state.user).toEqual(objects.user)
    expect(store.getters.username).toEqual(objects.user.name?.displayName)
  })

  test('mutations/authenticate without username', () => {
    store.commit('authenticate', objects.namelessUser)

    expect(store.state.user).toEqual(objects.namelessUser)
    expect(store.getters.username).toEqual('')
  })

  test('actions/authenticate', async () => {
    await store.dispatch('authenticate', objects.user)

    expect(store.state.authenticated).toBe(true)
    expect(store.state.user).toEqual(objects.user)
    expect(store.getters.username).toEqual(objects.user.name?.displayName)
  })
})
