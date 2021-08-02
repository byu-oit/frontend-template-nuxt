const axios = jest.fn((url, config) => {
  const method = config?.method || 'get'
  let data = {}
  let fullUrl = url

  if (config?.data && !config.params) {
    // Translate POST data into URL params, just for testing
    config.params = config.data
  }
  if (config?.params) {
    fullUrl +=
      '?' +
      Object.keys(config.params)
        .map(k => `${k}=${config.params[k]}`)
        .join('&')
  }

  if (fullUrl.includes('FAIL-NO-ERR') || fullUrl.includes('999999999')) {
    // Testing only, so we're passing specific data to rejections
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      response: {
        metadata: {
          validation_response: {
            code: 500,
            message: ''
          }
        }
      }
    })
  } else if (fullUrl.includes('FAIL-ERR')) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      response: {
        data: {
          metadata: {
            validation_response: {
              code: 500,
              message: 'Dummy error.'
            }
          }
        }
      }
    })
  }

  data = testData[method]?.[fullUrl]

  return Promise.resolve({ data })
})

axios.put = jest.fn((url, data) => axios(url, { method: 'put', data }))
axios.post = jest.fn((url, data) => axios(url, { method: 'post', data }))
axios.delete = jest.fn((url, data) => axios(url, { method: 'delete', data }))

axios.$get = jest.fn((url, config) =>
  config ? axios(url, config).then(response => response?.data) : axios(url).then(response => response?.data)
)
axios.$post = jest.fn((url, data) => axios.post(url, data).then(response => response?.data))
axios.$put = jest.fn((url, data) => axios.put(url, data).then(response => response?.data))
axios.$delete = jest.fn((url, data) => axios.delete(url, data).then(response => response?.data))

axios.defaults = {
  headers: {
    common: {
      Authorization: 'dummy'
    }
  }
}

axios.setToken = (newVal) => {
  axios.defaults.headers.common.Authorization = newVal
}

const testData = require('./axiosdata/responses.json')
// merge(testData, require('./axiosdata/otherResponses.json')

export default axios
