<template>
  <!-- 头部 -->
  <div class="header-container">
    <!-- 文章的logo和标题 -->
    <div class="logo">
      <img src="https://cdn.jsdelivr.net/gh/WuYanZu6243/figureBed/imglogo.png" alt="" />
      <span>电商后台管理系统</span>
    </div>
    <!-- 退出按钮 -->
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
    name: "Header",
    // 方法
    methods:{
        // 退出功能
        logout(){
            // 把登录时往浏览器缓存的sessionStorage清空
            window.sessionStorage.clear()
            // 重定向回登录页面
            this.$router.push('/login')
        }
    }
};
</script>

<style lang="less" scoped>
    .header-container {
        height: 100%;
        display: flex;
        justify-content:space-between;
        align-items:center;
        .logo {
            color: #fff;
            font-size: 25px;
            display: flex;
            align-items:center;
            img {
                width: 50px;
                height: 50px;
                margin-right:10px;
            }
        }
        .el-button{
            height: 40px;
        }
    }
</style>