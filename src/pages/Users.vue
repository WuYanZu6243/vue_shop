<template>
    <div class="users-container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 搜索与添加用户按钮 -->
            <el-row :gutter="20">
                <!-- 搜索框 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="getUsersParam.query" 
                    clearable @clear='getUserList'>
                        <el-button slot="append" icon="el-icon-search"
                        @click="searchUsers"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加用户的按钮 -->
                <el-button type="primary" @click="addUserDialogVisible = true" >添加用户</el-button>
            </el-row>
            <!-- 表格区渲染 -->
            <template>
                <el-table :data="userList" border stripe>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="username" label="用户名"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column prop="mobile" label="电话"></el-table-column>
                    <el-table-column prop="role_name" label="角色"></el-table-column>
                    <!-- 状态区域 -->
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.mg_state"
                            @change="switchState(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <!-- 操作区 -->
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- 修改 -->
                            <el-button type="primary" icon="el-icon-edit" circle
                            @click="updateUser(scope.row.id)"></el-button>
                            <!-- 删除 -->
                            <el-button type="danger" icon="el-icon-delete" circle
                            @click="removeUser(scope.row.id)"></el-button>
                            <!-- 分配权限 -->
                            <el-tooltip content="分配角色" placement="top"
                            :enterable='false'>
                                <el-button type="warning" icon="el-icon-setting" 
                                circle @click="allotRightsBtn(scope.row)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
            :current-page="getUsersParam.pagenum" :page-sizes="[2,4,6]" :page-size="getUsersParam.pagesize" 
            layout="total, sizes, prev, pager, next, jumper" :total="userListTotal">
            </el-pagination>
        </el-card>
        <!-- 添加用户 -->
        <AddUser :addUserDialogVisible="addUserDialogVisible" @addUserDialogOff="addUserDialogOff"/>
        <!-- 更新用户信息 -->
        <UpdateUser :UpdateUserDialogVisible="UpdateUserDialogVisible" 
        @UpdateUserDialogOff="UpdateUserDialogOff" :updateUserData='updateUserData'/>
        <!-- 分配角色 -->
        <AllotRoles :allotRolesDialogVisible="allotRolesDialogVisible" 
        @allotRolesDialogOff="allotRolesDialogOff" :allRoles='allRoles'
        :allotRolesUser='allotRolesUser'/>
    </div>
</template>

<script>
// 导入子组件
import AddUser from '../components/users/AddUser.vue'
import UpdateUser from '../components/users/UpdateUser.vue'
import AllotRoles from '../components/users/AllotRoles.vue'

export default {
    name: "Users",
    // 注册子组件
    components:{AddUser,UpdateUser,AllotRoles},
    // 数据
    data() {
        return {
            // 获取用户列表数据时需要的传参
            getUsersParam:{
                query:'',
                pagenum:1,
                pagesize:6
            },
            // 用户列表数据
            userList:[],
            // 用户列表数据总条数
            userListTotal:0,
            // 控制添加用户对话框的出现和隐藏
            addUserDialogVisible:false,
            // 控制修改用户信息对话框的出现和隐藏
            UpdateUserDialogVisible:false,
            // 被修改的用户的数据
            updateUserData:{},
            // 控制分配角色对话框的出现与隐藏
            allotRolesDialogVisible:false,
            // 所有角色的数据
            allRoles:[],
            // 当前进行分配角色的用户数据
            allotRolesUser:[]
        }
    },
    // 方法
    methods:{
        // 获取用户列表数据
        async getUserList(){
            // 发送请求获取数据
            const {data:res} = await this.$http.get('/users',{params:this.getUsersParam})
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('获取用户数据出错,请稍后重试!')
            // 请求成功
            this.userList = res.data.users
            this.userListTotal = res.data.total
        },
        // 发送请求区切换数据库中用户的状态
        async switchState(row){
            // 发送请求
            const {data:res} = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
            // 请求失败
            if(res.meta.status !== 200){
                // 把状态恢复到修改前，因为失败了
                row.mg_state = !row.mg_state
                return this.$message.error('修改权限失败,请稍后重试!')
            }
        },
        // 控制每页显示多少条数据
        handleSizeChange(val){
            this.getUsersParam.pagesize = val
            // 重新发送请求获取用户列表数据
            this.getUserList()
        },
        // 控制当前页的页码
        handleCurrentChange(val){
            this.getUsersParam.pagenum = val
            // 重新发送请求获取用户列表数据
            this.getUserList()
        },
        // 根据搜索框的内容搜索用户
        searchUsers(){
            // 获取用户列表数据时需要的传参已经更新，重新发送请求获取用户列表数据
            this.getUserList()
        },
        // 给子组件绑定自定义事件的回调(添加用户组件有关)
        addUserDialogOff(){
            this.addUserDialogVisible = false
            // 重新获取数据
            this.getUserList()
        },
        // 给子组件绑定自定义事件的回调(修改用户组件有关)
        UpdateUserDialogOff(){
            this.UpdateUserDialogVisible = false
            // 重新获取数据
            this.getUserList()
        },
        // 根据id删除用户
        async removeUser(id){
            const confirmRemoveUser = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            // 确认删除时：confirmRemoveUser 为 confirm 。
            // 取消删除时：confirmRemoveUser 为 cancel
            // 取消删除
            if(confirmRemoveUser === 'cancel') return;
            // 确认删除：发送请求删除数据，提示，重新获取数据
            const {data:res} = await this.$http.delete(`users/${id}`)
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            // 请求成功
            this.$message.success('删除成功')
            // 重新获取数据
            this.getUserList()
        },
        // 点击修改用户
        async updateUser(id){
            this.UpdateUserDialogVisible = true
            // 根据id值获取jiangya
            const {data:res} = await this.$http.get(`users/${id}`)
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('获取用户信息错误，请稍后重试')
            // 请求成功
            this.updateUserData = {
                id:res.data.id,
                username:res.data.username,
                email:res.data.email,
                mobile:res.data.mobile
            }
        },
        // 给子组件绑定自定义事件的回调(分配角色组件有关)
        allotRolesDialogOff(){
            this.allotRolesDialogVisible = false
            // 重新获取数据
            this.getUserList()
        },
        // 点击了分配角色的按钮
        async allotRightsBtn(row){
            // 获取所有角色数据
            const {data:res} = await this.$http.get('roles')
            // 请求失败
            if(res.meta.status !== 200) return this.$message.error('获取角色数据出错,请稍后重试')
            // 请求成功
            this.allRoles = res.data
            this.allotRolesUser = row
            this.allotRolesDialogVisible = true
        }
    },
    // 生命周期钩子
    created(){
        // 调用：获取用户列表数据 方法
        this.getUserList()
    }
};
</script>

<style lang="less" scoped>
    .el-row{
        margin-bottom: 15px;
    }
</style>