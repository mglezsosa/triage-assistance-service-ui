import 'typeface-inter'
import 'ionicons/dist/css/ionicons.min.css'
import 'vue-select/dist/vue-select.css'
import Vue from 'vue'
import App from './App'
import Vuelidate from "vuelidate";

import router from "./_helpers/router"

Vue.config.productionTip = false
Vue.use(Vuelidate)

// setup fake backend
import { configureFakeBackend } from "./_helpers/fake-backend";
configureFakeBackend();


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
