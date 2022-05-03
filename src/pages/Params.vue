<template>
    <div class="params-container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 警告框 -->
            <el-alert title="注意:只允许为第三级分类设置相关参数" 
            type="warning" show-icon :closable='false'></el-alert>
            <!-- 级联选择器 -->
            <span>请选择商品分类: </span>
            <el-cascader
            v-model="cateKey"
            :options="cateList"
            :props="{value:'cat_id',label:'cat_name',children:'children',
            expandTrigger: 'hover'}"
            clearable
            @change="handleChange">
            </el-cascader>
            <!-- Tabs标签页 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!-- 动态参数 -->
                <el-tab-pane label="动态参数" name="only">
                    <!-- 添加参数按钮 -->
                    <el-button type="primary" 
                    :disabled='cateKey.length === 0 ? true : false'
                    @click="addDialogVisible = true">
                    添加参数
                    </el-button>
                    <!-- 表格 -->
                    <el-table :data="onlyData" border stripe>
                      <!-- 展开列 -->
                      <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 渲染 -->
                                <el-tag
                                v-for="(tag,i) in scope.row.attr_vals"
                                :key="i"
                                closable
                                :type="tag.type"
                                @close="handleClose(i,scope.row)">
                                {{tag}}
                                </el-tag>
                                <!-- 添加 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                      </el-table-column>
                      <el-table-column type="index" label="#"></el-table-column>
                      <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <!-- 修改 -->
                          <el-button type="primary" icon="el-icon-edit" circle
                          @click="upParams(scope.row)"></el-button>
                          <!-- 删除 -->
                          <el-button type="danger" icon="el-icon-delete" circle
                          @click="deleteParams(scope.row)"></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 静态属性 -->
                <el-tab-pane label="静态属性" name="many">
                    <!-- 添加属性按钮 -->
                    <el-button type="primary" 
                    :disabled='cateKey.length === 0 ? true : false'
                    @click="addDialogVisible = true">
                    添加属性
                    </el-button>
                    <!-- 表格 -->
                    <el-table :data="manyData" border stripe>
                        <!-- 展开列 -->
                        <!-- 展开列 -->
                      <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 渲染 -->
                                <el-tag
                                v-for="(tag,i) in scope.row.attr_vals"
                                :key="i"
                                closable
                                :type="tag.type"
                                @close="handleClose(i,scope.row)">
                                {{tag}}
                                </el-tag>
                                <!-- 添加 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                      </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                        <el-table-column label="操作">
                          <template slot-scope="scope">
                            <!-- 修改 -->
                            <el-button type="primary" icon="el-icon-edit" circle
                            @click='upParams(scope.row)'></el-button>
                            <!-- 删除 -->
                            <el-button type="danger" icon="el-icon-delete" circle
                            @click="deleteParams(scope.row)"></el-button>
                          </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数/属性对话框 -->
        <el-dialog
        :title="'添加' + titleTxt"
        :visible.sync="addDialogVisible"
        width="40%"
        :before-close="addHandleClose">
            <!-- 添加表单内容 -->
            <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
                <el-form-item :label="titleTxt" prop="parameterOrProperty">
                    <el-input v-model="addForm.parameterOrProperty"></el-input>
                </el-form-item>
            </el-form>
            <!-- 确认按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addparameterOrPropertyBtn">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改参数/属性对话框 -->
        <el-dialog
        :title="'修改' + titleTxt"
        :visible.sync="upDialogVisible"
        width="40%"
        :before-close="upHandleClose">
            <!-- 添加表单内容 -->
            <el-form :model="upForm" :rules="upRules" ref="upFormRef" label-width="80px">
                <el-form-item :label="titleTxt" prop="parameterOrProperty">
                    <el-input v-model="upForm.parameterOrProperty"></el-input>
                </el-form-item>
            </el-form>
            <!-- 确认按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="upParameterOrPropertyBtn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'Params',
    // 数据
    data() {
        return {
            // 级联选择器选中的id数组
            cateKey:[],
            // 所有分类的数据
            cateList:[],
            // tabs标签页，所选择中的标签页
            activeName:'only',
            // 动态参数的参数数据
            onlyData:[],
            // 静态属性的属性数据
            manyData:[],
            // 控制添加参数/属性对话框的出现和隐藏
            addDialogVisible:false,
            // 添加参数/属性的表单数据
            addForm:{
                parameterOrProperty:''
            },
            // 添加参数/属性的表单验证规则
            addRules:{
                parameterOrProperty:[
                    { required: true, message: '输入不能为空', trigger: 'blur' },
                ]
            },
            // 控制修改参数/属性对话框的出现和隐藏
            upDialogVisible:false,
            // 修改参数/属性的表单数据
            upForm:{
                parameterOrProperty:''
            },
            // 修改参数/属性的表单验证规则
            upRules:{
                parameterOrProperty:[
                    { required: true, message: '输入不能为空', trigger: 'blur' },
                ]
            },
        }
    },
    // 计算属性
    computed:{
        titleTxt(){
            if(this.activeName === 'only') return '动态参数'
            return '静态属性'
        }
    },
    // 方法
    methods:{
        // 获取所有的分类数据
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('获取分类数据失败，请稍后重试！')
            // 请求成功
            this.cateList = res.data
        },
        // 级联选择器的内容发生变化时触发的回调
        handleChange(){
            // 清空上一次获取的数据
            this.onlyData=[]
            this.manyData=[]
            if(this.cateKey.length && this.cateKey.length !== 3){
                // 设置只能选取三级分类
                this.$message('请选择三级分类')
                this.cateKey = []
            }else if(this.cateKey.length === 3){
                // 正常选中三级分类，发送请求
                this.getOnlyOrMany()
            }
        },
        // Tabs标签页切换时触发的回调
        handleClick() {
            // 只有选择了三级分类才发请求
            if(this.cateKey.length === 3){
                // 如果onlyData和manyData中已经有数据了，就不要发送请求了。
                if(this.onlyData.length === 0 || this.manyData.length === 0){
                    this.getOnlyOrMany()
                }
            }
        },
        // 获取动态参数/静态属性的数据
        async getOnlyOrMany(){
            const {data:res} = await this.$http.get(`categories/${this.cateKey[this.cateKey.length-1]}/attributes`,
            {params:{sel:this.activeName}})
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('请求参数失败，请稍后重试')
            // 请求成功
            // 把attr_vals修改成数组
            res.data.forEach(item=>{
                item.attr_vals = item.attr_vals? item.attr_vals.split(' ') : [],
                // 控制添加参数下的描述出现与隐藏
                item.inputVisible = false
                // 添加参数下的描述的内容
                item.inputValue = ''
            })
            console.log(res.data);
            // 保存数据
            if(this.activeName === 'only'){  
                this.onlyData = res.data
            }else{
                this.manyData = res.data
            }
            // 
            console.log(this.onlyData);
            console.log(this.manyData);
        },
        // 控制添加参数/属性对话框，是否确认退出
        addHandleClose(done) {this.$confirm('你编辑的内容尚未提交,是否确认退出?').then(
        _ => {
            done();
            // 重置表单和验证规则
            this.$refs.addFormRef.resetFields()
            }).catch(
        _ => {});
        },
        // 点击了确认添加按钮
        async addparameterOrPropertyBtn(){
             // 验证当前所有输入框的验证是否全部通过
            this.$refs.addFormRef.validate(async boolean=>{
                // 验证未通过
                if(!boolean) return;
                // 验证已经通过，发送请求去添加数据
                const {data:res} = await this.$http.post(`categories/${this.cateKey[this.cateKey.length-1]}/attributes`,
                {attr_name:this.addForm.parameterOrProperty,attr_sel:this.activeName})
                // 请求失败
                if(res.meta.status !== 201) return this.$message.error('添加'+this.titleTxt+'失败')
                // 请求成功
                this.$message.success('添加'+this.titleTxt+'成功')
                // 关闭对话框
                this.addDialogVisible = false
                // 清空输入框
                this.addForm.parameterOrProperty = ''
                // 重新请求数据
                this.getOnlyOrMany()
            })
        },
        // 控制添加参数/属性对话框，是否确认退出
        upHandleClose(done) {this.$confirm('你编辑的内容尚未提交,是否确认退出?').then(
        _ => {
            done();
            // 重置表单和验证规则
            this.$refs.upFormRef.resetFields()
            }).catch(
        _ => {});
        },
        // 点击修改按钮，展示对话框
        async upParams(row){
            // 根据分类id和参数id获取到参数信息
            console.log(row);
            const cateId = this.cateKey[this.cateKey.length-1]
            // 记录一些这个id，下面 点击了修改添加按钮 要用
            this.attr_id = row.attr_id
            const {data:res} = await this.$http.get(`categories/${cateId}/attributes/${row.attr_id}`,
            {params:{attr_sel:this.activeName}})
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('获取'+ this.titleTxt +'信息失败，请稍后重试')
            // 请求成功
            this.upForm.parameterOrProperty = res.data.attr_name
            this.upDialogVisible = true
        },
        // 点击了修改添加按钮
        async upParameterOrPropertyBtn(){
             // 验证当前所有输入框的验证是否全部通过
            this.$refs.upFormRef.validate(async boolean=>{
                // 验证未通过
                if(!boolean) return;
                // 验证已经通过，发送请求去修改数据
                const {data:res} = await this.$http.put(`categories/${this.cateKey[this.cateKey.length-1]}/attributes/${this.attr_id}`,
                {attr_name:this.upForm.parameterOrProperty,attr_sel:this.activeName})
                // 请求失败
                if(res.meta.status !== 200) return this.$message('修改失败')
                // 请求成功
                this.$message.success('修改成功')
                // 关闭对话框
                this.upDialogVisible = false
                // 重新请求数据
                this.getOnlyOrMany()
            })
        },
        // 点击删除参数/属性
        deleteParams(row){
            this.$confirm('此操作将永久删除该'+this.titleTxt+', 是否继续?', '提示', {
            confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'
            }).then(async () => {
                // 确认删除
                const {data:res} = await this.$http.delete(`categories/${this.cateKey[this.cateKey.length-1]}/attributes/${row.attr_id}`)
                // 请求失败
                if(res.meta.status !== 200) return this.$message('删除失败,请稍后重试')
                // 请求成功
                this.$message.success('删除成功')
                // 重新请求数据
                this.getOnlyOrMany()
            }).catch(() => {
                // 取消删除
                return;
            });
        },
        // 完成了参数下的描述，去添加
        handleInputConfirm(row){
            // 检测输入框的内容是否合法
            if(row.inputValue.trim()){
                //合法
                // 将输入的内容追加到attr_vals中
                row.attr_vals.push(row.inputValue)
                // 发送请求去修改数据
                this.setAttr_vals(row,'add')
            }
            // 清空输入框
            row.inputValue = ''
            // 变回按钮
            row.inputVisible = false
        },
        // 点击添加参数下的描述
        showInput(row){
            row.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 发送请求去修改参数下的描述
        async setAttr_vals(row,top){
            const {data:res} = await this.$http.put(`categories/${this.cateKey[this.cateKey.length-1]}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
            })
            // 请求失败
            if(res.meta.status !== 200) {
                this.$message(top==='add'?'添加失败':'删除失败')
                // 重新获取数据
                return this.getOnlyOrMany()
            }
            // 请求成功
            this.$message.success(top==='add'?'添加成功':'删除成功')
        },
        // 删除参数下的某个描述
        handleClose(i,row) {
            // 在页面上删除
            row.attr_vals.splice(row.attr_vals.indexOf(i), 1);
            // 发送请求去删除
            this.setAttr_vals(row,'delete')
        }
    },
    // 生命周期钩子
    created(){
        // 调用获取所有分类数据的方法
        this.getCateList()
    } 
}
</script>

<style lang="less" scoped>
.el-cascader{
    margin: 15px 0;
}
.el-table{
    margin-top: 15px;
}
.el-tag,.el-input,.button-new-tag{
    margin: 0px 10px;
}
.input-new-tag{
    width: 120px;
}
</style>