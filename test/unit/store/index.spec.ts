import { createLocalVue } from '@vue/test-utils'
import Vuex, { Store } from 'vuex'
import { cloneDeep } from 'lodash'
import { RootState, User } from '~/types'
import * as index from '~/store/index'

const dummyUser: User = {
  email: 'test@test.com',
  byuId: '123-456-7890',
  name: {
    displayName: 'Dummy User'
  }
}

const namelessUser: User = {
  email: 'noname@test.com',
  byuId: '999-999-9999'
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

  test('mutations/authenticate', () => {
    expect(store.state.user).toEqual({})
    expect(store.getters.username).toEqual('')

    store.commit('authenticate', dummyUser)

    expect(store.state.user).toEqual(dummyUser)
    expect(store.getters.username).toEqual(dummyUser.name!.displayName)
  })

  test('mutations/authenticate without username', () => {
    store.commit('authenticate', namelessUser)

    expect(store.state.user).toEqual(namelessUser)
    expect(store.getters.username).toEqual('')
  })

  test('actions/authenticate', async () => {
    await store.dispatch('authenticate', dummyUser)

    expect(store.state.authenticated).toBe(true)
    expect(store.state.user).toEqual(dummyUser)
    expect(store.getters.username).toEqual(dummyUser.name!.displayName)
  })
})
