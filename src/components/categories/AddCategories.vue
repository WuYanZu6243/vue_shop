<template>
    <el-dialog
    width="30%"
    title="添加分类"
    :visible.sync="dialogVisibleCopy"
    :before-close="handleClose">
        <!-- 添加表单内容 -->
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="80px">
            <!-- 输入框 -->
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <!-- Cascader 级联选择器 -->
            <el-form-item label="父级分类">
                <el-cascader
                v-model="addCateKey"
                :options="OneTwoCate"
                :props="{value:'cat_id',label:'cat_name',children:'children',
                expandTrigger: 'hover'}"
                change-on-select
                clearable
                @change="handleChange"
                >
                </el-cascader>
            </el-form-item>
        </el-form>
        <!-- 提交按钮 -->
        <span slot="footer">
            <el-button type="primary" @click="addCateBtn">提 交</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name:'AddCategories',
    props:['addCategoriesDialogVisible','OneTwoCate'],
    // 数据
    data() {
        return {
            // 添加分类的请求参数
            addCateForm:{
                cat_pid:'0', //父类id
                cat_name:'', // 分类名
                cat_level:'0'// 分类层次
            },
            // 添加分类的验证规则
            addCateRules:{
                cat_name:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ]
            },
            // Cascader 级联选择器 选择的父级id数据
            addCateKey:[]
        }
    },
    // 计算属性
    computed:{
        // 控制添加用户对话框的出现和隐藏的属性的替身
        dialogVisibleCopy:{
            get(){
                return this.addCategoriesDialogVisible
            },
            set(){
                // 进入到这里说明对话框正在关闭
                // 调用父组件传过来的自定义事件
                this.$emit('addCategoriesDialogOff')
                // 重置表单或移除检验结果
                this.$refs.addCateFormRef.resetFields()
                // 清空 Cascader 级联选择器 内容
                this.addCateKey = []
                // 重置 添加分类的请求参数
                this.addCateForm={
                cat_pid:'0', //父类id
                cat_name:'', // 分类名
                cat_level:'0'// 分类层次
                }
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
        // Cascader 级联选择器 值发送改变时
        handleChange(){
            // 更新 添加分类的请求参数
            this.addCateForm.cat_pid = this.addCateKey[this.addCateKey.length-1] || 0
            this.addCateForm.cat_level = this.addCateKey.length
        },
        // 点击了提交按钮，发送请求去添加数据
        addCateBtn(){
            // 验证当前所有输入框的验证是否全部通过
            this.$refs.addCateFormRef.validate(async boolean=>{
                // 验证未通过
                if(!boolean) return;
                // 验证已经通过，发送请求去添加数据
                const {data:res} = await this.$http.post('categories',this.addCateForm)
                // 请求失败
                if(res.meta.status !== 201) return this.$message.error('添加分类失败')
                // 请求成功
                this.$message.success('添加分类成功')
                // 关闭对画框
                this.dialogVisibleCopy = false
            })
        }
    },
}
</script>
    
<style lang="less" scoped>

</style>