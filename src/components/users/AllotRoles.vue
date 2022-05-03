<template>
    <el-dialog
    width="30%"
    title="分配角色"
    :visible.sync="dialogVisibleCopy"
    :before-close="handleClose">
        <p>当前用户 : {{allotRolesUser.username}}</p>
        <p>当前的角色 : {{allotRolesUser.role_name}}</p>
        <p>
            <span>分配新角色 : </span>
            <el-select v-model="newRoles" placeholder="请选择">
                <el-option
                v-for="item in allRoles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
                </el-option>
            </el-select>
        </p>
        <!-- 提交按钮 -->
        <span slot="footer">
            <el-button type="primary" @click="submitAllot">提 交</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name:'AllotRoles',
    props:['allotRolesDialogVisible','allRoles','allotRolesUser'],
    // 数据
    data() {
        return {
            // 新角色
            newRoles:''
        }
    },
    // 计算属性
    computed:{
        // 控制分配权限对话框的出现和隐藏的属性的替身
        dialogVisibleCopy:{
            get(){
                return this.allotRolesDialogVisible
            },
            set(){
                // 进入到这里说明对话框正在关闭
                // 调用父组件传过来的自定义事件
                this.$emit('allotRolesDialogOff')
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
        // 点击提交分配角色
        async submitAllot(){
            // 判断用户有没有选择
            if(!this.newRoles) return this.$message('请选择需要分配的角色')
            // 发送请求去分配角色
            const {data:res} = await this.$http.put(`users/${this.allotRolesUser.id}/role`,{rid:this.newRoles})
            // 请求失败
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            // 请求成功
            this.$message.success('设置成功')
            // 关闭对话框
            this.dialogVisibleCopy = false
        }
    }
}
</script>

<style lang="less" scoped>
.el-dialog p{
    font-size: 16px;
}
</style>