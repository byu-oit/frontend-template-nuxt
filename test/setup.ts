// Vuetify v-dialog looks for a "data-app" div, which doesn't automatically get created when
// running tests, so we manually create it here
const app = document.createElement('div')
app.setAttribute('data-app', 'true')
document.body.appendChild(app)
