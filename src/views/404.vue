<template>
  <div class="page-404">
    <el-button @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<script>
export default {
  name: "404"
};
</script>

<style lang="scss">
.page-404 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: url(../assets/404.jpg) border-box 0 / cover;
  .el-button {
    padding: 15px 20px;
    font-size: 18px;
    background: #e4f2fd;
    border: #e4f2fd;
    color: #74769c;
  }
}
</style>
