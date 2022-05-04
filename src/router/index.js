// 项目唯一的路由器

// 导入vue
import Vue from 'vue'

// 导入路由插件 vue-router
import VueRouter from 'vue-router'
// 注册路由插件
Vue.use(VueRouter)

// 导入路由组件
const Login = () => import('../pages/Login.vue')
const Home = () => import('../pages/Home.vue')
const Users = () => import('../pages/Users.vue')
const Rights = () => import('../pages/Rights.vue')
const Roles = () => import('../pages/Roles.vue')
const Categories = () => import('../pages/Categories.vue')
const Params = () => import('../pages/Params.vue')
const Goods = () => import('../pages/Goods.vue')
const AddGoods = () => import('../pages/AddGoods.vue')
const Orders = () => import('../pages/Orders.vue')
const Report = () => import('../pages/Report.vue')

// 创建路由器
const router = new VueRouter({
    routes:[
        // 当访问根路径'/'时，设置自动跳转到登录页面
        {
            path:'/',
            redirect:'/login'
        },
        // login路由
        {
            name:'login',
            path:'/login',
            component:Login
        },
        // home路由
        {
            name:'home',
            path:'/home',
            component:Home,
            redirect:'/home/users',
            children:[
                // 用户组件
                {
                    name:'users',
                    path:'users',
                    component:Users
                },
                // 权限列表组件
                {
                    name:'rights',
                    path:'rights',
                    component:Rights
                },
                // 角色管理组件
                {
                    name:'roles',
                    path:'roles',
                    component:Roles
                },
                // 商品分类组件
                {
                    name:'categories',
                    path:'categories',
                    component:Categories
                },
                // 分类参数组件
                {
                    name:'params',
                    path:'params',
                    component:Params
                },
                // 商品列表组件
                {
                    name:'goods',
                    path:'goods',
                    component:Goods,
                },
                // 添加商品组件
                {
                    name:'addGoods',
                    path:'goods/addGoods',
                    component:AddGoods   
                },
                // 订单列表
                {
                    name:'orders',
                    path:'orders',
                    component:Orders
                },
                // 数据报表
                {
                    name:'reports',
                    path:'reports',
                    component:Report
                }
            ]
        }
    ]
})

// 前置路由守卫
router.beforeEach((to,from,next)=>{
    // 防止用户未登录就访问其它页面(检测浏览器缓存中有没有token)
    // 如果用户访问的是登录页面，直接方法
    if(to.fullPath === '/login') return next();
    // 用户还没登录，把它重定向回登录页面(token为空)
    const token = window.sessionStorage.getItem('token');
    if(!token) return next('/login');
    // 用户已经登录，放行
    next()
})

// 暴露路由器
export default router