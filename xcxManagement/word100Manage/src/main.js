import Vue from 'vue';
import router from './router';
import axios from 'axios';
import lodash from 'lodash'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import App from './App';
Vue.use(ElementUI);

Vue.prototype._=lodash;

Vue.prototype.$axios = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');


