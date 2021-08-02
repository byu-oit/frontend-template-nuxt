export * from './state'

export interface UserNameObject {
  displayName?: string
  givenName?: string
}

export interface User {
  email?: string
  byuId?: string
  name?: UserNameObject
  netId?: string
  rawUserInfo?: Record<string, unknown>
}
