import { Context } from '@nuxt/types'

export default (context: Context) => {
  if (!context.env.appDynamicsKey) {
    // No key available, so skip App Dynamics setup
    return
  }

  Object.assign(window, {
    'adrum-start-time': new Date().getTime(),
    'adrum-config': {
      appKey: context.env.appDynamicsKey,
      adrumExtUrlHttp: 'http://cdn.appdynamics.com',
      adrumExtUrlHttps: 'https://cdn.appdynamics.com',
      beaconUrlHttp: 'http://pdx-col.eum-appdynamics.com',
      beaconUrlHttps: 'https://pdx-col.eum-appdynamics.com',
      useHTTPSAlways: true,
      xd: { enable: false }
    }
  })

  const script = document.createElement('script')
  script.src = '//cdn.appdynamics.com/adrum/adrum-latest.js'
  document.body.appendChild(script)
}
