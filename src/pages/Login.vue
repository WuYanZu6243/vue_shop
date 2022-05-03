<template>
  <div class="login-container">
    <!-- 登录框 -->
    <div class="login-box">
      <!-- 登录框的标题部分 -->
      <div class="login-headline">登录</div>
      <!-- 登录框的内容部分 -->
      <div class="login-content">
        <!-- 表单 -->
        <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef"
        label-width="65px">
            <!-- 用户名输入框 -->
            <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <!-- 密码输入框 -->
            <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password"></el-input>
            </el-form-item>
            <!-- 按钮组 -->
            <el-form-item class="login-btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "Login",
    // 数据
    data() {
        return {
            // 登录表单数据
            loginForm:{
                username:'admin',
                password:''
            },
            // 登录表单的验证规则
            loginRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    // 方法
    methods:{
        // 重置表单数据和移除校验结果
        resetLoginForm(){
          this.$refs.loginFormRef.resetFields()
        },
        // 点击登录
        login(){
          // 判断当前是否通过验证规则
          this.$refs.loginFormRef.validate(async boolean=>{
            // 验证未通过
            if(!boolean) return;
            // 验证已通过，发送请求验证用户名、密码
            const {data:res} = await this.$http.post('login',this.loginForm)
            // 验证不通过，错误提示
            if(res.meta.status !== 200) return this.$message.error('用户名或密码错误!')
            // 验证通过，正确提示
            this.$message.success('登录成功!')
            // 将返回的数据中token保存到浏览器缓存sessionStorage中
            window.sessionStorage.setItem('token',res.data.token)
            // 编程式跳转到主页路由
            this.$router.push('/home')
          })
        }
    }
};
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background: url("../assets/img/background.jpg") center / 100%;
  position: relative;
  // 登录框
  .login-box {
    width: 500px;
    height: 280px;
    background-color: #303133;
    box-shadow: 5px 5px 10px #ccc;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // 登录框里面的上半部分:标题
    .login-headline {
      height: 15%;
      font-size: 20px;
      color: #fff;
      text-shadow: 1px 1px 2px #fff;
      box-sizing: border-box;
      padding: 8px 20px;
    }
    // 登录框里面的下半部分:内容
    .login-content {
      height: 85%;
      background-color: #fff;
      box-sizing: border-box;
      padding: 35px;
    }
  }
}
.login-btns{
    display: flex;
    justify-content:flex-end;
}
</style>