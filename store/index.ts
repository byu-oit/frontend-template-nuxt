import { RootState, User } from '~/types'
import { ActionTree, MutationTree } from 'vuex'

export const state = (): RootState => ({
  token: '',
  username: '',
  manualRefreshRequired: false,
  refreshBecausePostFailed: false,
  authenticated: false,
  user: { emailSearched: false }
})

export const mutations: MutationTree<RootState> = {
  setToken (state: RootState, token: string) {
    state.token = token
  },
  needManualRefresh (state, postFailed: boolean) {
    state.manualRefreshRequired = true
    state.refreshBecausePostFailed = postFailed
  },
  authenticate (state, user: User) {
    state.authenticated = true
    state.user = user
    if (user.name !== undefined) {
      state.username = user.name.displayName
    }
  }
}

export const actions: ActionTree<RootState, RootState> = {
  authenticate ({ commit }, user: User) {
    commit('authenticate', user)
  }
}
