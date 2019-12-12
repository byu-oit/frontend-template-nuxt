import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { get } from 'lodash'
import { RootState, User } from '~/types'

export const state = (): RootState => ({
  token: '',
  manualRefreshRequired: false,
  refreshBecausePostFailed: false,
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
  needManualRefresh(state, postFailed: boolean) {
    state.manualRefreshRequired = true
    state.refreshBecausePostFailed = postFailed
  },
  authenticate(state, user: User) {
    state.authenticated = true
    state.user = user
  },
  clearManualRefresh(state) {
    state.manualRefreshRequired = false
  }
}

export const actions: ActionTree<RootState, RootState> = {
  authenticate({ commit }, user: User) {
    commit('authenticate', user)
  }
}
