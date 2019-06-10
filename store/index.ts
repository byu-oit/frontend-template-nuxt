import { RootState } from '~/types'
import { ActionTree, MutationTree } from 'vuex'

export const state = (): RootState => ({
  token: '',
  username: ''
})

export const mutations: MutationTree<RootState> = {
  setLoggedInUser (state: RootState, username: String) {
    state.username = username
  },
  setToken (state: RootState, token: String) {
    state.token = token
  }
}

export const actions: ActionTree<RootState, RootState> = {}
