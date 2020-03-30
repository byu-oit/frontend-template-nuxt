const pkg = require('./package')

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    script: [
      {
        // PRD App Dynamics Integration
        charset: 'UTF-8',
        innerHTML:
          'if(!window.location.hostname.includes("localhost") && !window.location.hostname.includes("-dev")) {' + // Use AppDynamics if not localhost and dev.
          'window["adrum-start-time"] = new Date().getTime();\n' +
          '(function(config){\n' +
          '    config.appKey = "";\n' + // TODO: Put app key in double quotes
          '    config.adrumExtUrlHttp = "http://cdn.appdynamics.com";\n' +
          '    config.adrumExtUrlHttps = "https://cdn.appdynamics.com";\n' +
          '    config.beaconUrlHttp = "http://pdx-col.eum-appdynamics.com";\n' +
          '    config.beaconUrlHttps = "https://pdx-col.eum-appdynamics.com";\n' +
          '    config.useHTTPSAlways = true;\n' +
          '    config.xd = {enable : false};\n' +
          '})(window["adrum-config"] || (window["adrum-config"] = {}));\n' +
          '}'
      },
      // { // DEV App Dynamics Integration
      //   charset: 'UTF-8',
      //   innerHTML: 'if(window.location.hostname.includes("-dev") && !window.location.hostname.includes("localhost")) {' +
      //     'window["adrum-start-time"] = new Date().getTime();\n' +
      //     '(function(config){\n' +
      //     '    config.appKey = "";\n' + // TODO: Put app key in double quotes
      //     '    config.adrumExtUrlHttp = "http://cdn.appdynamics.com";\n' +
      //     '    config.adrumExtUrlHttps = "https://cdn.appdynamics.com";\n' +
      //     '    config.beaconUrlHttp = "http://pdx-col.eum-appdynamics.com";\n' +
      //     '    config.beaconUrlHttps = "https://pdx-col.eum-appdynamics.com";\n' +
      //     '    config.useHTTPSAlways = true;\n' +
      //     '    config.xd = {enable : false};\n' +
      //     '})(window["adrum-config"] || (window["adrum-config"] = {}));\n' +
      //     '}'
      // },
      {
        src: '//cdn.appdynamics.com/adrum/adrum-4.5.16.2845.js'
      },
      {
        src: 'https://cdn.byu.edu/byu-theme-components/2.x.x/byu-theme-components.min.js',
        async: ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.byu.edu/byu-theme-components/2.x.x/byu-theme-components.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.byu.edu/theme-fonts/1.x.x/ringside/fonts.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.byu.edu/theme-fonts/1.x.x/public-sans/fonts.css'
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#002E5D' },
  /*
   ** Global CSS
   */
  css: ['@/assets/style/app.sass'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/axios', { src: '~/plugins/implicit-grant', ssr: false }, '~/plugins/byucomponents'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    'vuetify-dialog/nuxt'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: '#002E5D',
          secondary: '#666666',
          accent: '#0062B8',
          error: '#A3082A',
          info: '#006073',
          success: '#10A170',
          warning: '#FFB700'
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // eslint-disable-next-line
    extend (config, { isDev, isClient }) {
      if (isDev) {
        config.devtool = isClient ? 'source-map' : 'inline-source-map'
      }
    }
  },
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify']
}
