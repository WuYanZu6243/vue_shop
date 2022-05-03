<template>
    <el-dialog
    title="修改用户"
    :visible.sync="dialogVisibleCopy"
    width="40%"
    :before-close="handleClose">
        <!-- 修改用户表单内容 -->
        <el-form :model="updateUserData" :rules="updateUserRules" ref="updateUserFormRef" label-width="70px">
            <el-form-item label="用户名">
                <el-input :value="updateUserData.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="updateUserData.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
                <el-input v-model="updateUserData.mobile"></el-input>
            </el-form-item>
        </el-form>
        <!-- 修改用户表单按钮 -->
        <span slot="footer">
            <el-button type="primary" @click="submitUpdateUserForm">修 改</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name:'UpdateUser',
    // 接收父组件的传参
    props:['UpdateUserDialogVisible','updateUserData'],
    // 数据
    data() {
        // 自定义验证规则
        var emailRules = (rule, value, callback) => {
            const emailReg = /^[A-Za-z0-9-._]+@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,6})$/
            if(!emailReg.test(value)){
                return callback(new Error('邮箱地址格式不正确'))
            }else {
      	        callback()
            } 
        }
        var mobileRules = (rule, value, callback) => {
            const emailReg = /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/
            if(!emailReg.test(value)){
                return callback(new Error('手机号码格式不正确'))
            }else {
      	        callback()
            } 
        }
        return {
            // 添加用户表单验证规则
            updateUserRules:{
                email:[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { validator: emailRules, trigger: 'blur' }
                ],
                mobile:[
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: mobileRules, trigger: 'blur' }
                ]
            }
        }
    },
    // 计算属性
    computed:{
        // 控制添加用户对话框的出现和隐藏的属性的替身
        dialogVisibleCopy:{
            get(){
                return this.UpdateUserDialogVisible
            },
            set(){
                // 进入到这里说明对话框正在关闭
                // 调用父组件传过来的自定义事件
                this.$emit('UpdateUserDialogOff')
                // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
                this.$refs.updateUserFormRef.resetFields()
            }
        }
    },
    // 方法
    methods:{
        // 控制添加用户对话框，是否确认退出
        handleClose(done) {this.$confirm('你编辑的内容尚未提交,是否确认退出?').then(
        _ => {done();}).catch(
        _ => {});
        },
        // 点击修改按钮，准备修改数据
        submitUpdateUserForm(){
            // 验证当前所有输入框是否全部通过验证规则
            this.$refs.updateUserFormRef.validate(async boolean=>{
                // 验证未通过
                if(!boolean) return;
                // console.log(boolean);
                // 验证已经通过，发送请求去修改数据
                const {data:res} = await this.$http.put(`users/${this.updateUserData.id}`,{
                    email:this.updateUserData.email,
                    mobile:this.updateUserData.mobile
                })
                console.log(res);
                // 修改失败
                if(res.meta.status !== 200 ) return this.$message.error(res.meta.msg);
                // 修改成功：提示、关闭对话框(改变了计算属性的结构，会调用set里里面的set方法，进而
                // 触发父组件的自定义事件，更新数据)
                this.$message.success('修改成功!')
                this.dialogVisibleCopy = false
            })
        }
    }
}
</script>

<style>

</style>