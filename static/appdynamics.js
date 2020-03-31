const prdAppKey = '' // TODO: Add production AppDynamics app key
const devAppKey = '' // TODO: Add development AppDynamics app key

let appDynamicsInit = false

if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('-dev')) {
  appDynamicsInit = true
  window['adrum-start-time'] = new Date().getTime();
  (function(config) {
    config.appKey = prdAppKey
    config.adrumExtUrlHttp = 'http://cdn.appdynamics.com'
    config.adrumExtUrlHttps = 'https://cdn.appdynamics.com'
    config.beaconUrlHttp = 'http://pdx-col.eum-appdynamics.com'
    config.beaconUrlHttps = 'https://pdx-col.eum-appdynamics.com'
    config.useHTTPSAlways = true
    config.xd = { enable: false }
  })(window['adrum-config'] || (window['adrum-config'] = {}))
}

if (devAppKey !== '' && !window.location.hostname.includes('localhost') && !appDynamicsInit) {
  window['adrum-start-time'] = new Date().getTime();
  (function(config) {
    config.appKey = devAppKey
    config.adrumExtUrlHttp = 'http://cdn.appdynamics.com'
    config.adrumExtUrlHttps = 'https://cdn.appdynamics.com'
    config.beaconUrlHttp = 'http://pdx-col.eum-appdynamics.com'
    config.beaconUrlHttps = 'https://pdx-col.eum-appdynamics.com'
    config.useHTTPSAlways = true
    config.xd = { enable: false }
  })(window['adrum-config'] || (window['adrum-config'] = {}))
}
