<template>
  <div class="logincontainer">
    <el-form
      class="loginForm"
      :model="loginForm"
      ref="loginForm"
      :inline="false"
      size="normal"
      :rules="rules"
    >
      <el-form-item>
        <div class="loginTitle">系统登录</div>
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-row :gutter="20">
          <el-col :span="16" :offset="0">
            <el-input
              v-model="loginForm.code"
              placeholder="请输入验证码"
            ></el-input>
          </el-col>
          <el-col :span="8" :offset="0">
            <el-input v-model="loginForm.code"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-button
              @click="handlerLogin"
              class="btn"
              type="primary"
              size="default"
              >登录</el-button
            >
          </el-col>
          <el-col :span="12" :offset="0">
            <el-button class="btn" type="default" size="default"
              >取消</el-button
            >
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  //存储数据的地方，页面需要显示的数据，都需要显示的在data里面定义
  //双向绑定的
  data() {
    return {
      //登录数据域
      loginForm: {
        username: "admin",
        password: "1234",
        code: "354123",
      },
      //表单验证规则
      rules: {
        username: [
          {
            required: true,
            trigger: "change",
            message: "请输入用户名",
          },
        ],
        password: [
          {
            required: true,
            trigger: "change",
            message: "请输入密码",
          },
        ],
        code: [
          {
            required: true,
            trigger: "change",
            message: "请输入验证码",
          },
        ],
      },
    };
  },
  methods: {
    //登录提交事件
    handlerLogin() {
      this.$refs.loginForm.validate((valid) => {
        //2.如果表单验证通过
        if (valid) {
          this.loading = true;
          //3.调用登录
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.logincontainer {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginForm {
    height: 350px;
    width: 450px;
    box-shadow: 0 0 25px #cac6c6;
    border-radius: 10px;
    padding: 20px 35px;
    .loginTitle {
      font-size: 24px;
      font-weight: 600;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn {
      width: 100%;
    }
  }
}
</style>