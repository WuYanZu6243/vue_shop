<template>
    <div class="addGoods-container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 消息提示 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable='false'></el-alert>
            <!-- 步骤条 -->
            <el-steps :active="activeIndex - 0" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- Form表单 -->
            <el-form :model="addForm" :rules="addRules" ref="addFormref">
                <!-- Tabs标签页 -->
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave='toggleTab'>
                    <!-- 基本信息 -->
                    <el-tab-pane label="基本信息" name='0'>
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <!-- 级联选择器 -->
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="categories"
                                :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
                                clearable
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品参数 -->
                    <el-tab-pane label="商品参数" name='1'>
                        <!-- 渲染动态参数 -->
                        <el-form-item :label="item.attr_name" v-for="item in manyParams" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="i" v-for="(i,index) in item.attr_vals" :key="index"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品属性 -->
                    <el-tab-pane label="商品属性" name='2'>
                        <!-- 渲染静态属性 -->
                        <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品分类 -->
                    <el-tab-pane label="商品图片" name='3'>
                        <!-- 文件上传 -->
                        <el-upload
                        list-type="picture"
                        :action="action"
                        :headers='headers'
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success='handleSuccess'>
                        <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name='4'>
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce"/>
                        <!-- 提交按钮 -->
                        <el-button type="primary" class="addGoodsBtn" @click="addGoodsBtn">确认添加</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form >
        </el-card>
        <!-- 图片预览功能对话框 -->
        <el-dialog
        title="图片预览"
        :visible.sync="dialogVisible"
        width="35%">
        <img :src="previewPath" alt="">
        </el-dialog>
    </div>
</template>

<script>
// 导入深拷贝库
import _ from 'lodash'

export default {
    name:'AddGoods',
    // 数据
    data() {
        return {
            // 控制步骤条和TABS的跳转
            activeIndex:'0',
            // 添加商品表单数据
            addForm:{
                goods_name:'',
                goods_price:'',
                goods_weight:'',
                goods_number:'',
                goods_cat:[], // 选中的商品分类数组
                pics:[], // 商品图片存放地址
                goods_introduce:'', //商品介绍
                attrs:[] // 商品的参数，包括动态参数和静态属性 
            },
            // 添加商品表单验证规则
            addRules:{
                goods_name:[
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price:[
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight:[
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_number:[
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_cat:[
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ]
            },
            // 商品分类数据
            categories:[],
            // 商品分类的动态参数数据
            manyParams:[],
            // 商品分类的静态属性数据
            onlyParams:[],
            // 上传图片的存放地址
            action:'http://182.61.30.46:8889/api/private/v1/upload',
            // 上传图片的请求头信息
            headers:{Authorization : window.sessionStorage.getItem('token')},
            // 控制图片预览对话框的出现与隐藏
            dialogVisible:false,
            // 图片预览的图片访问地址
            previewPath:''
        }
    },
    // 计算属性
    computed:{
        // 三级分类的id
        CategorieId(){
            if(this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
            return null
        }
    },
    // 方法
    methods:{
        // 获取商品分类数据
        async getCategories(){
            const {data:res} = await this.$http.get('categories')
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('获取商品分类数据失败，请稍后重试')
            // 请求成功
            this.categories = res.data
        },
        // 获取分类的动态参数
        async getManyParams(){
            const {data:res} = await this.$http.get(`categories/${this.CategorieId}/attributes`,{
                params:{sel:'many'}
            })
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('获取商品分类的动态参数失败，请稍后重试')
            // 请求成功
            // 将attr_vals由字符串变数组
            res.data.forEach(item=>{
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            })
            // 赋值保存
            this.manyParams = res.data
        },
        // 获取分类的静态属性
        async getOnlyParams(){
            const {data:res} = await this.$http.get(`categories/${this.CategorieId}/attributes`,{
                params:{sel:'only'}
            })
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('获取商品分类的静态属性失败，请稍后重试')
            // 请求成功
            // 赋值保存
            this.onlyParams = res.data
        },
        // 级联选择器发送变化时触发
        handleChange(){
            // 只能选择三级分类
            const len = this.addForm.goods_cat.length
            if(len !== 0 && len!== 3){
                this.$message('请选择三级分类')
                this.addForm.goods_cat = []
            }
            // 调用获取分类的动态参数方法
            this.getManyParams()  
            // 调用获取分类的静态属性方法
            this.getOnlyParams()  
        },
        // 切换标签页时触发
        toggleTab(activeName, oldActiveName){
            // 判断是否完成了基本信息
            if(oldActiveName==='0'){
                // 判断当前符不符合切换到其它Tab页
                var isToggleTab = true;
                this.$refs.addFormref.validateField(['goods_name','goods_price','goods_weight','goods_number','goods_cat'],roles=>{
                    // 如果上面的那些字段的验证规则还没有通过，则roles的值为具体的验证规则；通过时，为空
                    if(roles) isToggleTab = false
                })
            }
            if(!isToggleTab){
                if(oldActiveName==='0') this.$message('请先完成基本信息的输入或选择')
            }
            return isToggleTab
        },
        // 点击已经上传完成的文件的回调,图片预览功能
        handlePreview(file){
            // 为图片预览对话框的img的src赋值
            this.previewPath = file.response.data.url
            // 让对话框展示
            this.dialogVisible = true
        },
        // 移除已完成文件时的回调
        handleRemove(file){
            // 获取将要删除的图片的临时路径
            const filePath = file.response.data.tmp_path
            // 从pics数组中，找到这个图片的索引值
            const fileIndex = this.addForm.pics.findIndex(x=>x.pic === filePath)
            // 调用数组的splice方法，把图片信息对象从pics数组中移除
            this.addForm.pics.splice(fileIndex,1)
            console.log(this.addForm.pics);
        },
        // 文件上传成功时的回调
        handleSuccess(response){
            // 把图片信息拼接成一个对象
            const picInfo = {'pic':response.data.tmp_path}
            // 将图片对象push到pice数组中
            this.addForm.pics.push(picInfo)
            console.log(this.addForm.pics);
        },
        // 点击了确认添加按钮，准备提交数据
        async addGoodsBtn(){
            // 深拷贝一份addForm对象,因为上传到服务器时，需要goods_cat是字符串，
            // 而页面上级联选择器需要goods_cat是数组，所以要深拷贝，为了互不干扰
            const form = _.cloneDeep(this.addForm)
            // 将选中的商品分类数组goods_cat由字符串转数组
            form.goods_cat = form.goods_cat.join(',')
            // 将每一项动态参数格式化处理后push到attrs中
            this.manyParams.forEach(item=>{
                const newInfo = {'attr_id':item.attr_id,'attr_value':item.attr_vals.join(' ')}
                form.attrs.push(newInfo)
            })
            // 将每一项静态属性格式化处理后push到attrs中
            this.onlyParams.forEach(item=>{
                const newInfo = {'attr_id':item.attr_id,'attr_value':item.attr_vals}
                form.attrs.push(newInfo)
            })
            // 发送请求，真正去添加商品
            const {data:res} = await this.$http.post('goods',form)
            // 请求失败
            if(res.meta.status !== 201) return this.$message.error('添加商品失败，请稍后重试')
            // 请求成功
            this.$message.success('添加商品成功')
            // 重定向回到商品列表页面
            this.$router.push('/home/goods')
        }
    },
    // 生命周期钩子
    created() {
        // 调用获取商品分类数据方法
        this.getCategories()  
    },
}
</script>

<style lang="less">
.el-steps{
    margin: 30px auto;
}
.el-form-item__label{
    display: block;
    width: 100%;
    text-align:left
}
.el-checkbox{
    margin: 2px 10px 2px 0px !important;
}
.el-dialog img{
    width: 100%;
}
.addGoodsBtn{
    margin-top: 15px;
}
</style>