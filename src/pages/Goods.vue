<template>
  <div class="goods-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-input placeholder="请输入内容" v-model="queryInfo.query" class="goods-input"
      clearable @clear="seekGoods">
        <el-button slot="append" icon="el-icon-search" @click="seekGoods"></el-button>
      </el-input>
      <!-- 添加按钮 -->
      <el-button type="primary" @click="goAddGoods">添加商品</el-button>
      <!-- 表格 -->
      <el-table :data="goodList" border>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="120px">
        </el-table-column>
        <el-table-column label="创建时间" width="170px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"
            @click="removeGoodsById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
      :current-page="queryInfo.pagenum" :page-sizes="[10,15,20]" :page-size="queryInfo.pagesize" 
      layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
    name:'Goods',
    // 数据
    data() {
      return {
        // 请求参数 
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10
        },
        // 商品列表数据
        goodList:[],
        // 数据总条数
        total:0
      }
    },
    // 方法
    methods:{
      // 获取商品列表数据
      async gitgoodList(){
        const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
        // 请求失败
        if(res.meta.status !== 200) return this.$message.error('请求商品列表数据失败，请稍后重试')
        // 请求成功
        this.goodList = res.data.goods
        this.total = res.data.total
      },
      // 控制每页显示多少条数据
      handleSizeChange(val){
          this.queryInfo.pagesize = val
          // 重新发送请求获取用户列表数据
          this.gitgoodList()
      },
      // 控制当前页的页码
      handleCurrentChange(val){
          this.queryInfo.pagenum = val
          // 重新发送请求获取用户列表数据
          this.gitgoodList()
      },
      // 搜索商品
      seekGoods(){
        // 根据新的参数获取数据
        this.gitgoodList()
      },
      // 删除商品
      removeGoodsById(id){
        // 提示是否确认删除
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 确认删除
          // 发送请求
          const {data:res} = await this.$http.delete(`goods/${id}`)
          // 请求失败
          if(res.meta.status !== 200) return this.$message.error('删除商品失败,请稍后重试')
          // 请求成功
          this.$message.success('删除商品成功')
          // 重新发送请求
          this.gitgoodList()
        }).catch(() => {
          // 取消删除
          return;
        });          
      },
      // 跳去添加商品页面
      goAddGoods(){
        this.$router.push('goods/addGoods')
      }
    },
    // 生命周期钩子
    created(){
      // 调用获取商品列表数据
      this.gitgoodList()
    }

}
</script>

<style lang="less" scoped>
.goods-input{
  width: 30%;
  margin-right: 10px;
}
.el-table{
  margin-top: 15px;
}
</style>