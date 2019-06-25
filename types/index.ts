export * from './state'

export interface User {
  emailSearched?: boolean
  email?: string
  byuId?: string
  name?: UserNameObject
}

export interface UserNameObject {
  displayName: string
}
