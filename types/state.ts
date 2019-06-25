import { User } from './index'

export interface RootState {
  token: string
  username: string
  manualRefreshRequired: boolean
  refreshBecausePostFailed: boolean
  authenticated: boolean
  user: User
  networkErrors: string[]
}
