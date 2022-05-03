<template>
    <el-dialog
    width="40%"
    title="添加用户"
    :visible.sync="dialogVisibleCopy"
    :before-close="handleClose">
        <!-- 添加表单内容 -->
        <el-form :model="addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addUserForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addUserForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addUserForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
                <el-input v-model="addUserForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <!-- 提交按钮 -->
        <span slot="footer">
            <el-button type="primary" @click="submitAddUserForm">提 交</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name:'AddUser',
    // 接收父组件的传参
    props:['addUserDialogVisible',],
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
            // 添加用户表单数据收集
            addUserForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            // 添加用户表单验证规则
            addUserRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
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
                return this.addUserDialogVisible
            },
            set(){
                // 进入到这里说明对话框正在关闭
                // 调用父组件传过来的自定义事件
                this.$emit('addUserDialogOff')
                // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
                this.$refs.addUserFormRef.resetFields()
            }
        }
    },
    // 方法
    methods: {
        // 控制添加用户对话框，是否确认退出
        handleClose(done) {this.$confirm('你编辑的内容尚未提交,是否确认退出?').then(
        _ => {done();}).catch(
        _ => {});
        },
        // 点击确定按钮，准备提交
        submitAddUserForm(){
            // 验证当前所有输入框的验证是否全部通过
            this.$refs.addUserFormRef.validate(async boolean=>{
                // 验证未通过
                if(!boolean) return;
                // 验证已经通过，发送请求去添加数据
                const {data:res} = await this.$http.post('users',this.addUserForm)
                // 添加失败
                if(res.meta.status !== 201 ) return this.$message.error(res.meta.msg);
                // 添加成功：提示、关闭对话框(改变了计算属性的结构，会调用set里里面的set方法，进而
                // 触发父组件的自定义事件，更新数据)
                this.$message.success('添加成功!')
                this.dialogVisibleCopy = false
            })
        }
    },
}
</script>

<style>
</style>