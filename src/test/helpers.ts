export const data = {
  byuId: '123456789',
  name: 'Dummy User',
  netId: 'testa'
}

export const objects = {
  namelessUser: {
    email: 'noname@test.com',
    byuId: '999-999-9999',
    netId: data.netId
  },
  user: {
    byuId: data.byuId,
    email: 'test@test.com',
    name: {
      displayName: data.name
    },
    roles: []
  }
}
