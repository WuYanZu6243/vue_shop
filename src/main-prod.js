import Vue from 'vue'
import App from './App.vue'

// 导入全局css样式
import './assets/css/global.css'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入路由器
import router from './router'

// 导入树形导航表格插件 vue-table-with-tree-grid
import treeTable from 'vue-table-with-tree-grid'
// 全局注册使用树形导航表格插件
Vue.component('tree-table',treeTable)

// 导入进度条包对应的js和css
import Nprogress from 'nprogress'

// 导入axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://182.61.30.46:8889/api/private/v1/' 
// 设置请求拦截器
axios.interceptors.request.use(config=>{
  // 展示进度条
  Nprogress.start()
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 设置响应拦截器
axios.interceptors.response.use(config=>{
  // 隐藏进度条
  Nprogress.done()
  return config
})
// 把axios挂到Vue原型上，让大家都能访问到
Vue.prototype.$http = axios

// 定义一个格式化时间的过滤器
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

// 简单粗暴式控制屏幕缩放
document.body.style.zoom = document.body.clientWidth / 1600

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 让vm和所有的vc能访问到路由器
  router,
}).$mount('#app')
