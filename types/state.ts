import { User } from './index'

export interface RootState {
  token: string
  manualRefreshRequired: boolean
  refreshBecausePostFailed: boolean
  authenticated: boolean
  user: User
}
