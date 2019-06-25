export * from './state'

export interface User {
  email?: string
  byuId?: string
  name?: UserNameObject
}

export interface UserNameObject {
  displayName: string
}
