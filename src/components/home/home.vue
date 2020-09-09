<template>
<el-container class="container">
  <el-header class="header">
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <img src="../../assets/logo.png" alt="无法显示该图片" width="50px" height="50px">
        </div>
      </el-col>
      <el-col :span="18" class="middle">
        <h3>电商后台管理系统</h3>
      </el-col>
      <el-col :span="2">
        <div class="grid-content bg-purple">
          <a href="#" class="loginout">退出</a>
        </div>
      </el-col>
    </el-row>
  </el-header>
  <el-container>
    <el-aside class="aside" width="200px">Aside</el-aside>
    <el-main class="main">Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {

}
</script>

<style lang="">
.container {
  height: 100%;
}

.header {
  background-color: #b3c0d1;
}

.aside {
  background-color: #d3dcd6;
}

.main {
  background-color: #e9eef3;
}
/*头部样式*/
.middle{
  text-align: center;
}

.loginout{
  text-decoration: none;
  line-height: 60px;
}
</style>
