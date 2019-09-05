import { ActionTree, MutationTree } from 'vuex'
import { get } from 'lodash'
import { RootState, User } from '~/types'

export const state = (): RootState => ({
  token: '',
  username: '',
  manualRefreshRequired: false,
  refreshBecausePostFailed: false,
  authenticated: false,
  user: {},
  networkErrors: []
})

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
    if (user.name !== undefined) {
      state.username = user.name.displayName
    }
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
