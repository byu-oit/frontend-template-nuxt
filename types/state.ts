import { User } from './index'

export interface RootState {
  token: string
  authenticated: boolean
  user: User
}
