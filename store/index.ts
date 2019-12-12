import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootState, User } from '~/types'

export const state = (): RootState => ({
  token: '',
  authenticated: false,
  user: {}
})

export const getters: GetterTree<RootState, RootState> = {
  username: state => state.user?.name?.displayName || state.user?.name?.givenName || ''
}

export const mutations: MutationTree<RootState> = {
  setToken(state: RootState, token: string) {
    state.token = token
  },
  authenticate(state, user: User) {
    state.authenticated = true
    state.user = user
  }
}

export const actions: ActionTree<RootState, RootState> = {
  authenticate({ commit }, user: User) {
    commit('authenticate', user)
  }
}
