export * from './state'

export interface User {
  email?: string
  byuId?: string
  name?: UserNameObject
  rawUserInfo?: any
}

export interface UserNameObject {
  displayName?: string
  givenName?: string
}
