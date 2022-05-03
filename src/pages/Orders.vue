<template>
    <div class="orders-container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 搜索框 -->
            <el-input placeholder="请输入内容" clearable class="orders-input" >
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <!-- 表格区渲染 -->
            <template>
                <el-table :data="orders" border stripe>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="order_number" label="订单编号" ></el-table-column>
                    <el-table-column prop="order_price" label="订单价格" width="140px"></el-table-column>
                    <el-table-column prop="pay_status" label="是否付款" width="140px">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                            <el-tag type="danger" v-else>未付款</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_send" label="是否发货" width="140px"></el-table-column>
                    <el-table-column label="下单时间" width="180px">
                        <template slot-scope="scope">
                            {{scope.row.create_time | dateFormat}}
                        </template>
                    </el-table-column>
                    <!-- 操作区 -->
                    <el-table-column label="操作" width="180px">
                        <template slot-scope="scope">
                            <!-- 修改 -->
                            <el-button type="primary" icon="el-icon-edit" circle
                            @click="upSiteVisible = true"></el-button>
                            <!-- 时间线 -->
                            <el-button type="success" icon="el-icon-s-marketing" circle
                            @click="lookTimeline"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
            :current-page="ordersInfo.pagenum" :page-sizes="[5,10,15]" :page-size="ordersInfo.pagesize" 
            layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 省市区联动，修改地址对话框 -->
        <el-dialog
        title="修改地址"
        :visible.sync="upSiteVisible"
        width="30%">
            <!-- 修改地址表单 -->
            <el-form :model="upSiteForm" :rules="upSiteRules" ref="upSiteRef" label-width="100px">
                <el-form-item label="省市区/县" prop="site">
                    <!-- 级联选择器 -->
                    <el-cascader
                    v-model="upSiteForm.site"
                    :options="regionData"
                    @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="detailSite">
                    <el-input v-model="upSiteForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="upSiteVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 时间线对话框 -->
        <el-dialog
        title="物流信息"
        :visible.sync="timelineVisible"
        width="40%">
            <!-- 时间线 -->
            <el-timeline>
                <el-timeline-item
                v-for="(item, index) in timelineData"
                :key="index"
                :timestamp="item.time">
                {{item.context}}
                </el-timeline-item>
            </el-timeline>
            <!-- 关闭按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="timelineVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// 导入省市区数据
import {regionData} from 'element-china-area-data'

export default {
    name:'orders',
    // 数据
    data() {
        return {
            // 订单列表数据
            orders:[], 
            // 获取订单数据所需的参数
            ordersInfo:{ 
                query:'',
                pagenum:1,
                pagesize:6
            }, 
            // 订单的总条数
            total:0 ,
            // 修改地址的对话框展示和隐藏
            upSiteVisible:false,
            // 修改地址表单数据
            upSiteForm:{ 
                 site:[],
                 detailSite:''
            },
            // 修改地址表单验证规则
            upSiteRules:{
                site:[
                    { required: true, message: '请选择省市区/县', trigger: 'blur' }
                ],
                detailSite:[
                    { required: true, message: '请输入详细地址', trigger: 'blur' }
                ]
            },
            // 省市区数据 
            regionData,
            // 时间线对话框的隐藏和展示
            timelineVisible:false,
            // 物理进度数据
            timelineData:[]
        }
    },
    // 方法
    methods:{
        // 获取订单列表
        async getOrders(){
            const {data:res} = await this.$http.get('/orders',{params:this.ordersInfo})
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('获取订单数据失败，请稍后重试')
            // 请求成功
            this.orders = res.data.goods
            this.total = res.data.total
            console.log(this.orders);
            console.log(this.total);
        },
        // 控制每页显示多少条数据
        handleSizeChange(val){
            this.ordersInfo.pagesize = val
            // 重新发送请求获取用户列表数据
            this.getOrders()
        },
        // 控制当前页的页码
        handleCurrentChange(val){
            this.ordersInfo.pagenum = val
            // 重新发送请求获取用户列表数据
            this.getOrders()
        },
        // 级联选择器变化时触发
        handleChange(){
            console.log(this.upSiteForm.site);
        },
        // 查看物流进度
        async lookTimeline(){
            this.timelineVisible = true
            // 获取物流进度数据
            const {data:res} = await this.$http.get('/kuaidi/1106975712662')
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('请求物理数据失败，请稍后重试！')
            // 请求成功
            this.timelineData = res.data
            console.log(this.timelineData);
        }
    },
    // 生命周期钩子
    created(){
        // 调用 获取订单列表 数据
        this.getOrders()
    }
}
</script>

<style lang="less" scoped>
.orders-input{
    width: 450px;
    margin-bottom: 15px;
}
</style>