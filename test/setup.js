import 'babel-polyfill'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify) // Need to add Vuetify to *global* Vue, not localVue, or we get annoying warnings in test output

const app = document.createElement('div')
app.setAttribute('data-app', true)
document.body.appendChild(app)

// Temp workaround for Vuetify/Vue-test-utils bug that's being fixed
const { getComputedStyle } = window
window.getComputedStyle = function getComputedStyleStub (el) {
  return {
    ...getComputedStyle(el),
    getPropertyValue () {},
    transitionDelay: '',
    transitionDuration: '',
    animationDelay: '',
    animationDuration: ''
  }
}
