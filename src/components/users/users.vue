<template>
<el-card class="box-card">
  <!--面包屑-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--搜索-->
  <el-row class="searchRow">
    <el-col>
      <el-input @clear="loadUserList()" clearable placeholder="请输入内容" v-model="query" class="inputSelect">
        <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
    </el-col>
  </el-row>

  <!--表格-->
  <el-table :data="userlist" style="width: 100%">
    <el-table-column type="index" label="#" width="60">
    </el-table-column>
    <el-table-column prop="username" label="姓名" width="80">
    </el-table-column>
    <el-table-column prop="email" label="邮箱">
    </el-table-column>
    <el-table-column prop="mobile" label="电话">
    </el-table-column>
    <el-table-column label="创建日期">
      <!-- 如果单元格内显示的内容不是字符串，需要给被显示的内容外层包裹一个template -->

      <!-- template内部要用数据 设置slot-scope属性
      该属性的值是要用数据create_time的数据源userlist -->

      <!-- slot-scope的值userlist其实就是el-table绑定的数据userlist
      userlist.row->数组中的每个对象 -->
      <template slot-scope="userlist">
        {{userlist.row.create_time | fmtdate}}
      </template>
    </el-table-column>
    <el-table-column label="用户状态">
      <template slot-scope="scope">
        <el-switch 
        @change="changeMgState(scope.row)"
        v-model="scope.row.mg_state" 
        active-color="#13ce66" 
        inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button @click="showEditMsgBox(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
        <el-button @click="showSetUserBox(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        <el-button @click="showDeleteMsgBox(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
      </template>
    </el-table-column>
  </el-table>
  <!--分页-->
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
  </el-pagination>

  <!--对话框-->
  <!--1.添加用户的对话框-->
  <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
    <el-form :model="form">
      <el-form-item label="用户名" label-width="100px">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="密码" label-width="100px">
        <el-input v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" label-width="100px">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="电话" label-width="100px">
        <el-input v-model="form.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
      <el-button type="primary" @click="addUser()">确 定</el-button>
    </div>
  </el-dialog>

  <!--2.编辑用户的对话框-->
  <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
    <el-form :model="form">
      <el-form-item label="用户名" label-width="100px">
        <el-input disabled v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" label-width="100px">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="电话" label-width="100px">
        <el-input v-model="form.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
      <el-button type="primary" @click="editUser()">确 定</el-button>
    </div>
  </el-dialog>

  <!--3.分配角色的对话框-->
  <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
  <el-form :model="form">
    <el-form-item label="用户名" label-width="100px">
      {{curUserName}}
    </el-form-item>
    <el-form-item label="角色" label-width="100px">
      <el-select v-model="curRoleId">
        <el-option label="请选择" :value="-1"></el-option>
        <el-option 
        :label="item.roleName" 
        :value="item.id"
        v-for="(item, i) in roles"
        :key="i"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      // 表格绑定的数据
      userlist: [],
      // 分页相关的数据
      total: -1,
      pagenum: 1,
      pagesize: 2,
      // 添加对话框属性
      dialogFormVisibleAdd: false,
      // 编辑对话框属性
      dialogFormVisibleEdit: false,
      // 分配角色对话框属性
      dialogFormVisibleRol: false,
      // 添加用户的表单数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      curRoleId: -1,
      curUserName: '',
      //保存所有角色数据
      roles: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 分配角色
    async showSetUserBox(user) {
      this.curUserName = user.username

      // 获取所有角色
      const res1 = await this.$http.get(`roles`)
      console.log(res1)
      this.roles = res1.data.data

      // 获取当前用户的角色id ->rid
      const res = await this.$http.get(`users/${user.id}`)
      this.curRoleId = res.data.data.rid

      this.dialogFormVisibleRol = true
    },
    // 修改状态
    async changeMgState(user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      console.log(res)
    },
    // 编辑用户 - 发送请求
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form)
      if (res.data.meta.status === 200) {
        // 关闭对话框
        this.dialogFormVisibleEdit = false
        // 更新视图
        this.getUserList()
        this.$message.success("编辑成功")
      } else {
        this.$message.warning("编辑失败")
      }

    },
    // 编辑用户 - 显示对话框
    showEditMsgBox(user) {
      // 获取用户数据
      this.form = user
      this.dialogFormVisibleEdit = true
    },
    // 删除用户 - 打开消息盒子
    showDeleteMsgBox(userID) {
      this.$confirm('删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送删除请求
        // data中找userid
        // 把userid以参数形式传进来
        const res = await this.$http.delete(`users/${userID}`)
        if (res.data.meta.status === 200) {
          // 更新视图
          this.pagenum = 1
          this.getUserList()
          // 提示
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } else {
          this.$message.warning("删除失败")
        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 添加用户 发送请求
    async addUser() {
      // 2.关闭对话框
      this.dialogFormVisibleAdd = false

      const res = await this.$http.post(`users`, this.form)
      console.log(res)
      const {
        meta: {
          status,
          msg
        },
        data
      } = res.data
      if (status === 201) {
        // 1.提示
        this.$message.success(msg)
        // 3.刷新视图
        this.getUserList()
        // 4.清空文本框
        this.form = {}
      } else {
        this.$message.warning(msg)
      }
    },
    // 显示添加用户对话框
    showAddUserDia() {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    // 清除搜索框 重新获取数据
    loadUserList() {
      this.getUserList()
    },
    // 搜索用户
    searchUser() {
      this.getUserList()
    },
    // 分页相关方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val
      this.getUserList()
    },
    // 获取用户列表请求
    async getUserList() {
      // 需要授权的API,必须在请求头中使用Authorization字段提供token令牌
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      )
      console.log(res)
      const {
        meta: {
          status,
          msg
        },
        data: {
          users,
          total
        }
      } = res.data
      if (status === 200) {
        // 1.给表格数据赋值
        this.userlist = users
        // 2.给总数赋值
        this.total = total
        // 3.提示
        this.$message.success(msg)
      } else {
        // 提示
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style lang="">
.box-card {
  height: 100%;
}

.inputSelect {
  width: 500px;
}

.searchRow {
  margin-top: 20px;
}
</style>
