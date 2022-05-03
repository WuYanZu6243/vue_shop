<template>
    <div class="rights-container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <template>
                <el-table :data="rightList" border stripe>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="authName" label="权限名称"></el-table-column>
                    <el-table-column prop="path" label="路径"></el-table-column>
                    <el-table-column label="权限等级">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                            <el-tag type="warning" v-else>三级</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-card>
    </div>
</template>

<script>
export default {
    name:'Rights',
    // 数据
    data() {
        return {
            rightList:[]
        }
    },
    // 方法
    methods:{
        // 发送请求，获取权限列表数据
        async getRightList(){
            const {data:res} = await this.$http.get('rights/list')
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('获取权限信息错误，请稍后重试')
            // 请求成功
            this.rightList = res.data
        }
    },
    // 生命周期钩子
    created(){
        // 调用 获取权限列表数据 方法
        this.getRightList()
    }
}
</script>

<style>

</style>