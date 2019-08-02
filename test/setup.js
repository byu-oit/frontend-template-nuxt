import 'babel-polyfill'
import Vue from 'vue'

// Ignore all Vuetify elements.
Vue.config.ignoredElements = [
  /v-.*/
]

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
