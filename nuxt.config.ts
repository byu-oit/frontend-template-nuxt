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
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.byu.edu/byu-theme-components/1.x.x/byu-theme-components.min.css'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.byu.edu/theme-fonts/1.x.x/ringside/fonts.css'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.byu.edu/theme-fonts/1.x.x/public-sans/fonts.css'
      }
    ],
    script: [
      {
        src: 'https://cdn.byu.edu/byu-theme-components/1.x.x/byu-theme-components.min.js',
        async: ''
      },
      {
        src: '/implicit-grant-config.js',
        type: 'module'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#002E5D' },
  /*
   ** Global CSS
   */
  css: [
    '@/assets/style/app.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios',
    { src: '~/plugins/implicit-grant', ssr: false }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/vuetify',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources'
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
      primary: '#002E5D',
      secondary: '#666666',
      accent: '#0062B8',
      error: '#A3082A',
      info: '#006073',
      success: '#10A170',
      warning: '#FFB700'
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
    extend(config, ctx) {}
  }
}
