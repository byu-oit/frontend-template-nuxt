import * as implicit from 'https://cdn.byu.edu/browser-oauth-implicit/latest/implicit-grant.min.js'

fetch('/config.json')
  .then(response => response.json())
  .then(config => implicit.configure(config))
