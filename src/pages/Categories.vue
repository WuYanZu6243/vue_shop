<template>
    <div class="categories-container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-button type="primary" class="addBtn" @click="addCategoriesBtn">添加分类</el-button>
            <!-- 列表 -->
            <tree-table
            :data="catelist"
            :columns="columns"
            :selection-type='false'
            :expand-type='false'
            show-index index-text='#' class="tree-table"
            :show-row-hover='false'
            border>
                <!-- 第二列:‘是否有效列’ -->
                <template slot="isValid" slot-scope="scope">
                    <i class="el-icon-success" v-if="!scope.row.cat_deleted"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <!-- 第三列:‘排序’ -->
                <template slot="sort" slot-scope="scope">
                    <el-tag v-if='scope.row.cat_level===0'>一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
                <!-- 第四列:‘操作’ -->
                <template slot="operate" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle 
                    @click="upCate(scope.row.cat_id)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle
                    @click="deleteCate(scope.row.cat_id)"></el-button>
                </template>
            </tree-table>
            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
            :current-page="querInfo.pagenum" :page-sizes="[2,4,6]" :page-size="querInfo.pagesize" 
            layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类 -->
        <AddCategories :addCategoriesDialogVisible="addCategoriesDialogVisible" 
        @addCategoriesDialogOff="addCategoriesDialogOff" :OneTwoCate='OneTwoCate'/>
        <!-- 修改分类对话框 -->
        <el-dialog
        title="修改角色"
        :visible.sync="upCateVisible"
        width="40%"
        :before-close="upCateHandleClose"
        @close='offUpCate'>
            <!-- 修改表单内容 -->
            <el-form :model="upCateForm" :rules="upCateRules" ref="upCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="upCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitUpCateForm">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// 导入子组件
import AddCategories from '../components/categories/AddCategories.vue'

export default {
    name:'Categories',
    components:{AddCategories},
    // 数据
    data() {
        return {
            // 查询条件
            querInfo:{
                type:3,
                pagenum:1,
                pagesize:6
            },
            // 商品分类的数据列表
            catelist:[],
            // 数据总条数
            total:0,
            // 为 tree-table 指定列定义
            columns:[
                // 分类名称列
                {label:'商品分类',prop:'cat_name'},
                {label:'是否有效',type:'template',template:'isValid'},
                {label:'排序',type:'template',template:'sort'},
                {label:'操作',type:'template',template:'operate'},
            ],
            // 控制添加分类对话框的出现和隐藏
            addCategoriesDialogVisible:false,
            // 一级、二级父分类数据
            OneTwoCate:[],
            // 控制修改分类对话框的出现和隐藏
            upCateVisible : false,
            // 修改分类表单
            upCateForm:{
                cat_id:'',
                cat_name:'',
            },
            // 角色表单验证规则
            upCateRules:{
                cat_name:[{ required: true, message: '请输入分类名称', trigger: 'blur' }]
            },
        }
    },
    // 方法
    methods:{
        // 获取所有商品分类数据
        async gitCatelist(){
            const {data:res} = await this.$http.get('categories',{params:this.querInfo})
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('获取商品分类数据失败,请稍后重试')
            // 请求成功
            this.catelist = res.data.result
            this.total = res.data.total
            console.log(this.catelist);
        },
        // 控制每页显示多少条数据
        handleSizeChange(val){
            this.querInfo.pagesize = val
            // 重新发送请求获取用户列表数据
            this.gitCatelist()
        },
        // 控制当前页的页码
        handleCurrentChange(val){
            this.querInfo.pagenum = val
            // 重新发送请求获取用户列表数据
            this.gitCatelist()
        },
        // 给子组件绑定自定义事件的回调(添加分类组件有关)
        addCategoriesDialogOff(){
            this.addCategoriesDialogVisible = false
            // 重新获取数据
            this.gitCatelist()
        },
        // 点击了添加按钮(添加分类功能)
        addCategoriesBtn(){
            // 
            this.getOneTwoCate()
            this.addCategoriesDialogVisible = true
        },
        // 获取所有的一级、二级父分类
        async getOneTwoCate(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('获取一级、二级分类失败，请稍后重试')
            // 请求成功
            this.OneTwoCate = res.data
        },
        // 控制对话框，是否确认退出
        upCateHandleClose(done) {this.$confirm('你编辑的内容尚未提交,是否确认退出?').then(
        _ => {done();}).catch(
        _ => {});
        },
        // 点击修改角色按钮，弹出对话框
        async upCate(id){
            // 根据id获取角色数据
            const {data:res} = await this.$http.get(`categories/${id}`)
            // 请求失败
            if(res.meta.status !== 200 ) return this.$message.error(res.meta.msg);
            // 请求成功
            // 将数据赋给表单
            this.upCateForm = res.data
            this.upCateVisible = true
        },
        // 关闭修改分类对话框的回调
        offUpCate(){
        // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        this.$refs.upCateFormRef.resetFields()
        },
        // 提交修改分类对话框
        submitUpCateForm(){
            // 验证当前所有输入框的验证是否全部通过
            this.$refs.upCateFormRef.validate(async boolean=>{
                // 验证未通过
                if(!boolean) return;
                // 验证已经通过，发送请求去添加数据
                const {data:res} = await this.$http.put(`categories/${this.upCateForm.cat_id}`,{
                    cat_name:this.upCateForm.cat_name,
                })
                // 添加失败
                if(res.meta.status !== 200 ) return this.$message.error(res.meta.msg);
                this.$message.success('修改分类成功!')
                this.upCateVisible = false
                // 重新获取数据
                this.gitCatelist()
            })
        },
        // 删除分类
        async deleteCate(id){
        // 提示是否确认删除
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            // 确认删除
            // 发送请求
            const {data:res} = await this.$http.delete(`categories/${id}`)
            // 请求失败
            if(res.meta.status !== 200 ) return this.$message.error(res.meta.msg);
            // 请求成功
            this.$message.success('删除分类成功!')
            // 重新获取数据
            this.gitCatelist()
        }).catch(() => {
            // 取消删除
            return;
        });          
        }
    },
    // 生命周期钩子
    created(){
        // 调用 获取所有商品分类数据 方法
        this.gitCatelist()
    }
}
</script>

<style lang="less" scoped>
// 添加按钮加大
.addBtn {
  width: 100px;
  height: 45px;
  margin-bottom: 15px;
}
.tree-table{
    font-size:14px;
}
.el-icon-success{
    color: lightgreen;
}
.el-icon-error{
    color: red;
}
</style>