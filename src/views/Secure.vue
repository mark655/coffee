<template>
  <div class="secure">
    <van-nav-bar title="安全中心" left-text="返回" left-arrow @click-left="back" />
    <div class="list-box">
      <van-cell-group>
        <van-cell title="修改密码" is-link @click="openPopup" />
        <van-cell title="注销账号" is-link @click="destroy" />
      </van-cell-group>
    </div>
    <div class="logout">
      <van-button :round="true" :block="true" type="danger" @click="logout">退出登录</van-button>
    </div>
    <van-popup v-model="isOpen" position="bottom">
      <div class="v-popup">
        <van-form @submit="commit">
          <van-field v-model="pwds.oldPassword" label="旧密码" placeholder="旧密码" />
          <van-field v-model="pwds.password" type="text" label="新密码" placeholder="新密码" />
          <div class="btn-box">
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
import "../assets/css/secure.less";
import validForm from "../assets/js/validForm";
export default {
  data() {
    return {
      isOpen: false,
      pwds: {
        oldPassword: "",
        password: ""
      }
    };
  },

  methods: {
    //返回
    back() {
      this.$router.go(-1);
    },

    //显示修改密码框
    openPopup() {
      this.isOpen = true;
    },

    //提交修改密码
    commit() {
      if (!validForm.validUserForm(this.pwds)) {
        return;
      }

      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString,
          //新的密码
          password: this.pwds.password,
          //旧密码
          oldPassword: this.pwds.oldPassword
        }
      })
        .then(result => {
          this.$toast.clear();
          
          //关闭修改密码弹出框
          this.isOpen = false;
          if (result.data.code == "E001") {
            //清除token
            localStorage.removeItem("__Tk");
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //退出登录
    logout() {
      localStorage.removeItem("__Tk");
      this.$router.push({ name: "Login" });
    },

    //注销
    destroy() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "一旦注销，数据无法恢复"
        })
        .then(() => {
          // on confirm
          //发起注销请求
          
          let tokenString = localStorage.getItem("__Tk");

          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0
          });

          this.axios({
            method: "POST",
            url: "/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString
            }
          })
            .then(result => {
              this.$toast.clear();
              

              if (result.data.code == 'G001') {
                //清除token
                localStorage.removeItem('__Tk');
                this.$router.push({name: 'Login'});
              } else {
                this.$toast(result.data.msg);
              }
            })
            .catch(err => {
              this.$toast.clear();
              
            });
        })
        .catch(err => {
          
        });
    }
  }
};
</script>