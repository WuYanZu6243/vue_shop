<template>
    <el-dialog
    width="40%"
    title="分配权限"
    :before-close="handleClose"
    :visible.sync="dialogVisibleCopy">
        <!-- 数型结构 -->
        <el-tree :data="allRights" :props="defaultProps" default-expand-all 
        show-checkbox node-key="id" :default-checked-keys="haveThreeRights"
        ref="rightsTreeRef"></el-tree>
        <!-- 提交按钮 -->
        <span slot="footer">
            <el-button type="primary" @click="updateRights">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name:'AllotRights',
    props:['allotDialogVisible','allRights','haveThreeRights','roleId'],
    // 数据
    data() {
        return {
            // 属性控件的属性绑定对象
            defaultProps:{
                label:'authName',
                children:'children'
            },
        }
    },
    // 计算属性
    computed:{
        // 控制对话框的展示与隐藏
        dialogVisibleCopy:{
            get(){
                return this.allotDialogVisible
            },
            set(){
                // 调用父组件绑定的自定义事件，告诉它这个时候要关闭会话框了
                this.$emit('allotDialogOff')
            }
        }
    },
    // 方法
    methods:{
        // 控制分配权限对话框，是否确认退出
        handleClose(done) {this.$confirm('你编辑的内容尚未提交,是否确认退出?').then(
        _ => {done();}).catch(
        _ => {});
        },
        // 点击提交按钮，更新权限信息
        async updateRights(){
            // 获取到当前数型结构中所有被勾选的权限的id
            const keys = [
                // 全勾选的权限
                ...this.$refs.rightsTreeRef.getCheckedKeys(),
                // 帮勾选的权限
                ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
            ]
            // 将这些id拼接成字符串
            const keysStr = keys.join(',')
            // 发送请求去更新权限信息
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:keysStr})
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('权限更新失败,请重试')
            // 请求成功
            this.$message.success('权限更新成功')
            // 关闭对话框
            this.dialogVisibleCopy = false
        }
    }
}
</script>

<style>

</style>