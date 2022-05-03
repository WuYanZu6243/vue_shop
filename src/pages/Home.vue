<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
        <Header/>
    </el-header>
    <!-- 中部 -->
    <el-container>
        <!-- 左侧导航区 -->
        <el-aside :width="isFold? '64px' : '200px'">
            <Aside :isFold="isFold"/>
            <!-- 控制是否折叠的按钮 -->
            <el-button type="info" :icon="isFold? 'el-icon-right' : 'el-icon-back'" circle 
            size="mini" class="foldBtn" @click="asideFold"></el-button>
        </el-aside>
        <!-- 右侧内容区 -->
        <el-main>
            <!-- 组将渲染的位置 -->
            <router-view></router-view>
        </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 导入一般子组件
import Header from '../components/Header.vue'
import Aside from '../components/Aside.vue'

export default {
    name: "Home",
    // 注册子组件
    components:{Header,Aside},
    // 数据
    data() {
        return {
            // 控制左侧菜单是否折叠
            isFold:false
        }
    },
    // 方法
    methods:{
        // 控制左侧菜单是否折叠
        asideFold(){
            this.isFold = !this.isFold
        }
    }
};
</script>

<style lang="less" scoped>
    .home-container{
        height: 100%;
        .el-header{
            height: 9% !important;
            background-color: #303133;
        }
        .el-container{
            height: 91%;
            .el-aside{
                background-color:#3A4144;
                position: relative;
            }
            .el-main{
                background-color: #E4E7ED;
                overflow: auto;
            }
        }
    }
    // 控制左侧菜单是否折叠
    .foldBtn{
        position: absolute;
        bottom: 10px;
        right: 10px;
    }
</style>