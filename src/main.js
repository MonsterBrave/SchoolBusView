//import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import BaiduMap from 'vue-baidu-map-3x'
import AMapLoader from '@amap/amap-jsapi-loader'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcon from '@element-plus/icons-vue'

const app = createApp(App)

app.use(BaiduMap, {
    ak: '6jmJh4quRxpIBkynudWdUx551Z7gFSyi',
    // gaode_key:6fbe6dddb287385c207978a1d1ae7886
    //type: 'WebGL'
    //ak: 'sajjn6fwYGZnM2vEh5X0xVrG359orZFC'
})
Object.keys(ElIcon).forEach((key) => {
    app.component(key, ElIcon[key])
})
  
app.use(ElementPlus)

app.use(router)

app.mount('#app')