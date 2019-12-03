import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { get } from 'lodash'
import { RootState, User } from '~/types'

export const state = (): RootState => ({
  token: '',
  manualRefreshRequired: false,
  refreshBecausePostFailed: false,
  authenticated: false,
  user: {},
  networkErrors: []
})

export const getters: GetterTree<RootState, RootState> = {
  username: state => (state.user && state.user.name && (state.user.name.displayName || state.user.name.givenName)) || ''
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
  addNetworkError(state, error: any) {
    error = error || {}
    const message: string =
      get(error, 'response.data.readable_message') ||
      get(error, 'response.data.metadata.validation_response.message') ||
      get(error, 'response.data.ResolveIdentityService.errors.0.message') ||
      error.message ||
      'Unknown Error'
    if (!state.networkErrors.includes(message)) {
      // Do not duplicate error messages
      state.networkErrors.push(message)
    }
  },
  clearNetworkErrors(state) {
    state.networkErrors = []
  },
  clearManualRefresh(state) {
    state.manualRefreshRequired = false
  }
}

export const actions: ActionTree<RootState, RootState> = {
  authenticate({ commit }, user: User) {
    commit('authenticate', user)
  },
  clearNetworkErrors({ commit }) {
    commit('clearNetworkErrors')
  }
}
