<template>
    <!-- 左侧导航区 -->
    <el-menu background-color="#3A4144" text-color="#fff" unique-opened 
    :collapse='isFold' :collapse-transition='false' router :default-active='activeIndex'>
        <!-- 一级导航 -->
        <el-submenu :index="m.id+''" v-for="m in menus" :key="m.id">
            <!-- 一级导航的图标和文本 -->
            <template slot="title">
                <i :class="menusIcon[m.id]"></i>
                <span>{{m.authName}}</span>
            </template>
            <!-- 二级导航 -->
            <el-menu-item :index="'/home/'+item.path" 
            v-for="item in m.children" :key="item.id"
            @click="rdActiveIndex(item.path)">
                <!-- 二级导航的图标和文本 -->
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{item.authName}}</span>
                </template>
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
export default {
    name: "Aside",
    // 接收父组件的传参
    props:['isFold'],
    // 数据
    data() {
        return {
            // 菜单
            menus:[],
            // 一级导航的字体图标
            menusIcon:{
                '125': 'iconfont icon-haoyou',
                '103': 'iconfont icon-quanxian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-dingdan',
                '145': 'iconfont icon-shujutongji'
            },
            // 记录当前在什么路由下，让左侧该菜单项高亮
            activeIndex:window.sessionStorage.getItem('active') || '/home/users'
        }
    },
    // 方法
    methods:{
        // 发送请求获取导航区数据
        async getMenus(){
            const {data:res} = await this.$http.get('/menus')
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('请求数据失败，请稍后重试！')
            // 请求成功
            this.menus = res.data
        },
        // 记录用户点击的路由，让左侧该菜单项高亮
        rdActiveIndex(path){
            this.activeIndex = '/home/'+path
            window.sessionStorage.setItem('active','/home/'+path)
        }
    },
    // 生命周期钩子:数据代理完成
    created(){
        // 调用方法，发送请求获取导航区数据
        this.getMenus()
    }
};
</script>

<style lang="less" scoped>
    .el-menu{
        border: 0;
        position: relative;
    }
    .iconfont{
        margin-right:10px;
    }
</style>