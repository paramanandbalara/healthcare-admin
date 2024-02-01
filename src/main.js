/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Axios
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App);

axios.interceptors.request.use(
    request => {
        // console.log(request, 'request')
        return request
    }
)
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        console.log(error,'error')
        return Promise.reject(error)
    }
)

axios.defaults.baseURL = process.env.HOMEOPATHA_API_SERVER;

app.use(VueAxios, axios)

registerPlugins(app)

app.mount('#app')
