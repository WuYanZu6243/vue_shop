<template>
    <div class="report-container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- echarts图表 -->
            <div id="main" style="width: 1300px;height: 500px;"></div>
        </el-card>
    </div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'


export default {
    name:'Report',
    // 生命周期钩子
    async mounted(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        // 准备echarts实例数据
        var option = {
            title: { text: '用户来源'},
            tooltip: {}
        }
        // 请求服务器中折线图的数据
        const {data:res} = await this.$http.get('reports/type/1')
        console.log(res);

        // 真实数据和实例数据合并
        const result = _.merge(option,res.data)
        

        // 绘制图表
        myChart.setOption(result)
    }
}
</script>

<style>

</style>