<template>
  <div class="roles-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary" class="addBtn"
      @click="addRolesVisible = true">添加角色</el-button>
      <!-- 表格 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" 
            :class="['bottomBorder',i1 === 0 ? 'topBorder' : '','vertical-center']">
                <!-- 第一层 -->
                <el-col :span="6">
                    <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 第二、第三层 -->
                <el-col :span="18">
                    <el-row v-for="(item2,i2) in item1.children" :key="item2.id"
                    :class="i2 === 0 ? '' : 'topBorder'" class="vertical-center">
                        <!-- 第二层 -->
                        <el-col class="item2" :span="6">
                            <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 第三层 -->
                        <el-col class="item3Col" :span="18">
                            <el-tag class="item3" type="warning" v-for="item3 in item2.children" 
                            :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                                {{item3.authName}}
                            </el-tag>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" circle
            @click="upRoles(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" circle
            @click="deleteRoles(scope.row.id)"></el-button>
            <!-- 分配权限 -->
            <el-tooltip content="分配权限" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                @click="showAllotDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <AllotRights :allotDialogVisible="allotDialogVisible"
    @allotDialogOff="allotDialogOff" :allRights='allRights'
    :haveThreeRights='haveThreeRights' :roleId='roleId'/>
    <!-- 添加角色对话框 -->
    <el-dialog
    title="添加角色"
    :visible.sync="addRolesVisible"
    width="40%"
    :before-close="handleClose"
    @close='offAddRolrs'>
      <!-- 添加表单内容 -->
      <el-form :model="addRolesForm" :rules="RolesRules" ref="addRolesFormRef" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addRolesForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
                <el-input v-model="addRolesForm.roleDesc" type="roleDesc"></el-input>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddRolrsForm">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
    title="修改角色"
    :visible.sync="upRolesVisible"
    width="40%"
    :before-close="handleClose"
    @close='offUpRolrs'>
      <!-- 修改表单内容 -->
        <el-form :model="upRolesForm" :rules="RolesRules" ref="upRolesFormRef" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="upRolesForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
                <el-input v-model="upRolesForm.roleDesc" type="roleDesc"></el-input>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpRolrsForm">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入子组件
import AllotRights from '../components/rights/AllotRights.vue'

export default {
  name: "Roles",
  // 注册子组件
  components:{AllotRights},
  // 数据
  data() {
    return {
      // 角色列表数据
      roleList: [],
      // 控制分配权限对话框的展示与隐藏
      allotDialogVisible:false,
      // 分配权限对话框所需的所需要的数据
      allRights:[], // 所有的权限信息
      haveThreeRights:[],// 当前角色已经拥有的三级权限
      roleId:'',// 当前角色的id
      // 控制添加角色对话框的出现和隐藏
      addRolesVisible:false,
      // 添加角色表单
      addRolesForm:{
        roleName:'',
        roleDesc:''
      },
      // 角色表单验证规则
      RolesRules:{
        roleName:[{ required: true, message: '请输入角色名', trigger: 'blur' }]
      },
      // 控制修改角色对话框的出现和隐藏
      upRolesVisible:false,
      // 修改角色表单
      upRolesForm:{
        roleId:'',
        roleName:'',
        roleDesc:''
      }
    };
  },
  // 方法
  methods: {
    // 获取角色列表数据
    async getRilesList() {
      const { data: res } = await this.$http.get("roles");
      // 请求失败
      if (res.meta.status !== 200)
        return this.$message.error("获取角色信息错误，请稍后重试");
      // 请求成功
      this.roleList = res.data;
    },
    // 根据id值删除对应的权限
    async removeRightById(role,rightId){
        const confirmRemoveUser = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            // 确认删除时：confirmRemoveUser 为 confirm 。
            // 取消删除时：confirmRemoveUser 为 cancel
            // 取消删除
            if(confirmRemoveUser === 'cancel') return;
            // 确认删除：发送请求删除数据，提示
            const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('删除失败,请稍后重试')
            // 请求成功
            this.$message.success('删除成功')
            // 把数据赋回去
            role.children = res.data
    },
    // 自定义事件(用于关闭分配权限对话框的隐藏)
    allotDialogOff(){
      // 关闭分配权限对话框
      this.allotDialogVisible = false
      // 清空 当前角色已经拥有的三级权限 的列表
      this.haveThreeRights = []
      // 重新刷新页面
      this.getRilesList()
    },
    // 分离出三级权限的递归方法
    getTreeRight(node,arr){
      // 如果当前node节点不包含children属性，则是三级节点
      if(!node.children) return arr.push(node.id);
      // 当前不是三级节点
      node.children.forEach(item => {
        this.getTreeRight(item,arr)
      });
    },
    // 让分配权限对话框展示
    async showAllotDialog(row){
      // 记录当前已经拥有的三级权限信息
      this.getTreeRight(row,this.haveThreeRights)
      // 记录当前角色的id
      this.roleId = row.id
      // 打开分配权限对话框
      this.allotDialogVisible = true
      // 获取所有权限信息
      const {data:res} = await this.$http.get('rights/tree')
      // 请求失败
      if(res.meta.status !== 200) return this.$message.error('获取权限数据出错，请稍后重试');
      // 请求成功
      this.allRights = res.data
      console.log(res);
    },
    // 控制对话框，是否确认退出
    handleClose(done) {this.$confirm('你编辑的内容尚未提交,是否确认退出?').then(
    _ => {done();}).catch(
    _ => {});
    },
    // 关闭添加角色对话框的回调
    offAddRolrs(){
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addRolesFormRef.resetFields()
      // 初始化角色描述
      this.addRolesForm.roleDesc = ''
    },
    // 提交添加角色对话框
    submitAddRolrsForm(){
      // 验证当前所有输入框的验证是否全部通过
      this.$refs.addRolesFormRef.validate(async boolean=>{
          // 验证未通过
          if(!boolean) return;
          // 验证已经通过，发送请求去添加数据
          const {data:res} = await this.$http.post('roles',this.addRolesForm)
          // 添加失败
          if(res.meta.status !== 201 ) return this.$message.error(res.meta.msg);
          this.$message.success('添加角色成功!')
          this.addRolesVisible = false
          // 重新获取数据
          this.getRilesList()
      })
    },
    // 点击修改角色按钮，弹出对话框
    async upRoles(id){
      // 根据id获取角色数据
      const {data:res} = await this.$http.get(`roles/${id}`)
      // 请求失败
      if(res.meta.status !== 200 ) return this.$message.error(res.meta.msg);
      // 请求成功
      // 将数据赋给表单
      this.upRolesForm = res.data
      console.log(this.upRolesForm);
      this.upRolesVisible = true
    },
    // 关闭修改角色对话框的回调
    offUpRolrs(){
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.upRolesFormRef.resetFields()
    },
    // 提交修改角色对话框
    submitUpRolrsForm(){
      // 验证当前所有输入框的验证是否全部通过
      this.$refs.upRolesFormRef.validate(async boolean=>{
          // 验证未通过
          if(!boolean) return;
          // 验证已经通过，发送请求去添加数据
          const {data:res} = await this.$http.put(`roles/${this.upRolesForm.roleId}`,{
            roleName:this.upRolesForm.roleName,
            roleDesc:this.upRolesForm.roleDesc
          })
          // 添加失败
          if(res.meta.status !== 200 ) return this.$message.error(res.meta.msg);
          this.$message.success('修改角色信息成功!')
          this.upRolesVisible = false
          // 重新获取数据
          this.getRilesList()
      })
    },
    // 删除角色
    async deleteRoles(id){
      // 提示是否确认删除
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 确认删除
        // 发送请求
        const {data:res} = await this.$http.delete(`roles/${id}`)
        // 请求失败
        if(res.meta.status !== 200 ) return this.$message.error(res.meta.msg);
        // 请求成功
        this.$message.success('删除角色成功!')
        // 重新获取数据
        this.getRilesList()
      }).catch(() => {
        // 取消删除
        return;
      });          
    }
  },
  // 生命周期钩子
  created() {
    //调用 获取角色列表数据 方法
    this.getRilesList();
  },
};
</script>

<style lang="less" scoped>
// 添加按钮加大
.addBtn {
  width: 100px;
  height: 45px;
  margin-bottom: 15px;
}
.el-col{
    margin : 5px 0;
    text-align: center;
}
// 添加下边框
.bottomBorder{
    border-bottom: 1px solid rgb(230, 229, 229);
} 
// 添加上边框
.topBorder{
    border-top: 1px solid rgb(230, 229, 229);
}
// 垂直居中
.vertical-center{
    display: flex;
    align-items: center;
}
.item2{
    border-left: 1px solid rgb(230, 229, 229);
    border-right: 1px solid rgb(230, 229, 229);
}
.item3{
    margin: 5px;
}
.item3Col{
    text-align: left;
}
</style>